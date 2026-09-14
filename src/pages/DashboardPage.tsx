import { CalendarDays, Eye, Filter, History, Plus, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import type { RootState } from '../store'
import { Badge } from '../components/StatusBadge'

const communicationStatuses = ['All statuses', 'Not Started', 'Draft Saved', 'Pending Shift Lead Approval', 'Approved', 'Sent', 'Rejected', 'Failed']
const approvalStatuses = ['All approvals', 'Pending', 'Approved', 'Rejected']

export default function DashboardPage() {
  const incidents = useSelector((state: RootState) => state.incidents)
  const [query, setQuery] = useState('')
  const [communicationStatus, setCommunicationStatus] = useState('All statuses')
  const [approvalStatus, setApprovalStatus] = useState('All approvals')
  const [date, setDate] = useState('')
  const filteredIncidents = useMemo(() => incidents.filter((incident) => {
    const text = [incident.id, incident.title, incident.region, incident.customer, incident.service, incident.severity].join(' ').toLowerCase()
    const matchesQuery = text.includes(query.toLowerCase())
    const matchesCommunication = communicationStatus === 'All statuses' || incident.communication === communicationStatus
    const matchesApproval = approvalStatus === 'All approvals' || (incident.approvalStatus ?? 'Pending') === approvalStatus
    const matchesDate = !date || incident.incidentDate === date
    return matchesQuery && matchesCommunication && matchesApproval && matchesDate
  }), [approvalStatus, communicationStatus, date, incidents, query])

  return <section className="page-section fade-in">
    <div className="page-heading"><div><div className="eyebrow">Customer communication</div><h1>Incident dashboard</h1><p>Find communication-qualified incidents and take the next workflow action.</p></div><Link className="primary-button" to="/communications/new"><Plus size={17} /> New communication</Link></div>
    <div className="metric-row"><div><span>Communication-qualified</span><strong>{incidents.length}</strong><small className="positive">IcM synchronized</small></div><div><span>Awaiting approval</span><strong>{incidents.filter((item) => item.communication === 'Pending Shift Lead Approval').length}</strong><small className="attention">Needs review</small></div><div><span>Sent this month</span><strong>{incidents.filter((item) => item.communication === 'Sent').length}</strong><small className="positive">Delivery tracked</small></div></div>
    <div className="toolbar dashboard-filters"><div className="search-box"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search ID, service, severity, customer, region..." /></div><div className="filter-select"><Filter size={16} /><select value={communicationStatus} onChange={(event) => setCommunicationStatus(event.target.value)}>{communicationStatuses.map((status) => <option key={status}>{status}</option>)}</select></div><div className="filter-select"><select value={approvalStatus} onChange={(event) => setApprovalStatus(event.target.value)}>{approvalStatuses.map((status) => <option key={status}>{status}</option>)}</select></div><label className="date-filter"><CalendarDays size={16} /><input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label></div>
    <div className="table-card"><div className="table-caption"><strong>Communication-qualified incidents</strong><span>{filteredIncidents.length} of {incidents.length} incidents</span></div><div className="table-scroll"><table><thead><tr><th>Incident ID</th><th>Region</th><th>Incident title</th><th>Severity</th><th>Customer name</th><th>Service / workload</th><th>Incident status</th><th>Communication status</th><th>Submitted by / time</th><th>Approved by / time</th><th>Actions</th></tr></thead><tbody>{filteredIncidents.map((incident) => <tr key={incident.id}><td><strong>{incident.id}</strong></td><td>{incident.region}</td><td><span>{incident.title}</span></td><td><Badge tone={incident.severity === 'SEV 1' ? 'sev-1' : incident.severity === 'SEV 2' ? 'sev-2' : 'sev-3'}>{incident.severity}</Badge></td><td>{incident.customer}</td><td>{incident.service}</td><td>{incident.status}</td><td>{incident.communication === 'Pending Shift Lead Approval' ? <Badge tone="pending-shift-lead-approval">Pending Shift Lead Approval</Badge> : <Badge tone={incident.communication.toLowerCase().replaceAll(' ', '-')}>{incident.communication}</Badge>}</td><td>{incident.submittedBy ? <><strong>{incident.submittedBy}</strong><span>{incident.submittedTime}</span></> : <span>Not submitted</span>}</td><td>{incident.approvedBy ? <><strong>{incident.approvedBy}</strong><span>{incident.approvedTime}</span></> : <span>Not approved</span>}</td><td><div className="table-actions"><Link className="icon-button" title="View details" to={`/incidents/${incident.id}`}><Eye size={15} /></Link><Link className="icon-button" title={incident.communication === 'Draft Saved' ? 'Continue draft' : 'Draft communication'} to={`/communications/${incident.id}/edit`}><Plus size={15} /></Link><Link className="icon-button" title="View history" to={`/history?incident=${incident.id}`}><History size={15} /></Link></div></td></tr>)}</tbody></table></div></div>
  </section>
}
