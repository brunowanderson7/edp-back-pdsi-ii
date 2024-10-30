import { HTTP_MESSAGE, HTTP_STATUS } from '../../constants/http-constants'

export class GenericError extends Error {
  httpMessage: string
  httpCode: number

  constructor(
    httpMessage: string = HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
    httpCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  ) {
    super()
    this.httpMessage = httpMessage
    this.httpCode = httpCode
  }
}
