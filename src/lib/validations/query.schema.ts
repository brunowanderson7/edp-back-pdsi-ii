import { z } from 'zod'

// Function to create a dynamic Zod schema for a property with a given name
const createDynamicQuerySchema = (propertyName: string) =>
  z.object({
    [propertyName]: z.string(),
  })

export const querySafeParse = (queryParamName: string, requestQueryObject) =>
  createDynamicQuerySchema(queryParamName).safeParse(requestQueryObject)
