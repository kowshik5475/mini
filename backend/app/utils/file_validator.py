"""
File validation helpers for Phase 2.

Responsible for:
- checking an uploaded file's extension against an allow-list
- rejecting empty files
- rejecting files above a configured size limit
- producing a safe, collision-resistant filename that never trusts
  the original browser-supplied name directly
"""

from __future__ import annotations

import os
import re
import uuid
from dataclasses import dataclass


class UploadValidationError(Exception):
    """Raised when an uploaded file fails validation.

    `status_code` lets the route layer translate this into the right
    HTTP response without needing to know validation details.
    """

    def __init__(self, message: str, status_code: int = 400):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


@dataclass
class ValidationResult:
    extension: str  # without the leading dot, lowercase, e.g. "docx"
    size: int  # bytes


def get_extension(filename: str) -> str:
    """Return the lowercase extension (without dot) of a filename, or ''."""
    if not filename or "." not in filename:
        return ""
    return filename.rsplit(".", 1)[-1].lower()


def validate_extension(filename: str, allowed_extensions: set[str]) -> str:
    ext = get_extension(filename)
    if ext not in allowed_extensions:
        allowed_list = ", ".join(sorted(f".{e}" for e in allowed_extensions))
        raise UploadValidationError(
            f"Unsupported file type '.{ext or 'unknown'}'. Allowed types: {allowed_list}."
        )
    return ext


def validate_not_empty(content: bytes) -> None:
    if len(content) == 0:
        raise UploadValidationError("The uploaded file is empty.")


def validate_size(content: bytes, max_mb: int) -> None:
    max_bytes = max_mb * 1024 * 1024
    if len(content) > max_bytes:
        raise UploadValidationError(
            f"File is too large. Maximum allowed size is {max_mb} MB.", status_code=413
        )


def validate_upload(filename: str, content: bytes, allowed_extensions: set[str], max_mb: int) -> ValidationResult:
    """Run all validation checks and return basic metadata on success."""
    ext = validate_extension(filename, allowed_extensions)
    validate_not_empty(content)
    validate_size(content, max_mb)
    return ValidationResult(extension=ext, size=len(content))


_SAFE_CHARS_RE = re.compile(r"[^a-zA-Z0-9_-]+")


def make_safe_filename(original_filename: str, extension: str) -> str:
    """Derive a filesystem-safe, unique filename from an untrusted name.

    Never uses the browser-supplied path or filename directly -- this
    avoids path traversal (e.g. "../../evil.docx") and filesystem-unsafe
    characters, while keeping the name loosely recognizable.
    """
    base = os.path.basename(original_filename or "file")
    base = base.rsplit(".", 1)[0] if "." in base else base
    base = base.strip().lower().replace(" ", "_")
    base = _SAFE_CHARS_RE.sub("", base) or "file"
    base = base[:60]  # keep filenames reasonable length

    unique_id = uuid.uuid4().hex[:10]
    return f"{base}_{unique_id}.{extension}"
