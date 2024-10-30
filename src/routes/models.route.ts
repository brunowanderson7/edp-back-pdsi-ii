import { FastifyInstance } from 'fastify'
import { modelsController } from '../controllers/models.controller'
import { jwtVerify } from '../middlewares/jwt-verify'
import { hasPermissions } from '../middlewares/has-permissions'
import { isBanned } from '../middlewares/is-banned'

export async function modelsRoute(app: FastifyInstance) {
  app.addHook('preHandler', async (request, reply) => {
    if (await jwtVerify(request, reply)) {
      await isBanned(request, reply)
      hasPermissions(['model'], request, reply)
    }
  })

  app.get('/models', async (request, reply) =>
    modelsController.findAll(request, reply),
  )

  app.get('/models/:id', async (request, reply) =>
    modelsController.findOneById(request, reply),
  )

  app.post('/models', async (request, reply) =>
    modelsController.create(request, reply),
  )

  app.patch('/models/:id', async (request, reply) =>
    modelsController.update(request, reply),
  )

  app.delete('/models/:id', async (request, reply) =>
    modelsController.delete(request, reply),
  )
}
