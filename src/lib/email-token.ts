import crypto from 'node:crypto'
import { prisma } from './prisma'

const NUMBER_OF_RANDOM_BYTES = 32

const generateNewToken = (numberOfRandomBytes: number) =>
  crypto.randomBytes(numberOfRandomBytes).toString('hex')

async function getNewEmailToken(userId: string) {
  console.log('Trying to get new email token')

  const token = generateNewToken(NUMBER_OF_RANDOM_BYTES)

  try {
    const newEmailToken = await prisma.token.create({
      data: {
        userId,
        token,
      },
    })

    console.log('New email token created:', newEmailToken.token)
    return newEmailToken.token
  } catch (err) {
    console.log('Error when trying to get new email token')
    throw err
  }
}

export async function getEmailToken(userId: string) {
  console.log('Trying to get email token')

  try {
    const emailToken = await prisma.token.findUnique({
      where: {
        userId,
      },
    })

    if (emailToken) {
      console.log('Email token found:', emailToken.token)
      return emailToken.token
    } else {
      return getNewEmailToken(userId)
    }
  } catch (err) {
    console.log('Error when trying to get email token')
    throw err
  }
}
