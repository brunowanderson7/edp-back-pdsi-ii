import { MeterStatus } from '@prisma/client'
import { ConfictError } from '../lib/errors/conflict-error'
import { NotFoundError } from '../lib/errors/not-found-error'
import { prisma } from '../lib/prisma'
import { TCreateMeter, TUpdateMeter } from '../lib/validations/meters.schema'

class MetersService {
  async findAll() {
    const meters = await prisma.meter.findMany()

    return Promise.all(
      meters.map(async (meter) => {
        const schedule = await prisma.schedule.findUnique({
          where: { meterId: meter.id },
        })

        return {
          ...meter,
          status: schedule?.status,
        }
      }),
    )
  }

  async findAllWithFields(fieldsToPopulate: string[]) {
    const meters = await prisma.meter.findMany()

    const metersWithStatus = await Promise.all(
      meters.map(async (meter) => {
        const schedule = await prisma.schedule.findUnique({
          where: { meterId: meter.id },
        })

        return {
          ...meter,
          status: schedule?.status,
        }
      }),
    )

    return metersWithStatus.map((meter) => {
      const partialMeter = {}
      fieldsToPopulate.forEach((field) => {
        if (meter[field]) {
          partialMeter[field] = meter[field]
        }
      })
      return partialMeter
    })
  }

  async findAllByMeterStatus(status: MeterStatus) {
    const schedulesByStatus = await prisma.schedule.findMany({
      where: {
        status,
      },
    })

    return Promise.all(
      schedulesByStatus.map(async (schedule) =>
        prisma.meter.findUnique({
          where: { id: schedule.meterId },
        }),
      ),
    )
  }

  async findOne(id: string) {
    const meter = await prisma.meter.findUnique({
      where: {
        id,
      },
    })

    if (!meter) {
      throw new NotFoundError(`Model with ID ${id} not found`)
    }

    const schedule = await prisma.schedule.findUnique({
      where: { meterId: meter.id },
    })

    return { meter, status: schedule?.status }
  }

  async create(data: TCreateMeter) {
    const meter = await prisma.meter.findUnique({
      where: { number: data.number },
    })

    if (meter) {
      throw new ConfictError(`Number ${data.number} is already in use`)
    }

    return prisma.meter.create({ data })
  }

  async update(id: string, data: TUpdateMeter) {
    const meter = await prisma.meter.findUnique({
      where: {
        id,
      },
    })

    if (!meter) {
      throw new NotFoundError(`Model with ID ${id} not found`)
    }

    if (data.number) {
      const isNameInUse = await prisma.meter.findUnique({
        where: {
          number: data.number,
        },
      })

      if (isNameInUse && isNameInUse.id !== id) {
        throw new ConfictError(`Number ${data.number} is already in use`)
      }
    }

    return prisma.meter.update({
      where: {
        id,
      },
      data,
    })
  }

  async delete(id: string) {
    const meter = await prisma.meter.findUnique({
      where: {
        id,
      },
    })

    if (!meter) {
      throw new NotFoundError(`Model with ID ${id} not found`)
    }

    return prisma.meter.delete({ where: { id } })
  }
}

export const metersService = new MetersService()
