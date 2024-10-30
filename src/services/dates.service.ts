import { monthOrder } from '../constants/month-order'
import { SCHEDULES } from '../constants/schedules'
import { prisma } from '../lib/prisma'
import { DateWithSchedules } from '../lib/types/date-with-schedules'
import { TCreateDeleteDate } from '../lib/validations/dates.schema'

class DatesService {
  private dateFormat(date: string) {
    const splitedData = date.split(' ').slice(1) // date: "Thu Jan 04 2024" splitedDate: ["Jan", "04", "2024"]

    const month = monthOrder[splitedData[0]]
    const day = parseInt(splitedData[1])
    const year = parseInt(splitedData[2])

    return new Date(month - 1, day, year) // Date uses a zero-based index for months.
  }

  async findAll() {
    const dates = (await prisma.date.findMany()) as DateWithSchedules[]

    const sortedDates = dates.sort(
      (a, b) =>
        this.dateFormat(a.date).getTime() - this.dateFormat(b.date).getTime(),
    )

    const isDateScheduled = sortedDates.map((date) => {
      const isScheduled = date.schedules.some(
        (schedule) => schedule.isScheduled === true,
      )

      return {
        date: date.date,
        isScheduled,
      }
    })

    return isDateScheduled
  }

  async findAllNotScheduled() {
    const dates = (await prisma.date.findMany()) as DateWithSchedules[]

    const sortedDates = dates.sort(
      (a, b) =>
        this.dateFormat(a.date).getTime() - this.dateFormat(b.date).getTime(),
    )

    const unscheduledDates = sortedDates
      .map((date) => {
        const unscheduledSchedules = date.schedules
          .filter((schedule) => schedule.isScheduled === false)
          .map((schedule) => schedule.schedule)

        return {
          date: date.date,
          schedules: unscheduledSchedules,
        }
      })
      .filter((date) => date.schedules.length !== 0)

    return unscheduledDates
  }

  async create(data: TCreateDeleteDate) {
    const datesWithSchedules = data.dates.map((date) => ({
      date,
      schedules: SCHEDULES.map((schedule) => ({
        schedule,
        isScheduled: false,
      })),
    }))

    const datesPromisses = datesWithSchedules.map((date) =>
      prisma.date.create({ data: date }),
    )

    const allSettledDatesPromisses = await Promise.allSettled(datesPromisses)

    const count = allSettledDatesPromisses.reduce((count, result) => {
      return result.status === 'fulfilled' ? count + 1 : count
    }, 0)

    return { count }
  }

  async delete(data: TCreateDeleteDate) {
    const datesPromisses = data.dates.map((date) =>
      prisma.date.delete({ where: { date } }),
    )

    const allSettledDatesPromisses = await Promise.allSettled(datesPromisses)

    const count = allSettledDatesPromisses.reduce((count, result) => {
      return result.status === 'fulfilled' ? count + 1 : count
    }, 0)

    return { count }
  }
}

export const datesService = new DatesService()
