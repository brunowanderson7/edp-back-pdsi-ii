import { PrismaClient } from '@prisma/client'
import { encrypt } from '../src/lib/security/cryptography'
const prisma = new PrismaClient({
  log: ['query'],
})

async function main() {
  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: encrypt('password'),
      isUserApproved: true,
      isEmailApproved: true,
      permissions: {
        create: {
          manager: true,
          date: true,
          schedule: true,
          reschedule: true,
          ratm: true,
          model: true,
          discard: true,
          consult: true,
        },
      },
    },
  })

  await prisma.user.create({
    data: {
      name: 'Test',
      email: 'test@test.com',
      password: encrypt('password'),
      isUserApproved: false,
      isEmailApproved: true,
      permissions: {
        create: {
          consult: true,
        },
      },
    },
  })

  await prisma.user.create({
    data: {
      name: 'Renan',
      email: 'renangabrielsilva150@gmail.com',
      password: encrypt('password'),
      isUserApproved: false,
      isEmailApproved: false,
      permissions: {
        create: {
          consult: true,
        },
      },
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    // process.exit(1)
  })
