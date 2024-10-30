import { FastifyInstance } from 'fastify'
import { schedulesController } from '../controllers/schedules.controller'
import { jwtVerify } from '../middlewares/jwt-verify'
import { hasPermissions } from '../middlewares/has-permissions'
import { isBanned } from '../middlewares/is-banned'

export async function schedulesRoute(app: FastifyInstance) {
  app.addHook('preHandler', async (request, reply) => {
    if (await jwtVerify(request, reply)) {
      await isBanned(request, reply)
      if (request.method === 'GET') {
        hasPermissions(['schedule', 'reschedule', 'ratm'], request, reply, true)
      } else if (request.method === 'POST') {
        if (request.url === '/schedules') {
          hasPermissions(['schedule'], request, reply)
        } else if (request.url === '/reschedules') {
          hasPermissions(['reschedule'], request, reply)
        }
      }
    }
  })

  app.get('/schedules', async (request, reply) =>
    schedulesController.findAll(request, reply),
  )

  app.put('/schedules/update-status', async (request, reply) =>
    schedulesController.updateStatus(request, reply),
  )

  app.put('/schedules/get-meters-to-test/:quantity', async (request, reply) =>
    schedulesController.getMetersToTest(request, reply),
  )

  app.get('/schedules/:id', async (request, reply) =>
    schedulesController.findOne(request, reply),
  )

  app.post('/schedules', async (request, reply) =>
    schedulesController.create(request, reply),
  )

  app.post('/reschedules', async (request, reply) =>
    schedulesController.reschedule(request, reply),
  )
}
