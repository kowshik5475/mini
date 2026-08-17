import { useRef, useState } from 'react'
import FileCard from './FileCard.jsx'
import { ApiError } from '../services/api.js'

let idCounter = 0
const nextId = () => `upload-${Date.now()}-${idCounter++}`

/**
 * Drag-and-drop upload zone wired to a real backend upload.
 *
 * Props:
 *  - uploadFn(file): Promise -> called once per selected file, must resolve
 *    with { filename, size, type, ... } on success or throw ApiError on failure
 *  - multiple: allow selecting/uploading more than one file
 *  - accept: input[type=file] accept attribute (e.g. ".docx,.pdf")
 *  - onItemsChange(items): called whenever the upload list changes, so the
 *    parent page can know overall progress/completion without re-fetching
 */
export default function FileUpload({
  title,
  description,
  formats,
  accept,
  multiple = false,
  uploadFn,
  onItemsChange,
  inputId,
}) {
  const [isActive, setIsActive] = useState(false)
  const [items, setItems] = useState([])
  const inputRef = useRef(null)

  const updateItems = (updater) => {
    setItems((prev) => {
      const next = updater(prev)
      onItemsChange?.(next)
      return next
    })
  }

  const startUpload = async (file) => {
    const id = nextId()

    updateItems((prev) => [
      ...(multiple ? prev : []),
      { id, file, name: file.name, status: 'uploading' },
    ])

    try {
      const result = await uploadFn(file)
      updateItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status: 'success', size: result.size, result }
            : item
        )
      )
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Upload failed. Please try again.'
      updateItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: 'error', errorMessage: message } : item
        )
      )
    }
  }

  const handleFiles = (fileList) => {
    const files = Array.from(fileList || [])
    if (files.length === 0) return
    const toUpload = multiple ? files : [files[0]]
    toUpload.forEach((file) => startUpload(file))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleChange = (e) => {
    handleFiles(e.target.files)
    // allow re-selecting the same file name after a failed upload
    e.target.value = ''
  }

  return (
    <div>
      <div
        className={`upload-zone ${isActive ? 'upload-zone--active' : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setIsActive(true)
        }}
        onDragLeave={() => setIsActive(false)}
        onDrop={handleDrop}
      >
        <div className="upload-zone__icon">📤</div>
        <div className="upload-zone__title">{title}</div>
        <div className="upload-zone__desc">{description}</div>
        {formats && <div className="upload-zone__formats">{formats}</div>}
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => inputRef.current?.click()}
        >
          Browse Files
        </button>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
        />
      </div>

      {items.length > 0 && (
        <div className="file-list">
          {items.map((item) => (
            <FileCard
              key={item.id}
              name={item.name}
              size={item.size}
              status={item.status}
              errorMessage={item.errorMessage}
            />
          ))}
        </div>
      )}
    </div>
  )
}
