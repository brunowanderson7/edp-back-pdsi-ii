import { FastifyRequest, FastifyReply } from 'fastify'
import { errorHandler } from '../lib/utils/error-handler'
import { ratmService } from '../services/ratm.service'
import { CreateRATMSchema } from '../lib/validations/ratm.schema'
import { HTTP_MESSAGE, HTTP_STATUS } from '../constants/http-constants'
import { FindOneStringSchema } from '../lib/validations/find-one.schema'
import { querySafeParse } from '../lib/validations/query.schema'

class RATMController {
  async findAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const query = querySafeParse('meter-id', request.query)
      const meterId = query.success ? query.data['meter-id'] : null

      const data = await (meterId
        ? ratmService.findAllByMeterId(meterId)
        : ratmService.findAll())

      return reply.code(HTTP_STATUS.OK).send({
        message: HTTP_MESSAGE.OK,
        data,
      })
    } catch (error) {
      errorHandler(error, reply)
    }
  }

  async findOne(request: FastifyRequest, reply: FastifyReply) {
    try {
      const params = request.params
      const { id } = FindOneStringSchema.parse(params)

      const data = await ratmService.findOne(id)

      return reply.code(HTTP_STATUS.OK).send({
        message: HTTP_MESSAGE.OK,
        data,
      })
    } catch (error) {
      errorHandler(error, reply)
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body
      const inputData = CreateRATMSchema.array().parse(body)

      const data = await ratmService.create(inputData)

      return reply.code(HTTP_STATUS.CREATED).send({
        message: HTTP_MESSAGE.CREATED,
        data,
      })
    } catch (error) {
      errorHandler(error, reply)
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const params = request.params
      const body = request.body

      const { id } = FindOneStringSchema.parse(params)
      const inputData = CreateRATMSchema.parse(body)

      const data = await ratmService.update(id, inputData)

      return reply.code(HTTP_STATUS.OK).send({
        message: HTTP_MESSAGE.OK,
        data,
      })
    } catch (error) {
      errorHandler(error, reply)
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const params = request.params
      const { id } = FindOneStringSchema.parse(params)

      const data = await ratmService.delete(id)

      return reply.code(HTTP_STATUS.OK).send({
        message: HTTP_MESSAGE.OK,
        data,
      })
    } catch (error) {
      errorHandler(error, reply)
    }
  }
}

export const ratmController = new RATMController()
