import { FastifyReply, FastifyRequest } from 'fastify'
import { errorHandler } from '../lib/utils/error-handler'
import { UnauthorizedError } from '../lib/errors/unauthorized-error'

export function hasPermissions(
  permissions: string[],
  request: FastifyRequest,
  reply: FastifyReply,
  onlyOnePermissionNeeded = false,
) {
  try {
    const userPermissions = request.user.userPermissions
    let count = onlyOnePermissionNeeded ? permissions.length - 1 : 0

    if (!userPermissions.manager) {
      for (const permission of permissions) {
        if (!userPermissions[permission]) {
          if (!count) {
            throw new UnauthorizedError(
              'User does not have the necessary permissions',
            )
          } else {
            count--
          }
        }
      }
    }
  } catch (error) {
    errorHandler(error, reply)
  }
}
