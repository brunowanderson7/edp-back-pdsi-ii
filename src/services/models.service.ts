import { ConfictError } from '../lib/errors/conflict-error'
import { NotFoundError } from '../lib/errors/not-found-error'
import { prisma } from '../lib/prisma'
import { TCreateModel, TUpdateModel } from '../lib/validations/models.schema'

class ModelsService {
  async findAll() {
    return prisma.model.findMany()
  }

  async findOne(id: number) {
    const model = await prisma.model.findUnique({
      where: { id },
    })

    if (!model) {
      throw new NotFoundError()
    }

    return model
  }

  async create(data: TCreateModel) {
    const model = await prisma.model.findUnique({
      where: {
        name: data.name,
      },
    })

    if (model) {
      throw new ConfictError(`Name ${data.name} is already in use`)
    }

    return prisma.model.create({ data })
  }

  async update(id: number, data: TUpdateModel) {
    const model = await prisma.model.findUnique({
      where: {
        id,
      },
    })

    if (!model) {
      throw new NotFoundError(`Model with ID ${id} not found`)
    }

    if (data.name) {
      const isNameInUse = await prisma.model.findUnique({
        where: {
          name: data.name,
        },
      })

      if (isNameInUse && isNameInUse.id !== id) {
        throw new ConfictError(`Name ${data.name} is already in use`)
      }
    }

    return prisma.model.update({
      where: {
        id,
      },
      data,
    })
  }

  async delete(id: number) {
    const model = await prisma.model.findUnique({
      where: { id },
    })

    if (!model) {
      throw new NotFoundError()
    }

    return prisma.model.delete({ where: { id } })
  }
}

export const modelsService = new ModelsService()
