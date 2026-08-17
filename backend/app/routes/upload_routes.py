"""
Phase 2 upload routes.

Two endpoints only:
    POST /api/upload/template  -> saved into uploads/templates/
    POST /api/upload/raw       -> saved into uploads/raw_files/

No parsing, no AI, no database. Just: validate, save, report back.
"""

import os

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.utils.file_validator import (
    UploadValidationError,
    make_safe_filename,
    validate_upload,
)

router = APIRouter(prefix="/api/upload", tags=["uploads"])

# Resolve uploads/ relative to the backend/ project root, not the CWD,
# so it works the same whether uvicorn is launched from backend/ or elsewhere.
BACKEND_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
TEMPLATES_DIR = os.path.join(BACKEND_ROOT, "uploads", "templates")
RAW_FILES_DIR = os.path.join(BACKEND_ROOT, "uploads", "raw_files")

TEMPLATE_EXTENSIONS = {"docx", "pdf"}
RAW_FILE_EXTENSIONS = {"docx", "pdf", "txt", "csv", "jpg", "jpeg", "png"}

MAX_UPLOAD_MB = int(os.environ.get("MAX_UPLOAD_MB", "20"))

os.makedirs(TEMPLATES_DIR, exist_ok=True)
os.makedirs(RAW_FILES_DIR, exist_ok=True)


def _save_upload(upload: UploadFile, allowed_extensions: set[str], target_dir: str) -> dict:
    content = upload.file.read()

    try:
        result = validate_upload(
            filename=upload.filename or "",
            content=content,
            allowed_extensions=allowed_extensions,
            max_mb=MAX_UPLOAD_MB,
        )
    except UploadValidationError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc

    safe_name = make_safe_filename(upload.filename or "file", result.extension)
    destination = os.path.join(target_dir, safe_name)

    with open(destination, "wb") as f:
        f.write(content)

    return {
        "success": True,
        "filename": safe_name,
        "original_filename": upload.filename,
        "size": result.size,
        "type": result.extension,
    }


@router.post("/template")
async def upload_template(file: UploadFile = File(...)):
    try:
        info = _save_upload(file, TEMPLATE_EXTENSIONS, TEMPLATES_DIR)
    except HTTPException:
        raise
    except Exception as exc:  # pragma: no cover - safety net, never leak internals
        raise HTTPException(
            status_code=500, detail="Unable to save the template. Please try again."
        ) from exc

    info["message"] = "Template uploaded successfully"
    return info


@router.post("/raw")
async def upload_raw_file(file: UploadFile = File(...)):
    try:
        info = _save_upload(file, RAW_FILE_EXTENSIONS, RAW_FILES_DIR)
    except HTTPException:
        raise
    except Exception as exc:  # pragma: no cover
        raise HTTPException(
            status_code=500, detail="Unable to save the file. Please try again."
        ) from exc

    info["message"] = "File uploaded successfully"
    return info
