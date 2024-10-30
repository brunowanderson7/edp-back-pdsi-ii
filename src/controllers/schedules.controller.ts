import { FastifyReply, FastifyRequest } from 'fastify'
import { errorHandler } from '../lib/utils/error-handler'
import { HTTP_STATUS, HTTP_MESSAGE } from '../constants/http-constants'
import { schedulesService } from '../services/schedules.service'
import { FindOneIntSchema } from '../lib/validations/find-one.schema'
import {
  CreateRescheduleSchema,
  CreateScheduleSchema,
} from '../lib/validations/schedules.schema'
import { QuantityOfMetersToTestSchema } from '../lib/validations/quantity-of-meters-to-test.schema'
import { MeterStatusSchema } from '../lib/validations/meter-status.schema'

class SchedulesController {
  async findAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = await schedulesService.findAll()

      return reply.code(HTTP_STATUS.OK).send({
        message: HTTP_MESSAGE.OK,
        data,
      })
    } catch (error) {
      errorHandler(error, reply)
    }
  }

  async getMetersToTest(request: FastifyRequest, reply: FastifyReply) {
    try {
      const params = request.params
      const { quantity } = QuantityOfMetersToTestSchema.parse(params)

      const data = await schedulesService.getMetersToTest(quantity)

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
      const { id } = FindOneIntSchema.parse(params)

      const data = await schedulesService.findOne(id)

      return reply.code(HTTP_STATUS.OK).send({
        message: HTTP_MESSAGE.OK,
        data,
      })
    } catch (error) {
      errorHandler(error, reply)
    }
  }

  async updateStatus(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body
      console.log('body', body)
      const { meterId, meterStatus } = MeterStatusSchema.parse(body)

      console.log('aaaaaa', meterId, meterStatus)

      const data = await schedulesService.updateStatus(meterId, meterStatus)

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
      const userId = request.user.sub

      const body = request.body
      const inputData = CreateScheduleSchema.parse(body)

      const data = await schedulesService.create(userId, inputData)

      return reply.code(HTTP_STATUS.CREATED).send({
        message: HTTP_MESSAGE.CREATED,
        data,
      })
    } catch (error) {
      errorHandler(error, reply)
    }
  }

  async reschedule(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user.sub

      const body = request.body
      const inputData = CreateRescheduleSchema.parse(body)

      const data = await schedulesService.reschedule(userId, inputData)

      return reply.code(HTTP_STATUS.CREATED).send({
        message: HTTP_MESSAGE.CREATED,
        data,
      })
    } catch (error) {
      errorHandler(error, reply)
    }
  }
}

export const schedulesController = new SchedulesController()
