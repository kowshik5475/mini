// Central place for all backend communication.
// Components should never call fetch() directly for uploads -- they
// call the functions below instead, so the API base URL and error
// handling only live in one place.

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

/**
 * A friendly, displayable error. Thrown instead of letting raw
 * fetch/network errors or backend stack traces reach the UI.
 */
export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function postFile(path, file) {
  const formData = new FormData()
  formData.append('file', file)

  let response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      body: formData,
    })
  } catch (networkError) {
    // fetch() throws on network failure / server unreachable / CORS block.
    throw new ApiError(
      'Unable to reach the server. Please check that the backend is running.'
    )
  }

  let data = null
  try {
    data = await response.json()
  } catch {
    // Response wasn't JSON (e.g. a raw 500 HTML page) -- don't leak it.
    data = null
  }

  if (!response.ok) {
    const message =
      (data && data.detail) ||
      'Something went wrong while uploading the file. Please try again.'
    throw new ApiError(message, response.status)
  }

  return data
}

/** Upload a template file (.docx / .pdf). */
export function uploadTemplate(file) {
  return postFile('/api/upload/template', file)
}

/** Upload a single raw project file (.docx/.pdf/.txt/.csv/images). */
export function uploadRawFile(file) {
  return postFile('/api/upload/raw', file)
}

/**
 * Ask the backend to analyze an already-uploaded template by its stored
 * filename (the `filename` returned from uploadTemplate), rather than
 * re-uploading the file.
 */
export async function analyzeTemplate(filename) {
  let response
  try {
    response = await fetch(`${API_URL}/api/analyze/template`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename }),
    })
  } catch (networkError) {
    throw new ApiError(
      'Unable to reach the server. Please check that the backend is running.'
    )
  }

  let data = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    const message =
      (data && data.detail) ||
      'Something went wrong while analyzing the document. Please try again.'
    throw new ApiError(message, response.status)
  }

  return data
}
