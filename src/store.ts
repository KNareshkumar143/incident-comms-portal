import { createSlice, configureStore } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type Status = import('./models/incident').CommunicationStatus
export type Incident = import('./models/incident').Incident

const initialIncidents: Incident[] = [
  { id: 'INC-84291', title: 'Elevated API latency in compute cluster', region: 'West Europe', severity: 'SEV 1', customer: 'Contoso Ltd.', service: 'Azure Compute', status: 'Investigating', communication: 'Pending Shift Lead Approval', approvalStatus: 'Pending', incidentDate: '2026-09-11', submittedBy: 'NK17', submittedTime: 'Today, 09:42', recipients: ['contoso-ops@contoso.com', 'contoso-cloud-dl@contoso.com'], teamsChannels: ['#contoso-azure-alerts'], draftSubject: 'Update: Azure Compute API latency', draftBody: 'We are investigating elevated API latency affecting Azure Compute workloads.', draftChannel: 'Both' },
  { id: 'INC-84287', title: 'Intermittent failures on payment webhooks', region: 'East US 2', severity: 'SEV 2', customer: 'Northwind Traders', service: 'Event Grid', status: 'Mitigated', communication: 'Draft Saved', incidentDate: '2026-09-10', recipients: ['payments@northwindtraders.com'], teamsChannels: ['#northwind-integrations'] },
  { id: 'INC-84276', title: 'Delayed data ingestion for analytics workloads', region: 'North Europe', severity: 'SEV 2', customer: 'Fabrikam', service: 'Data Factory', status: 'Monitoring', communication: 'Approved', approvalStatus: 'Approved', incidentDate: '2026-09-09', submittedBy: 'Drew Patel', submittedTime: 'Yesterday, 16:28', approvedBy: 'Avery Morgan', approvedTime: 'Yesterday, 17:04', approvedVersion: { version: 3, subject: 'Data ingestion update', body: 'Data ingestion is being monitored and the next update will follow shortly.', channel: 'Email', approvedBy: 'Avery Morgan', approvedTime: 'Yesterday, 17:04' } },
  { id: 'INC-84263', title: 'Authentication requests timing out', region: 'Southeast Asia', severity: 'SEV 3', customer: 'Alpine Ski House', service: 'Entra ID', status: 'Resolved', communication: 'Sent', approvalStatus: 'Approved', incidentDate: '2026-09-08', submittedBy: 'NK17', submittedTime: 'Sep 08, 11:08', approvedBy: 'Avery Morgan', approvedTime: 'Sep 08, 11:41' },
  { id: 'INC-84254', title: 'Storage capacity alert on production nodes', region: 'Central US', severity: 'SEV 3', customer: 'Woodgrove Bank', service: 'Azure Storage', status: 'Resolved', communication: 'Not Started', incidentDate: '2026-09-07', recipients: ['woodgrove-ops@woodgrove.com'], teamsChannels: ['#woodgrove-storage'] },
]

const incidentsSlice = createSlice({
  name: 'incidents',
  initialState: initialIncidents,
  reducers: {
    updateIncident: (state, action: PayloadAction<{ id: string; changes: Partial<Incident> }>) => {
      const incident = state.find((item) => item.id === action.payload.id)
      if (incident) Object.assign(incident, action.payload.changes)
    },
  },
})

export const { updateIncident } = incidentsSlice.actions
export const store = configureStore({ reducer: { incidents: incidentsSlice.reducer } })
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
