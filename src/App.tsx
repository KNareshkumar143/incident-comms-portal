import { Bell, ChevronDown, History, LayoutDashboard, Menu, MoreHorizontal, Settings, ShieldCheck, Sparkles } from 'lucide-react'
import { BrowserRouter, NavLink, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import DashboardPage from './pages/DashboardPage'
import ComposerPage from './pages/ComposerPage'
import ApprovalQueuePage from './pages/ApprovalQueuePage'
import HistoryPage from './pages/HistoryPage'
import IncidentDetailsPage from './pages/IncidentDetailsPage'
import { type RootState } from './store'
import './App.css'

function Shell() {
  const location = useLocation()
  const incidents = useSelector((state: RootState) => state.incidents)
  const pendingCount = incidents.filter((item) => item.communication === 'Pending Shift Lead Approval').length
  const currentPage = location.pathname.startsWith('/approvals') ? 'Approval queue' : location.pathname.startsWith('/history') ? 'Communication history' : location.pathname.startsWith('/communications') ? 'New communication' : 'Incident dashboard'
  const navItems = [
    { label: 'Incident dashboard', icon: LayoutDashboard, to: '/incidents' },
    { label: 'Approval queue', icon: ShieldCheck, to: '/approvals', count: pendingCount },
    { label: 'Communication history', icon: History, to: '/history' },
  ]

  return <div className="app-shell">
    <aside className="sidebar"><div className="brand"><div className="brand-mark"><Sparkles size={17} /></div><span>Signal<span className="brand-muted">desk</span></span></div><div className="workspace-switcher"><div className="workspace-dot" /><div><strong>Customer comms</strong><small>Operations workspace</small></div><ChevronDown size={15} /></div><nav><span className="nav-label">Workspace</span>{navItems.map(({ label, icon: Icon, to, count }) => <NavLink className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} key={to} to={to}><Icon size={17} /><span>{label}</span>{count ? <em>{count}</em> : null}</NavLink>)}</nav><div className="sidebar-bottom"><button className="nav-item"><Settings size={17} /><span>Workspace settings</span></button><div className="profile"><div className="avatar">NK17</div><div><strong>NK17</strong><small>Engineer</small></div><MoreHorizontal size={16} /></div></div></aside>
    <main className="main-content"><header className="topbar"><button className="mobile-menu"><Menu size={20} /></button><div className="breadcrumb"><span>Operations</span><span>/</span><strong>{currentPage}</strong></div><div className="top-actions"><button className="icon-button" title="Notifications"><Bell size={18} /><i /></button><div className="top-avatar">NK17</div></div></header><Outlet /></main>
  </div>
}

function App() {
  return <BrowserRouter><Routes><Route element={<Shell />}><Route path="/" element={<DashboardPage />} /><Route path="/incidents" element={<DashboardPage />} /><Route path="/incidents/:incidentId" element={<IncidentDetailsPage />} /><Route path="/communications/new" element={<ComposerPage />} /><Route path="/communications/:incidentId/edit" element={<ComposerPage />} /><Route path="/approvals" element={<ApprovalQueuePage />} /><Route path="/history" element={<HistoryPage />} /></Route></Routes></BrowserRouter>
}

export default App
