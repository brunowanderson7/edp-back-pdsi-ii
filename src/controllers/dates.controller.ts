import { FastifyRequest, FastifyReply } from 'fastify'
import { HTTP_STATUS, HTTP_MESSAGE } from '../constants/http-constants'
import { errorHandler } from '../lib/utils/error-handler'
import { datesService } from '../services/dates.service'
import { querySafeParse } from '../lib/validations/query.schema'
import { CreateDeleteDateSchema } from '../lib/validations/dates.schema'

class DatesController {
  async findAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const query = querySafeParse('not-schedule-only', request.query)
      const notScheduleOnly =
        query.success && query.data['not-schedule-only'] === 'true'

      const data = await (notScheduleOnly
        ? datesService.findAllNotScheduled()
        : datesService.findAll())

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
      const inputData = CreateDeleteDateSchema.parse(body)

      const data = await datesService.create(inputData)

      return reply.code(HTTP_STATUS.CREATED).send({
        message: HTTP_MESSAGE.CREATED,
        data,
      })
    } catch (error) {
      errorHandler(error, reply)
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body
      const inputData = CreateDeleteDateSchema.parse(body)

      const data = await datesService.delete(inputData)

      return reply.code(HTTP_STATUS.OK).send({
        message: HTTP_MESSAGE.OK,
        data,
      })
    } catch (error) {
      errorHandler(error, reply)
    }
  }
}

export const datesController = new DatesController()
