import { TCreateSignatute } from '../lib/validations/signatures.schema'
import { prisma } from '../lib/prisma'
import { NotFoundError } from '../lib/errors/not-found-error'

class SignaturesService {
  async createSignatute(data: TCreateSignatute) {
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
    })

    if (!user) {
      throw new NotFoundError(`User with id ${data.userId} not found`)
    }

    const ratm = await prisma.rATM.findUnique({
      where: { id: data.ratmId },
    })

    if (!ratm) {
      throw new NotFoundError(`RATM with id ${data.ratmId} not found`)
    }

    const token = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

    return prisma.signature.create({
      data: {
        ...data,
        rATMId: data.ratmId,
        token,
      },
    })
  }

  async verifySignature(token: string) {
    const signature = await prisma.signature.findUnique({
      where: { token },
    })

    if (!signature) {
      throw new NotFoundError(`Signature with token ${token} not found`)
    }

    const transaction = await prisma.$transaction([
      prisma.rATM.findUnique({
        where: { id: signature.rATMId },
      }),

      prisma.user.findUnique({
        where: { id: signature.userId },
        select: {
          id: true,
          email: true,
          name: true,
        },
      }),
    ])

    return {
      signature,
      ratm: transaction[0],
      user: transaction[1],
    }
  }
}

export const signaturesService = new SignaturesService()
