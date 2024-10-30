import { FastifyRequest, FastifyReply } from 'fastify'
import { HTTP_STATUS, HTTP_MESSAGE } from '../constants/http-constants'
import { errorHandler } from '../lib/utils/error-handler'
import { usersService } from '../services/users.service'
import { FindOneStringSchema } from '../lib/validations/find-one.schema'

class UsersController {
  async findAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = await usersService.findAll()

      return reply.code(HTTP_STATUS.OK).send({
        message: HTTP_MESSAGE.OK,
        data,
      })
    } catch (error) {
      errorHandler(error, reply)
    }
  }

  async banUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const params = request.params
      const { id } = FindOneStringSchema.parse(params)

      const data = await usersService.banUser(id)

      return reply.code(HTTP_STATUS.OK).send({
        message: HTTP_MESSAGE.OK,
        data,
      })
    } catch (error) {
      errorHandler(error, reply)
    }
  }

  async unbanUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const params = request.params
      const { id } = FindOneStringSchema.parse(params)

      const data = await usersService.unbanUser(id)

      return reply.code(HTTP_STATUS.OK).send({
        message: HTTP_MESSAGE.OK,
        data,
      })
    } catch (error) {
      errorHandler(error, reply)
    }
  }
}

export const usersController = new UsersController()
