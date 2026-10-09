import { Send } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateIncident, type RootState } from '../store'
import { sendCommunication, downloadEml, type CommunicationPayload } from '../api'
import type { Incident } from '../models/incident'

const CHECKS = ['From Email?', "Customer DL's?", 'Email Subject?', 'Issue Definition?', 'Investigation Details?', 'Next Steps Defined?', 'Grammar?'] as const
const REVIEWERS = ['Avery Morgan', 'Priya Shah', 'Jordan Lee']

// Review SLA windows (hours) by severity: SEV 1 is most urgent.
const SLA_HOURS: Record<string, number> = { 'SEV 1': 4, 'SEV 2': 8, 'SEV 3': 24 }

const formatDuration = (ms: number) => {
  const overdue = ms < 0
  const total = Math.abs(Math.floor(ms / 1000))
  const hours = String(Math.floor(total / 3600)).padStart(2, '0')
  const minutes = String(Math.floor((total % 3600) / 60)).padStart(2, '0')
  const seconds = String(total % 60).padStart(2, '0')
  return `${overdue ? '-' : ''}${hours}:${minutes}:${seconds}`
}

export default function ApprovalQueuePage() {
  const allIncidents = useSelector((state: RootState) => state.incidents)
  const pending = allIncidents.filter((item) => item.communication === 'Pending Shift Lead Approval')
  const dispatch = useDispatch()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<string, 'Yes' | 'No'>>({})
  const [reviewer, setReviewer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const selected = allIncidents.find((item) => item.id === selectedId)
  const [deadlines] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {}
    allIncidents.forEach((item: Incident) => { map[item.id] = Date.now() + (SLA_HOURS[item.severity] ?? 8) * 3600 * 1000 })
    return map
  })
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])
  const remaining = selected ? deadlines[selected.id] - now : 0
  const isOverdue = remaining < 0

  const reset = () => {
    setSelectedId(null)
    setAnswers({})
    setReviewer('')
    setFeedback('')
    setError('')
  }
  const selectIncident = (id: string) => {
    setSelectedId(id)
    setAnswers({})
    setReviewer('')
    setFeedback('')
    setError('')
  }
  const decide = (decision: 'Approved' | 'Changes Requested') => {
    if (!selected) return
    if (!reviewer) { setError('Select a reviewer before continuing.'); return }
    if (decision === 'Changes Requested' && !feedback.trim()) { setError('Feedback is required to send back for rework.'); return }
    const now = 'Just now'
    if (decision === 'Approved') {
      dispatch(updateIncident({ id: selected.id, changes: { communication: 'Approved', approvalStatus: 'Approved', approvedBy: reviewer, approvedTime: now, approvedVersion: { version: (selected.approvedVersion?.version ?? 0) + 1, subject: selected.draftSubject ?? 'Incident update', body: selected.draftBody ?? '', channel: selected.draftChannel ?? 'Email', approvedBy: reviewer, approvedTime: now } } }))
      const destination = [...(selected.recipients ?? []), ...(selected.teamsChannels ?? [])].join(', ') || 'configured recipients'
      const incidentId = selected.id
      const payload: CommunicationPayload = {
        incidentId,
        subject: selected.draftSubject ?? 'Incident update',
        body: selected.draftBody ?? '',
        channel: selected.draftChannel ?? 'Email',
        recipients: selected.recipients ?? [],
        teamsChannels: selected.teamsChannels ?? [],
        approvedBy: reviewer,
      }
      sendCommunication(payload).then((sent) => {
        dispatch(updateIncident({ id: incidentId, changes: { communication: sent ? 'Sent' : 'Failed' } }))
        setToast(sent ? `Email sent to ${destination} via ${selected.draftChannel ?? 'Email'}` : 'Send failed: no backend connected yet.')
        setTimeout(() => setToast(''), 4000)
      })
      downloadEml(payload)
    } else {
      dispatch(updateIncident({ id: selected.id, changes: { communication: 'Changes Requested', approvalStatus: 'Rejected', approvalComment: feedback } }))
    }
    reset()
  }

  return <section className="page-section fade-in">
    <div className="opshub-layout">
      <div className="opshub-incident-column">
        <label className="review-incident-select"><span>Alerts Pending for Review</span><select id="pending-incident-select" name="pendingIncident" value={selectedId ?? ''} onChange={(event) => selectIncident(event.target.value)}><option value="" disabled>Select an incident</option>{pending.map((item) => <option key={item.id} value={item.id}>{item.id} · {item.title} · SLA {formatDuration(deadlines[item.id] - now)}</option>)}</select></label>
        {selected && <div className={`sla-timer ${isOverdue ? 'overdue' : ''}`}><span>SLA Time</span><strong>{formatDuration(remaining)}</strong></div>}
        <div className="rich-editor" dangerouslySetInnerHTML={{ __html: selected?.draftBody ?? '<p>Select an incident to load its draft.</p>' }} />
      </div>
      <div className="opshub-review section-card">
        <p className="review-instructions">Review and validate the email, then select the appropriate options from the list below</p>
        <div className="checklist">{CHECKS.map((label) => <div className="checklist-row" key={label}><span>{label}</span><label><input id={`check-${label}-yes`} type="radio" name={label} checked={answers[label] === 'Yes'} onChange={() => setAnswers((current) => ({ ...current, [label]: 'Yes' }))} /> Yes</label><label><input id={`check-${label}-no`} type="radio" name={label} checked={answers[label] === 'No'} onChange={() => setAnswers((current) => ({ ...current, [label]: 'No' }))} /> No</label></div>)}</div>
        <label className="reviewer-select"><span>Reviewer?</span><select id="reviewer-select" name="reviewer" value={reviewer} onChange={(event) => setReviewer(event.target.value)}><option value="">Search by name</option>{REVIEWERS.map((name) => <option key={name}>{name}</option>)}</select></label>
        <textarea id="approval-feedback" name="feedback" value={feedback} onChange={(event) => setFeedback(event.target.value)} rows={3} placeholder="Enter your feedback here" />
        {error && <div className="validation-errors">{error}</div>}
        <div className="approval-footer"><button className="secondary-button" onClick={reset}>Reset</button><button className="secondary-button" onClick={() => decide('Changes Requested')}>Rework</button><button className="primary-button" onClick={() => decide('Approved')}>Approve</button></div>
      </div>
    </div>
    {toast && <div className="toast"><Send size={15} /> {toast}</div>}
  </section>
}
