import { createSlice, configureStore } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type Status = 'Not Started' | 'Draft Saved' | 'Pending Shift Lead Approval' | 'Approved' | 'Sent' | 'Rejected' | 'Failed'
export type Incident = { id: string; title: string; region: string; severity: 'SEV 1' | 'SEV 2' | 'SEV 3'; customer: string; service: string; status: string; communication: Status; submittedBy?: string; submittedTime?: string; approvedBy?: string; approvedTime?: string }

const initialIncidents: Incident[] = [
  { id: 'INC-84291', title: 'Elevated API latency in compute cluster', region: 'West Europe', severity: 'SEV 1', customer: 'Contoso Ltd.', service: 'Azure Compute', status: 'Investigating', communication: 'Pending Shift Lead Approval', submittedBy: 'Maya Chen', submittedTime: 'Today, 09:42' },
  { id: 'INC-84287', title: 'Intermittent failures on payment webhooks', region: 'East US 2', severity: 'SEV 2', customer: 'Northwind Traders', service: 'Event Grid', status: 'Mitigated', communication: 'Draft Saved' },
  { id: 'INC-84276', title: 'Delayed data ingestion for analytics workloads', region: 'North Europe', severity: 'SEV 2', customer: 'Fabrikam', service: 'Data Factory', status: 'Monitoring', communication: 'Approved', submittedBy: 'Drew Patel', submittedTime: 'Yesterday, 16:28', approvedBy: 'Avery Morgan', approvedTime: 'Yesterday, 17:04' },
  { id: 'INC-84263', title: 'Authentication requests timing out', region: 'Southeast Asia', severity: 'SEV 3', customer: 'Alpine Ski House', service: 'Entra ID', status: 'Resolved', communication: 'Sent', submittedBy: 'Maya Chen', submittedTime: 'Sep 08, 11:08', approvedBy: 'Avery Morgan', approvedTime: 'Sep 08, 11:41' },
  { id: 'INC-84254', title: 'Storage capacity alert on production nodes', region: 'Central US', severity: 'SEV 3', customer: 'Woodgrove Bank', service: 'Azure Storage', status: 'Resolved', communication: 'Not Started' },
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
