import '@fastify/jwt'
import { TUserPermissions } from '../lib/types/permissions'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      sub: string
      name: string
      userPermissions: TUserPermissions
    }
  }
}
