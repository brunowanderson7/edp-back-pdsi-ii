import { FastifyRequest, FastifyReply } from 'fastify'
import { errorHandler } from '../lib/utils/error-handler'
import { metersService } from '../services/meters.service'
import { HTTP_MESSAGE, HTTP_STATUS } from '../constants/http-constants'
import { querySafeParse } from '../lib/validations/query.schema'
import {
  CreateMeterSchema,
  UpdateMeterSchema,
} from '../lib/validations/meters.schema'
import { FindOneStringSchema } from '../lib/validations/find-one.schema'
import { GetMeterByStatusSchema } from '../lib/validations/get-meter-by-status.schema'

class MetersController {
  async findAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const query = querySafeParse('fields', request.query)
      const fieldsToPopulate = query.success ? query.data.fields : null

      const data = await (fieldsToPopulate
        ? metersService.findAllWithFields(fieldsToPopulate.split(','))
        : metersService.findAll())

      return reply.code(HTTP_STATUS.OK).send({
        message: HTTP_MESSAGE.OK,
        data,
      })
    } catch (error) {
      errorHandler(error, reply)
    }
  }

  async findAllByMeterStatus(request: FastifyRequest, reply: FastifyReply) {
    try {
      const params = request.params
      const { status } = GetMeterByStatusSchema.parse(params)

      const data = await metersService.findAllByMeterStatus(status)

      return reply.code(HTTP_STATUS.OK).send({
        message: HTTP_MESSAGE.OK,
        data,
      })
    } catch (error) {
      errorHandler(error, reply)
    }
  }

  async finOne(request: FastifyRequest, reply: FastifyReply) {
    try {
      const params = request.params
      const { id } = FindOneStringSchema.parse(params)

      const data = await metersService.findOne(id)

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
      const inputData = CreateMeterSchema.parse(body)

      const data = await metersService.create(inputData)

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
      const { id } = FindOneStringSchema.parse(params)

      const body = request.body
      const inputData = UpdateMeterSchema.parse(body)

      console.log(inputData)

      const data = await metersService.update(id, inputData)

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

      const data = await metersService.delete(id)

      return reply.code(HTTP_STATUS.OK).send({
        message: HTTP_MESSAGE.OK,
        data,
      })
    } catch (error) {
      errorHandler(error, reply)
    }
  }
}

export const metersController = new MetersController()
