// Placeholder backend endpoint. Replace with the real communications API once available.
const SEND_COMMUNICATION_URL = '/api/communications/send'

export type CommunicationPayload = {
  incidentId: string
  subject: string
  body: string
  channel: string
  recipients: string[]
  teamsChannels: string[]
  approvedBy: string
}

export const sendCommunication = async (payload: CommunicationPayload) => {
  try {
    const response = await fetch(SEND_COMMUNICATION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return response.ok
  } catch {
    return false
  }
}

const buildEmlContent = (payload: CommunicationPayload) => {
  const to = [...payload.recipients, ...payload.teamsChannels].join(', ') || 'unspecified-recipient@example.com'
  return [
    `From: ${payload.approvedBy} <shift-lead@signaldesk.local>`,
    `To: ${to}`,
    `Subject: ${payload.subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset="UTF-8"',
    '',
    payload.body,
  ].join('\r\n')
}

export const downloadEml = (payload: CommunicationPayload) => {
  const blob = new Blob([buildEmlContent(payload)], { type: 'message/rfc822' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${payload.incidentId}-communication.eml`
  link.click()
  URL.revokeObjectURL(url)
}
