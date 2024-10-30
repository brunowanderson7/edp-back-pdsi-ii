import { ForbiddenError } from '../lib/errors/forbidden-error'
import { NotFoundError } from '../lib/errors/not-found-error'
import { prisma } from '../lib/prisma'

class UsersService {
  async findAll() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        isBanned: true,
        isEmailApproved: true,
        isUserApproved: true,
        permissions: true,
      },
      where: {
        isOwer: false,
      },
    })
  }

  async banUser(id: string) {
    const user = await prisma.user.findUnique({ where: { id } })

    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found`)
    }

    if (user.isOwer) {
      throw new ForbiddenError(`The ower can't be banned`)
    }

    return prisma.user.update({
      where: { id },
      data: {
        isBanned: true,
      },
    })
  }

  async unbanUser(id: string) {
    const user = await prisma.user.findUnique({ where: { id } })

    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found`)
    }

    return prisma.user.update({
      where: { id },
      data: {
        isBanned: false,
      },
    })
  }
}

export const usersService = new UsersService()
