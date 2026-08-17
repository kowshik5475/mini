"""
Phase 3 analysis route.

    POST /api/analyze/template  { "filename": "sample_report_abc123.docx" }

Looks the file up inside uploads/templates/ (by the safe filename returned
from the Phase 2 upload), analyzes it with python-docx, and returns
structure only. No AI, no report generation.
"""

import os

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.docx_analyzer import DocxAnalysisError, analyze_docx

router = APIRouter(prefix="/api/analyze", tags=["analysis"])

BACKEND_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
TEMPLATES_DIR = os.path.join(BACKEND_ROOT, "uploads", "templates")


class AnalyzeTemplateRequest(BaseModel):
    filename: str


def _resolve_template_path(filename: str) -> str:
    """Resolve a stored filename to a path inside TEMPLATES_DIR, refusing
    anything that would escape that directory (e.g. '../' tricks)."""
    candidate = os.path.normpath(os.path.join(TEMPLATES_DIR, filename))
    if not candidate.startswith(TEMPLATES_DIR + os.sep):
        raise HTTPException(status_code=400, detail="Invalid filename.")
    return candidate


@router.post("/template")
async def analyze_template(payload: AnalyzeTemplateRequest):
    filename = payload.filename.strip()
    if not filename:
        raise HTTPException(status_code=400, detail="A filename is required.")

    if not filename.lower().endswith(".docx"):
        raise HTTPException(
            status_code=400, detail="DOCX analysis is currently supported."
        )

    file_path = _resolve_template_path(filename)

    if not os.path.isfile(file_path):
        raise HTTPException(
            status_code=404,
            detail="Template file not found. Please upload it again.",
        )

    try:
        analysis = analyze_docx(file_path, original_filename=filename)
    except DocxAnalysisError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc
    except Exception as exc:  # pragma: no cover - never leak internals
        raise HTTPException(
            status_code=500,
            detail="Something went wrong while analyzing the document. Please try again.",
        ) from exc

    return {"success": True, **analysis}
