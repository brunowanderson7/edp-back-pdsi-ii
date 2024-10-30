import { ConfictError } from '../lib/errors/conflict-error'
import { ForbiddenError } from '../lib/errors/forbidden-error'
import { NotFoundError } from '../lib/errors/not-found-error'
import { prisma } from '../lib/prisma'
import { DateWithSchedules, Schedule } from '../lib/types/date-with-schedules'
import { ScheduleHistory } from '../lib/types/schedule-history'
import { getIndex } from '../lib/utils/get-index'
import {
  TCreateReschedule,
  TCreateSchedule,
} from '../lib/validations/schedules.schema'
import { MeterStatus, Schedule as ScheduleModel } from '@prisma/client'
import { dateFormat } from '../lib/utils/data-format'
import { hourFormat } from '../lib/utils/hour-format'

class SchedulesService {
  private getScheduleHistoryObject({
    userId,
    reason,
    dateDate,
    schedule,
    updatedAt,
  }: ScheduleModel): ScheduleHistory {
    return {
      userId,
      reason,
      dateDate,
      schedule,
      updatedAt: updatedAt as unknown as string,
    }
  }

  private getRemainingReschedules(schedule: ScheduleModel) {
    const rescheduleReason = {
      SH: 1,
      CR: 1,
      // Two reschedulings to distribute between the two
      WS: 2,
      DM: 2,
    }

    if (schedule.reason === 'WS' || schedule.reason === 'DM') {
      rescheduleReason.WS -= 1
      rescheduleReason.DM -= 1
    } else {
      rescheduleReason[schedule.reason] -= 1
    }

    for (const history of schedule.history as ScheduleHistory[]) {
      if (history.reason === 'WS' || history.reason === 'DM') {
        rescheduleReason.WS -= 1
        rescheduleReason.DM -= 1
      } else {
        rescheduleReason[history.reason] -= 1
      }
    }

    const numberOfRemainingReschedules = 3 - schedule.history.length

    return {
      rescheduleReason,
      numberOfRemainingReschedules,
    }
  }

  async findAll() {
    const schedules = await prisma.schedule.findMany()

    const schedulesWithMeterNumberAndRemaingReschedules = Promise.all(
      schedules.map(async (schedule) => {
        const meter = await prisma.meter.findUnique({
          where: { id: schedule.meterId },
        })

        const remainingReschedules = this.getRemainingReschedules(schedule)

        return {
          // TO DO how to handle this proprety?
          customerName: meter?.customerName,
          meterNumber: meter?.number,
          scheduledObservations: meter?.scheduledObservations,
          ...schedule,
          ...remainingReschedules,
        }
      }),
    )

    return schedulesWithMeterNumberAndRemaingReschedules
  }

  async getMetersToTest(quantity: number) {
    const transaction = await prisma.$transaction(async (prisma) => {
      const schedulesToTest = await prisma.schedule.findMany({
        where: { status: 'RECEIVED' },
      })

      const orderedSchedulesToTest = schedulesToTest.sort((a, b) => {
        if (
          dateFormat(a.dateDate).getTime() === dateFormat(b.dateDate).getTime()
        ) {
          return (
            hourFormat(a.schedule).getTime() - hourFormat(b.schedule).getTime()
          )
        }

        return (
          dateFormat(a.dateDate).getTime() - dateFormat(b.dateDate).getTime()
        )
      })

      const schedulesToTestQuantity = orderedSchedulesToTest.slice(0, quantity)

      return await Promise.all(
        schedulesToTestQuantity.map((schedule) =>
          prisma.schedule.update({
            where: { id: schedule.id },
            data: { status: 'TESTING' },
          }),
        ),
      )
    })

    return Promise.all(
      transaction.map(async (schedule) => ({
        ...(await prisma.meter.findUnique({ where: { id: schedule.meterId } })),
        scheduleId: schedule.id,
      })),
    )
  }

  async findOne(id: number) {
    const schedule = await prisma.schedule.findUnique({ where: { id } })

    if (!schedule) {
      throw new NotFoundError(`Schedule with ID ${id} not found`)
    }

    const meter = await prisma.meter.findUnique({
      where: { id: schedule?.meterId },
    })

    const remainingReschedules = this.getRemainingReschedules(schedule)

    const scheduleWithMeterNumberAndRemaingReschedules = {
      // TO DO how to handle this proprety?
      customerName: meter?.customerName,
      meterNumber: meter?.number,
      scheduledObservations: meter?.scheduledObservations,
      ...schedule,
      ...remainingReschedules,
    }

    return scheduleWithMeterNumberAndRemaingReschedules
  }

  async updateStatus(meterId: string, status: MeterStatus) {
    const schedule = await prisma.schedule.findUnique({
      where: { meterId },
    })

    if (!schedule) {
      throw new NotFoundError(`Meter with ID ${meterId} not found`)
    }

    return prisma.schedule.update({
      where: { meterId },
      data: { status },
    })
  }

  async create(userId: string, data: TCreateSchedule) {
    const meter = await prisma.meter.findUnique({ where: { id: data.meterId } })

    if (!meter) {
      throw new NotFoundError(`Meter with ID ${data.meterId} not found`)
    }

    const isMeterSchedule = await prisma.schedule.findUnique({
      where: { meterId: data.meterId },
    })

    if (isMeterSchedule) {
      throw new ConfictError(`Meter with ID ${data.meterId} is already in use`)
    }

    const date = (await prisma.date.findUnique({
      where: { date: data.dateDate },
    })) as DateWithSchedules

    if (!date) {
      throw new NotFoundError(`Date with date ${data.dateDate} not found`)
    }

    const schedule = date.schedules.find(
      (schedule) => schedule.schedule === data.schedule,
    )

    if (!schedule) {
      throw new NotFoundError(
        `Schedule with schedule ${data.schedule} not found`,
      )
    }

    if (schedule.isScheduled) {
      throw new ConfictError(`Schedule ${schedule.schedule} is already in use`)
    }

    const scheduleIndex = getIndex<Schedule>(schedule, date.schedules)

    date.schedules[scheduleIndex].isScheduled = true

    await prisma.date.update({
      where: {
        date: date.date,
      },
      data: {
        schedules: date.schedules,
      },
    })

    return await prisma.schedule.create({
      data: { userId, reason: 'SH', ...data },
    })
  }

  async reschedule(userId: string, data: TCreateReschedule) {
    const scheduleModel = await prisma.schedule.findUnique({
      where: { id: data.id },
    })

    if (!scheduleModel) {
      throw new NotFoundError(`Schedule with ID ${data.id} not found`)
    }

    const remainingReschedules = this.getRemainingReschedules(scheduleModel)

    if (
      remainingReschedules.numberOfRemainingReschedules === 0 ||
      remainingReschedules.rescheduleReason[data.reason] === 0
    ) {
      throw new ForbiddenError('It is no longer possible to reschedule')
    }

    const date = (await prisma.date.findUnique({
      where: { date: data.dateDate },
    })) as DateWithSchedules

    if (!date) {
      throw new NotFoundError(`Date with date ${data.dateDate} not found`)
    }

    const schedule = date.schedules.find(
      (schedule) => schedule.schedule === data.schedule,
    )

    if (!schedule) {
      throw new NotFoundError(
        `Schedule with schedule ${data.schedule} not found`,
      )
    }

    if (schedule.isScheduled) {
      throw new ConfictError(`Schedule ${schedule.schedule} is already in use`)
    }

    const scheduleIndex = getIndex<Schedule>(schedule, date.schedules)

    date.schedules[scheduleIndex].isScheduled = true

    const oldDate = (await prisma.date.findUnique({
      where: { date: scheduleModel.dateDate },
    })) as DateWithSchedules

    const oldSchedule = oldDate.schedules.find(
      (schedule) => schedule.schedule === scheduleModel.schedule,
    )
    // @ts-expect-error oldSchedule is possibly undefined
    const oldScheduleIndex = getIndex<Schedule>(oldSchedule, oldDate.schedules)

    oldDate.schedules[oldScheduleIndex].isScheduled = false

    await prisma.date.update({
      where: {
        date: date.date,
      },
      data: {
        schedules: date.schedules,
      },
    })

    await prisma.date.update({
      where: {
        date: oldDate.date,
      },
      data: {
        schedules: oldDate.schedules,
      },
    })

    const history = scheduleModel.history
    history.push(this.getScheduleHistoryObject(scheduleModel))

    return await prisma.schedule.update({
      where: { id: data.id },
      // @ts-expect-error Type 'JsonValue[]' is not assignable to type 'InputJsonValue[] | ScheduleUpdatehistoryInput | undefined'.
      data: { userId, history, ...data },
    })
  }
}

export const schedulesService = new SchedulesService()
