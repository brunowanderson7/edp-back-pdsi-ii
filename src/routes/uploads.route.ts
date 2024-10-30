import { FastifyInstance } from 'fastify'
import { jwtVerify } from '../middlewares/jwt-verify'
import { uploadsController } from '../controllers/uploads.controller'

export async function uploadsRoute(app: FastifyInstance) {
  app.addHook('preHandler', async (request, reply) => {
    await jwtVerify(request, reply)
  })

  app.post('/uploads', async (request, reply) =>
    uploadsController.uploadFile(request, reply),
  )
}
