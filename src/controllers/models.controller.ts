import { FastifyReply, FastifyRequest } from 'fastify'
import { modelsService } from '../services/models.service'
import { HTTP_MESSAGE, HTTP_STATUS } from '../constants/http-constants'
import { FindOneIntSchema } from '../lib/validations/find-one.schema'
import {
  CreateModelSchema,
  UpdateModelSchema,
} from '../lib/validations/models.schema'
import { errorHandler } from '../lib/utils/error-handler'

class ModelsController {
  async findAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = await modelsService.findAll()

      return reply.code(HTTP_STATUS.OK).send({
        message: HTTP_MESSAGE.OK,
        data,
      })
    } catch (error) {
      errorHandler(error, reply)
    }
  }

  async findOneById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const params = request.params
      const { id } = FindOneIntSchema.parse(params)
      const data = await modelsService.findOne(id)

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
      const inputData = CreateModelSchema.parse(body)

      const data = await modelsService.create(inputData)

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
      const { id } = FindOneIntSchema.parse(params)

      const body = request.body
      const inputData = UpdateModelSchema.parse(body)

      const data = await modelsService.update(id, inputData)

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
      const { id } = FindOneIntSchema.parse(params)

      const data = await modelsService.delete(id)

      return reply.code(HTTP_STATUS.OK).send({
        message: HTTP_MESSAGE.OK,
        data,
      })
    } catch (error) {
      errorHandler(error, reply)
    }
  }
}

export const modelsController = new ModelsController()
