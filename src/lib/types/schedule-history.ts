type Reason = 'SH' | 'CR' | 'WS' | 'DM'

export type ScheduleHistory = {
  userId: string
  dateDate: string
  schedule: string
  reason: Reason
  updatedAt: string
}
