import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import { loginRoute } from './routes/login'
import { registerRoute } from './routes/register'
import { emailRoute } from './routes/email'
import cors from '@fastify/cors'
import { manageUsersRoutes } from './routes/manager/manage-users'
import { passwordRoutes } from './routes/password'
import { modelsRoute } from './routes/models.route'
import { datesRoute } from './routes/dates.route'
import { metersRoute } from './routes/meters.route'
import { schedulesRoute } from './routes/schedules.route'
import { usersRoute } from './routes/users.route'
import { ratmRoute } from './routes/ratm.route'
import { uploadsRoute } from './routes/uploads.route'
import path from 'path'
import { signaturesRoute } from './routes/signatures.route'

const app = fastify()

app.register(cors, {
  origin: true,
})

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'Garagaragaragaragaragaranhão...',
})

app.register(multipart)

app.register(fastifyStatic, {
  root: path.join(__dirname, '../uploads'),
  prefix: '/uploads', // URL prefix to serve the files
})

app.register(loginRoute)
app.register(registerRoute)
app.register(emailRoute)
app.register(manageUsersRoutes)
app.register(passwordRoutes)

// New structure
app.register(modelsRoute)
app.register(datesRoute)
app.register(metersRoute)
app.register(schedulesRoute)
app.register(usersRoute)
app.register(ratmRoute)
app.register(uploadsRoute)
app.register(signaturesRoute)

app.listen(
  {
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
  },
  (err, address) => {
    if (err) {
      console.error(`Error starting the server: ${err}`)
      process.exit(1)
    }

    console.log(
      `HTTP server running on http://localhost:${address.split(':')[2]}`,
    )
  },
)
