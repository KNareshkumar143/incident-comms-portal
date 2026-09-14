import { Activity, CheckCircle2, FileText, Filter, Send, ShieldCheck, TriangleAlert } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Badge } from '../components/StatusBadge'

type HistoryEvent = { icon: typeof FileText; tone: string; type: string; title: string; incident: string; actor: string; time: string; details: string[] }
const historyItems: HistoryEvent[] = [
  { icon: FileText, tone: 'blue', type: 'Draft Created', title: 'Customer communication draft created', incident: 'INC-84287 · Northwind Traders', actor: 'NK17', time: 'Today, 10:21', details: ['Version: Draft V2', 'Channel: Email', 'Created from IcM incident context'] },
  { icon: Send, tone: 'amber', type: 'Submitted For Approval', title: 'Communication submitted for Shift Lead approval', incident: 'INC-84291 · Contoso Ltd.', actor: 'NK17', time: 'Today, 09:42', details: ['Channel: Email + Microsoft Teams', 'Recipients: contoso-ops@contoso.com, #contoso-azure-alerts', 'Status: Pending Shift Lead Approval'] },
  { icon: ShieldCheck, tone: 'green', type: 'Approval Decision', title: 'Communication approved', incident: 'INC-84276 · Fabrikam', actor: 'Avery Morgan · Shift Lead', time: 'Yesterday, 17:04', details: ['Decision: Approved', 'Comment: Approved for customer distribution.', 'Approved version: Draft V3'] },
  { icon: CheckCircle2, tone: 'teal', type: 'Sent Communication', title: 'Approved communication delivered', incident: 'INC-84263 · Alpine Ski House', actor: 'Communication service', time: 'Sep 08, 11:43', details: ['Channel: Email + Microsoft Teams', 'Message ID: MSG-3328172', 'Delivery status: Delivered'] },
  { icon: Activity, tone: 'purple', type: 'Incident Update', title: 'Incident status synchronized from IcM', incident: 'INC-84263 · Authentication requests timing out', actor: 'IcM integration', time: 'Sep 08, 11:40', details: ['Updated fields: status, mitigation state', 'Update result: Synchronized', 'Failure details: None'] },
  { icon: TriangleAlert, tone: 'red', type: 'Incident Update', title: 'Delivery retry recorded', incident: 'INC-84254 · Woodgrove Bank', actor: 'Communication service', time: 'Sep 07, 14:12', details: ['Updated fields: delivery status', 'Update result: Failed', 'Failure details: Teams endpoint timed out; retry scheduled'] },
]

export default function HistoryPage() {
  const [params] = useSearchParams()
  const incidentFilter = params.get('incident') ?? ''
  const [typeFilter, setTypeFilter] = useState('All event types')
  const events = useMemo(() => historyItems.filter((item) => (!incidentFilter || item.incident.startsWith(incidentFilter)) && (typeFilter === 'All event types' || item.type === typeFilter)), [incidentFilter, typeFilter])
  return <section className="page-section fade-in"><div className="page-heading"><div><div className="eyebrow">Audit trail</div><h1>Communication history</h1><p>Every draft, decision, delivery, and incident synchronization event.</p></div><div className="filter-select"><Filter size={16} /><select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}><option>All event types</option><option>Draft Created</option><option>Submitted For Approval</option><option>Approval Decision</option><option>Sent Communication</option><option>Incident Update</option></select></div></div><div className="history-layout"><div className="history-card"><div className="history-card-heading"><strong>{incidentFilter ? `History for ${incidentFilter}` : 'Recent activity'}</strong><span>{events.length} events</span></div>{events.map(({ icon: Icon, tone, type, title, incident, actor, time, details }) => <article className="history-item history-item-expanded" key={`${type}-${incident}`}><div className={`history-icon ${tone}`}><Icon size={17} /></div><div><Badge tone={tone}>{type}</Badge><strong>{title}</strong><span>{incident}</span><small>{actor}</small><ul>{details.map((detail) => <li key={detail}>{detail}</li>)}</ul></div><time>{time}</time></article>)}{events.length === 0 && <div className="empty-state"><p>No history events match this filter.</p></div>}</div></div></section>
}
