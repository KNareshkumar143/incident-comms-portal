import { Check, Clock3, History, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { updateIncident, type RootState } from '../store'
import { Badge } from '../components/StatusBadge'

export default function ApprovalQueuePage() {
  const allIncidents = useSelector((state: RootState) => state.incidents)
  const incidents = allIncidents.filter((item) => item.communication === 'Pending Shift Lead Approval')
  const dispatch = useDispatch()
  const [comments, setComments] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const decide = (id: string, decision: 'Approved' | 'Rejected' | 'Changes Requested') => {
    const incident = incidents.find((item) => item.id === id)
    const comment = comments[id]?.trim() ?? ''
    if (!incident) return
    if (decision !== 'Approved' && !comment) { setErrors((current) => ({ ...current, [id]: 'A comment is required for rejection or requested changes.' })); return }
    const now = 'Just now'
    if (decision === 'Approved') {
      dispatch(updateIncident({ id, changes: { communication: 'Approved', approvalStatus: 'Approved', approvedBy: 'Avery Morgan', approvedTime: now, approvedVersion: { version: (incident.approvedVersion?.version ?? 0) + 1, subject: incident.draftSubject ?? 'Incident update', body: incident.draftBody ?? '', channel: incident.draftChannel ?? 'Email', approvedBy: 'Avery Morgan', approvedTime: now } } }))
    } else {
      dispatch(updateIncident({ id, changes: { communication: decision, approvalStatus: 'Rejected', approvalComment: comment } }))
    }
  }
  return <section className="page-section fade-in"><div className="page-heading"><div><div className="eyebrow">Shift Lead workspace</div><h1>Approval queue</h1><p>Review customer-facing updates before they leave the workspace.</p></div><Badge tone="pending-shift-lead-approval"><Clock3 size={14} /> {incidents.length} pending</Badge></div><div className="approval-list">{incidents.length === 0 && <div className="empty-state"><Check size={24} /><h2>Queue is clear</h2><p>There are no communications waiting for Shift Lead review.</p></div>}{incidents.map((incident) => <div className="approval-card" key={incident.id}><div className="approval-header"><div><Badge tone={incident.severity === 'SEV 1' ? 'sev-1' : 'sev-2'}>{incident.severity}</Badge><Link className="incident-link" to={`/incidents/${incident.id}`}>{incident.id}</Link><h2>{incident.title}</h2><p>{incident.customer} · {incident.service} · {incident.region}</p></div><Badge tone="pending-shift-lead-approval">Pending Shift Lead Approval</Badge></div><div className="approval-preview"><small>PROPOSED CUSTOMER UPDATE · {incident.submittedBy} · {incident.submittedTime}</small><h3>{incident.draftSubject ?? 'Incident communication'}</h3><p>{incident.draftBody ?? `We are investigating an issue affecting ${incident.service} in ${incident.region}. Some customers may experience service disruption.`}</p><div className="approval-meta"><span>Channel: {incident.draftChannel ?? 'Email'}</span><span>Recipients: {(incident.recipients ?? []).join(', ') || (incident.teamsChannels ?? []).join(', ')}</span></div></div><textarea value={comments[incident.id] ?? ''} onChange={(event) => setComments((current) => ({ ...current, [incident.id]: event.target.value }))} rows={3} placeholder="Approval comment, rejection reason, or requested changes" />{errors[incident.id] && <div className="validation-errors"><X size={14} />{errors[incident.id]}</div>}<div className="approval-footer"><button className="secondary-button" onClick={() => decide(incident.id, 'Changes Requested')}>Request changes</button><button className="danger-button" onClick={() => decide(incident.id, 'Rejected')}><X size={15} /> Reject</button><button className="primary-button" onClick={() => decide(incident.id, 'Approved')}><Check size={16} /> Approve communication</button><Link className="text-button" to={`/history?incident=${incident.id}`}><History size={14} /> View history</Link></div></div>)}</div></section>
}
