import { createContext, useContext, useState } from 'react'

const ReportWorkflowContext = createContext(null)

/**
 * Minimal shared state for the multi-step report workflow.
 * Phase 3 only needs the uploaded template's stored filename (returned by
 * the Phase 2 upload) so the Analysis page can ask the backend to analyze
 * it without re-uploading the file.
 */
export function ReportWorkflowProvider({ children }) {
  const [template, setTemplate] = useState(null) // { filename, originalFilename, size }

  return (
    <ReportWorkflowContext.Provider value={{ template, setTemplate }}>
      {children}
    </ReportWorkflowContext.Provider>
  )
}

export function useReportWorkflow() {
  const ctx = useContext(ReportWorkflowContext)
  if (!ctx) {
    throw new Error('useReportWorkflow must be used within a ReportWorkflowProvider')
  }
  return ctx
}
