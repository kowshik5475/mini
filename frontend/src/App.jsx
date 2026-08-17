import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Sidebar from './components/Sidebar.jsx'
import Home from './pages/Home.jsx'
import Dashboard from './pages/Dashboard.jsx'
import CreateReport from './pages/CreateReport.jsx'
import TemplateUpload from './pages/TemplateUpload.jsx'
import RawFiles from './pages/RawFiles.jsx'
import TemplateAnalysis from './pages/TemplateAnalysis.jsx'
import ContentMapping from './pages/ContentMapping.jsx'
import ReportPreviewPage from './pages/ReportPreviewPage.jsx'

export default function App() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="app-shell">
      <Navbar />
      <div className={isHome ? 'app-body app-body--full' : 'app-body'}>
        {!isHome && <Sidebar />}
        <main className={isHome ? 'app-main app-main--full' : 'app-main'}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create" element={<CreateReport />} />
            <Route path="/template" element={<TemplateUpload />} />
            <Route path="/files" element={<RawFiles />} />
            <Route path="/analysis" element={<TemplateAnalysis />} />
            <Route path="/mapping" element={<ContentMapping />} />
            <Route path="/preview" element={<ReportPreviewPage />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
