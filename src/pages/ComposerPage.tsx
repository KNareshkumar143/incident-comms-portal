import { ArrowLeft, Bold, Check, Eye, History, Italic, Link as LinkIcon, List, Send, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { updateIncident, type RootState } from '../store'
import { Badge } from '../components/StatusBadge'

type Channel = 'Email' | 'Microsoft Teams' | 'Both' | ''

export default function ComposerPage() {
  const { incidentId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const incidents = useSelector((state: RootState) => state.incidents)
  const incident = incidents.find((item) => item.id === incidentId)
  const [channel, setChannel] = useState<Channel>(incident?.draftChannel ?? '')
  const [subject, setSubject] = useState(incident?.draftSubject ?? '')
  const [body, setBody] = useState(incident?.draftBody ?? '')
  const [preview, setPreview] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const recipients = incident?.recipients ?? []
  const teamsChannels = incident?.teamsChannels ?? []
  const isApproved = Boolean(incident?.approvedVersion) || incident?.communication === 'Approved' || incident?.communication === 'Sent'
  const hasRecipients = channel === 'Email' ? recipients.length > 0 : channel === 'Microsoft Teams' ? teamsChannels.length > 0 : recipients.length > 0 && teamsChannels.length > 0
  const validation: string[] = []
  if (!incident) validation.push('Select an incident with required IcM context.')
  if (!subject.trim()) validation.push('Subject is required.')
  if (!body.trim()) validation.push('Message body is required.')
  if (!channel) validation.push('Select Email, Microsoft Teams, or Both.')
  if (channel && !hasRecipients) validation.push('No resolved recipients or Teams channels are configured for the selected channel.')
  const save = () => {
    if (!incident || isApproved) return
    dispatch(updateIncident({ id: incident.id, changes: { communication: 'Draft Saved', draftSubject: subject, draftBody: body, draftChannel: channel || undefined } }))
  }
  const submit = () => {
    setErrors(validation)
    if (validation.length || !incident || !channel || isApproved) return
    dispatch(updateIncident({ id: incident.id, changes: { communication: 'Pending Shift Lead Approval', approvalStatus: 'Pending', draftSubject: subject, draftBody: body, draftChannel: channel, submittedBy: 'NK17', submittedTime: 'Just now' } }))
    navigate('/approvals')
  }
  const format = (command: string) => { document.execCommand(command); setBody(document.querySelector('.rich-editor')?.innerHTML ?? body) }
  return <section className="page-section fade-in"><Link className="back-link" to="/incidents"><ArrowLeft size={16} /> Back to incident dashboard</Link><div className="page-heading compact"><div><div className="eyebrow">Communication composer</div><h1>{incident ? `Draft for ${incident.id}` : 'New communication'}</h1><p>Review incident context, recipients, and the final customer-facing message.</p></div><Badge tone={incident?.communication === 'Pending Shift Lead Approval' ? 'pending-shift-lead-approval' : 'draft-saved'}>{incident?.communication ?? 'Draft'}</Badge></div>{isApproved && <div className="approved-lock"><Check size={16} /> Approved version is locked. The sent message must match this snapshot.</div>}{!incident && <div className="section-card incident-picker"><strong>Select an incident</strong><p>Choose a communication-qualified incident from the dashboard to include required context.</p>{incidents.map((item) => <Link key={item.id} className="text-button" to={`/communications/${item.id}/edit`}>{item.id} · {item.title}</Link>)}</div>}<div className="composer-layout"><div className="composer-main"><div className="section-card"><div className="card-heading"><div><span className="step-number">01</span><div><h2>Incident summary</h2><p>Required context from IcM.</p></div></div></div>{incident ? <div className="summary-grid"><div><small>Incident ID</small><strong>{incident.id}</strong></div><div><small>Incident title</small><strong>{incident.title}</strong></div><div><small>Severity</small><Badge tone={incident.severity === 'SEV 1' ? 'sev-1' : 'sev-2'}>{incident.severity}</Badge></div><div><small>Customer</small><strong>{incident.customer}</strong></div><div><small>Service / workload</small><strong>{incident.service}</strong></div><div><small>Impacted region</small><strong>{incident.region}</strong></div><div><small>Current status</small><strong>{incident.status}</strong></div><div><small>Incident link</small><a href={`/incidents/${incident.id}`}>View IcM incident</a></div></div> : <p>Incident context is required before submission.</p>}</div><div className="section-card"><div className="card-heading"><div><span className="step-number">02</span><div><h2>Channel and recipient review</h2><p>Choose a delivery channel and verify resolved destinations.</p></div></div><span className="required">Required</span></div><div className="channel-options">{(['Email', 'Microsoft Teams', 'Both'] as const).map((option) => <button disabled={isApproved} className={channel === option ? 'selected' : ''} key={option} onClick={() => setChannel(option)}>{option}</button>)}</div><div className="recipient-review"><div><small>Email recipients / DLs</small>{recipients.length ? recipients.map((recipient) => <span className="recipient" key={recipient}>{recipient}</span>) : <span className="muted">No resolved email recipients</span>}</div><div><small>Configured Teams channels</small>{teamsChannels.length ? teamsChannels.map((team) => <span className="recipient" key={team}>{team}</span>) : <span className="muted">No configured Teams channels</span>}</div></div></div><div className="section-card"><div className="card-heading"><div><span className="step-number">03</span><div><h2>Communication editor</h2><p>Use formatting, links, lists, or a template to draft the update.</p></div></div></div><input id="composer-subject" name="subject" disabled={isApproved} className="editor-input" value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Subject" /><div className="editor-toolbar">{!isApproved && <><button title="Bold" onClick={() => format('bold')}><Bold size={15} /></button><button title="Italic" onClick={() => format('italic')}><Italic size={15} /></button><button title="Bulleted list" onClick={() => format('insertUnorderedList')}><List size={15} /></button><button title="Insert link" onClick={() => format('createLink')}><LinkIcon size={15} /></button><button onClick={() => { setSubject('Incident update: impact and next steps'); setBody('Issue summary\n\nCurrent impact\n\nMitigation\n\nNext update ETA') }}>Use template</button></>}</div><div className="rich-editor" contentEditable={!isApproved} suppressContentEditableWarning onInput={(event) => setBody(event.currentTarget.innerHTML)} dangerouslySetInnerHTML={{ __html: body }} /></div>{errors.length > 0 && <div className="validation-errors" role="alert">{errors.map((error) => <div key={error}><X size={14} />{error}</div>)}</div>}<div className="composer-actions"><button disabled={isApproved} className="secondary-button" onClick={save}>Save draft</button><button className="secondary-button" onClick={() => setPreview((value) => !value)}><Eye size={16} /> {preview ? 'Edit message' : 'Preview'}</button><Link className="secondary-button" to={incident ? `/history?incident=${incident.id}` : '/history'}><History size={16} /> View history</Link><Link className="secondary-button" to="/incidents">Cancel</Link>{!isApproved && <button className="primary-button" onClick={submit}><Send size={16} /> Submit for approval</button>}</div>{preview && <div className="preview-panel"><small>FINAL CUSTOMER PREVIEW · {channel || 'No channel selected'}</small><h2>{subject || 'No subject'}</h2><div dangerouslySetInnerHTML={{ __html: body || '<p>No message body</p>' }} /></div>}</div></div></section>
}
