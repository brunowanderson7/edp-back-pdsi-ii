import { NotFoundError } from '../lib/errors/not-found-error'
import { prisma } from '../lib/prisma'
import { TCreateRATM, TUpdateRATM } from '../lib/validations/ratm.schema'

class RATMService {
  async findAll() {
    return prisma.rATM.findMany()
  }

  async findAllByMeterId(meterId: string) {
    return prisma.rATM.findMany({
      where: {
        meterId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })
  }

  async findOne(id: string) {
    const ratm = await prisma.rATM.findUnique({
      where: { id },
    })

    if (!ratm) {
      throw new NotFoundError(`RATM with ID ${id} not found`)
    }

    return ratm
  }

  async create(data: TCreateRATM[]) {
    await prisma.rATM.createMany({
      data,
    })

    return Promise.all(
      data.map(async (ratm) =>
        prisma.schedule.update({
          where: { meterId: ratm.meterId },
          data: {
            status: 'REHEARSED',
          },
        }),
      ),
    )
  }

  async update(id: string, data: TUpdateRATM) {
    const ratm = await prisma.rATM.findUnique({
      where: { id },
    })

    if (!ratm) {
      throw new NotFoundError(`RATM with ID ${id} not found`)
    }

    const transaction = await prisma.$transaction([
      prisma.rATM.update({
        where: { id },
        data,
      }),

      prisma.signature.deleteMany({
        where: {
          rATMId: id,
        },
      }),
    ])

    return transaction[0]
  }

  async delete(id: string) {
    const ratm = await prisma.rATM.findUnique({
      where: { id },
    })

    if (!ratm) {
      throw new NotFoundError(`RATM with ID ${id} not found`)
    }

    return prisma.rATM.delete({
      where: { id },
    })
  }
}

export const ratmService = new RATMService()
