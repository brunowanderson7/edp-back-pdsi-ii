import { FastifyInstance } from 'fastify'
import { jwtVerify } from '../middlewares/jwt-verify'
import { signaturesController } from '../controllers/signatures.controller'

export async function signaturesRoute(app: FastifyInstance) {
  app.addHook(
    'preHandler',
    async (request, reply) => await jwtVerify(request, reply),
  )

  app.get(
    '/signatures/:token',
    async (request, reply) =>
      await signaturesController.verifySignature(request, reply),
  )

  app.post(
    '/signatures',
    async (request, reply) =>
      await signaturesController.createSignature(request, reply),
  )
}
