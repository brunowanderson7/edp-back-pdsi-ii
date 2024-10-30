import { FastifyReply, FastifyRequest } from 'fastify'
import { uploadsService } from '../services/uploads.service'
import { HTTP_STATUS, HTTP_MESSAGE } from '../constants/http-constants'
import { errorHandler } from '../lib/utils/error-handler'

class UploadsController {
  async uploadFile(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = await uploadsService.uploadFile(request)

      return reply.code(HTTP_STATUS.OK).send({
        message: HTTP_MESSAGE.OK,
        data,
      })
    } catch (error) {
      errorHandler(error, reply)
    }
  }
}

export const uploadsController = new UploadsController()
