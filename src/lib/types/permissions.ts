import { Permissions } from '@prisma/client'

export type TPrismaPermissions = Permissions
export type TUserPermissions = Omit<Permissions, 'id' | 'userId'>
