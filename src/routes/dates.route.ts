import { FastifyInstance } from 'fastify'
import { datesController } from '../controllers/dates.controller'
import { jwtVerify } from '../middlewares/jwt-verify'
import { hasPermissions } from '../middlewares/has-permissions'
import { isBanned } from '../middlewares/is-banned'

export async function datesRoute(app: FastifyInstance) {
  app.addHook('preHandler', async (request, reply) => {
    if (await jwtVerify(request, reply)) {
      await isBanned(request, reply)
      hasPermissions(['date'], request, reply)
    }
  })

  app.get('/dates', async (request, reply) =>
    datesController.findAll(request, reply),
  )

  app.post('/dates', async (request, reply) =>
    datesController.create(request, reply),
  )

  app.delete('/dates', async (request, reply) =>
    datesController.delete(request, reply),
  )
}
