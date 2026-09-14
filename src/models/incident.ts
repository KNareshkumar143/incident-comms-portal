export type IncidentSeverity = 'SEV 1' | 'SEV 2' | 'SEV 3'

export type CommunicationStatus = 'Not Started' | 'Draft Saved' | 'Pending Shift Lead Approval' | 'Approved' | 'Sent' | 'Rejected' | 'Changes Requested' | 'Failed'

export type Incident = {
  id: string
  title: string
  region: string
  severity: IncidentSeverity
  customer: string
  service: string
  status: string
  communication: CommunicationStatus
  submittedBy?: string
  submittedTime?: string
  approvedBy?: string
  approvedTime?: string
  incidentDate?: string
  approvalStatus?: 'Pending' | 'Approved' | 'Rejected'
  draftSubject?: string
  draftBody?: string
  draftChannel?: 'Email' | 'Microsoft Teams' | 'Both'
  recipients?: string[]
  teamsChannels?: string[]
  approvedVersion?: { version: number; subject: string; body: string; channel: string; approvedBy: string; approvedTime: string }
  approvalComment?: string
}