import { TPrismaPermissions, TUserPermissions } from '../types/permissions'

export function getUserPermissions(
  permissions: TPrismaPermissions,
): TUserPermissions {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, userId, ...userPermissions } = permissions

  return userPermissions
}
