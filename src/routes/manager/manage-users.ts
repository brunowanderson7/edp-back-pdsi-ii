import { FastifyInstance } from 'fastify'
import { prisma } from '../../lib/prisma'
import { HTTP_MESSAGE, HTTP_STATUS } from '../../constants/http-constants'
import {
  approveUserSchema,
  updatePermissionsSchema,
} from '../../lib/validations/manage-users.schema'

export async function manageUsersRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request, reply) => {
    console.log('\n========================================')
    console.log('manageUsersRoutes preHandler')
    console.log('Trying to verify JWT')
    await request.jwtVerify()

    if (!request.user.userPermissions.manager) {
      console.log('HTTP Message: ', HTTP_MESSAGE.UNAUTHORIZED)
      return reply.code(HTTP_STATUS.UNAUTHORIZED).send({
        message: HTTP_MESSAGE.UNAUTHORIZED,
      })
    }

    console.log('JWT verified')
  })

  app.put('/update-permissions', async (request, reply) => {
    console.log('Trying to update permissions')

    const { id, permissions } = updatePermissionsSchema.parse(request.body)

    try {
      const user = await prisma.user.findUnique({
        where: {
          id,
          isEmailApproved: true,
          isUserApproved: true,
        },

        include: {
          permissions: true,
        },
      })

      if (!user) {
        console.log('HTTP Message: ', HTTP_MESSAGE.NOT_FOUND)
        return reply.code(HTTP_STATUS.NOT_FOUND).send({
          message: HTTP_MESSAGE.NOT_FOUND,
        })
      }

      await prisma.permissions.update({
        where: {
          id: user.permissions?.id,
        },
        data: {
          ...permissions,
        },
      })

      console.log('HTTP Message: ', HTTP_MESSAGE.OK)
      return reply.code(HTTP_STATUS.OK).send({
        message: HTTP_MESSAGE.OK,
      })
    } catch (err) {
      console.log('Error while updating permissions')
      console.log('Error: ', err)

      return reply.code(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
        message: HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      })
    }
  })

  app.get('/unapproved-users', async (request, reply) => {
    console.log('Trying to get unapproved users')

    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
        },
        where: {
          isUserApproved: false,
          isEmailApproved: true,
        },
      })

      const data: unknown[] = []

      for (const user of users) {
        data.push({
          id: user.id,
          name: user.name,
          email: user.email,
        })
      }

      console.log('HTTP Message: ', HTTP_MESSAGE.OK)
      return reply.code(HTTP_STATUS.OK).send({
        data,
        message: HTTP_MESSAGE.OK,
      })
    } catch (err) {
      console.log('HTTP Message: ', HTTP_MESSAGE.INTERNAL_SERVER_ERROR)
      console.log('Error: ', err)

      return reply.code(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
        message: HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      })
    }
  })

  app.post('/approve-user', async (request, reply) => {
    console.log('approve-user route')

    const { id, isUserApproved } = approveUserSchema.parse(request.body)

    try {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          permissions: true,
          isUserApproved: false,
          isEmailApproved: true,
        },
      })

      if (!user) {
        console.log('HTTP Message: ', HTTP_MESSAGE.NOT_FOUND)
        return reply.code(HTTP_STATUS.NOT_FOUND).send({
          message: HTTP_MESSAGE.NOT_FOUND,
        })
      }

      await (isUserApproved
        ? approveUser(id)
        : rejectUser(id, user.permissions?.id))

      console.log('HTTP Message: ', HTTP_MESSAGE.OK)
      return reply.code(HTTP_STATUS.OK).send({
        message: HTTP_MESSAGE.OK,
      })
    } catch (err) {
      console.log('Error: ', err)

      return reply.code(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
        message: HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      })
    }
  })
}

async function approveUser(id: string) {
  console.log('Trying to approve user')

  try {
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        isUserApproved: true,
      },
    })

    console.log('User approved')
  } catch (err) {
    console.log('Error while approving user')
    throw err
  }
}

async function rejectUser(id: string, permissionsId: string | null = null) {
  console.log('Trying to reject user')

  try {
    if (permissionsId) {
      await prisma.permissions.delete({
        where: {
          id: permissionsId,
        },
      })
    }

    await prisma.user.delete({
      where: {
        id,
      },
    })

    console.log('User rejected')
  } catch (err) {
    console.log('Error while rejecting user')
    throw err
  }
}
