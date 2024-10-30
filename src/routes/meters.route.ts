import { FastifyInstance } from 'fastify'
import { jwtVerify } from '../middlewares/jwt-verify'
import { hasPermissions } from '../middlewares/has-permissions'
import { metersController } from '../controllers/meters.controller'
import { isBanned } from '../middlewares/is-banned'

export async function metersRoute(app: FastifyInstance) {
  app.addHook('preHandler', async (request, reply) => {
    if (await jwtVerify(request, reply)) {
      await isBanned(request, reply)
      hasPermissions(
        ['schedule', 'reschedule', 'discard'],
        request,
        reply,
        true,
      )
    }
  })

  app.get('/meters', async (request, reply) =>
    metersController.findAll(request, reply),
  )

  app.get('/meters/status/:status', async (request, reply) =>
    metersController.findAllByMeterStatus(request, reply),
  )

  app.get('/meters/:id', async (request, reply) =>
    metersController.finOne(request, reply),
  )

  app.post('/meters', async (request, reply) =>
    metersController.create(request, reply),
  )

  app.patch('/meters/:id', async (request, reply) =>
    metersController.update(request, reply),
  )

  app.delete('/meters/:id', async (request, reply) =>
    metersController.delete(request, reply),
  )
}
