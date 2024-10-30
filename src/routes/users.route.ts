import { FastifyInstance } from 'fastify'
import { usersController } from '../controllers/users.controller'
import { jwtVerify } from '../middlewares/jwt-verify'
import { hasPermissions } from '../middlewares/has-permissions'
import { isBanned } from '../middlewares/is-banned'

export async function usersRoute(app: FastifyInstance) {
  app.addHook('preHandler', async (request, reply) => {
    if (await jwtVerify(request, reply)) {
      await isBanned(request, reply)
      hasPermissions(['manager'], request, reply)
    }
  })

  app.get('/users', async (request, reply) =>
    usersController.findAll(request, reply),
  )

  app.put('/users/:id/ban-user', async (request, reply) =>
    usersController.banUser(request, reply),
  )

  app.put('/users/:id/unban-user', async (request, reply) =>
    usersController.unbanUser(request, reply),
  )
}
