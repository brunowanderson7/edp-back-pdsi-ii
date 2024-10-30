import { FastifyInstance } from 'fastify'
import { ratmController } from '../controllers/ratm.controller'
import { hasPermissions } from '../middlewares/has-permissions'
import { isBanned } from '../middlewares/is-banned'
import { jwtVerify } from '../middlewares/jwt-verify'

export async function ratmRoute(app: FastifyInstance) {
  app.addHook('preHandler', async (request, reply) => {
    if (await jwtVerify(request, reply)) {
      await isBanned(request, reply)
      hasPermissions(['ratm'], request, reply)
    }
  })

  app.get('/ratm', async (request, reply) =>
    ratmController.findAll(request, reply),
  )

  app.get('/ratm/:id', async (request, reply) =>
    ratmController.findOne(request, reply),
  )

  app.post('/ratm', async (request, reply) =>
    ratmController.create(request, reply),
  )

  app.patch('/ratm/:id', async (request, reply) =>
    ratmController.update(request, reply),
  )

  app.delete('/ratm/:id', async (request, reply) =>
    ratmController.delete(request, reply),
  )
}
