import { ArrowLeft, History, Plus } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../store'
import { Badge } from '../components/StatusBadge'

export default function IncidentDetailsPage() {
  const { incidentId } = useParams()
  const incident = useSelector((state: RootState) => state.incidents.find((item) => item.id === incidentId))
  if (!incident) return <section className="page-section"><Link className="back-link" to="/incidents"><ArrowLeft size={16} /> Back to dashboard</Link><h1>Incident not found</h1></section>
  return <section className="page-section fade-in"><Link className="back-link" to="/incidents"><ArrowLeft size={16} /> Back to incident dashboard</Link><div className="page-heading"><div><div className="eyebrow">IcM incident details</div><h1>{incident.id}</h1><p>{incident.title}</p></div><Badge tone={incident.communication.toLowerCase().replaceAll(' ', '-')}>{incident.communication}</Badge></div><div className="details-grid section-card"><div><small>Incident ID</small><strong>{incident.id}</strong></div><div><small>Region</small><strong>{incident.region}</strong></div><div><small>Severity</small><Badge tone={incident.severity === 'SEV 1' ? 'sev-1' : 'sev-2'}>{incident.severity}</Badge></div><div><small>Customer</small><strong>{incident.customer}</strong></div><div><small>Service / workload</small><strong>{incident.service}</strong></div><div><small>Incident status</small><strong>{incident.status}</strong></div><div><small>Submitted by / time</small><strong>{incident.submittedBy ?? 'Not submitted'}</strong><span>{incident.submittedTime}</span></div><div><small>Approved by / time</small><strong>{incident.approvedBy ?? 'Not approved'}</strong><span>{incident.approvedTime}</span></div></div><div className="composer-actions"><Link className="secondary-button" to={`/history?incident=${incident.id}`}><History size={16} /> View history</Link><Link className="primary-button" to={`/communications/${incident.id}/edit`}><Plus size={16} /> Draft communication</Link></div></section>
}