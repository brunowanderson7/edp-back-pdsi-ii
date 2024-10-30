import { Date } from '@prisma/client'

export type Schedule = {
  schedule: string
  isScheduled: boolean
}

export type DateWithSchedules = {
  [K in keyof Date]: K extends 'schedules' ? Schedule[] : Date[K]
}
