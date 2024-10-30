import { FastifyRequest } from 'fastify'
import { BadRequestError } from '../lib/errors/bad-request-error'
import { createWriteStream } from 'fs'
import { pipeline } from 'stream'
import path from 'path'

class UploadsService {
  async uploadFile(request: FastifyRequest) {
    const data = await request.file()

    if (!data) {
      throw new BadRequestError('No file received')
    }

    const fileName = `${Date.now()}-${data.filename}`

    const fullPath = path.join(__dirname, '..', '..', 'uploads')

    const uploadPath = `${fullPath}/${fileName}`

    const writeStream = createWriteStream(uploadPath)

    await new Promise<void>((resolve, reject) => {
      pipeline(data.file, writeStream, (error) => {
        if (error) {
          reject(new BadRequestError('Error uploading file'))
        } else {
          resolve()
        }
      })
    })

    const fullUrl = request.protocol.concat('://').concat(request.hostname) // http or https?
    const fileUrl = new URL(`/uploads/${fileName}`, fullUrl).toString()

    return fileUrl
  }
}

export const uploadsService = new UploadsService()
