import { HTTP_MESSAGE, HTTP_STATUS } from '../../constants/http-constants'
import { GenericError } from './generic-error'

export class BadRequestError extends GenericError {
  constructor(
    httpMessage: string = HTTP_MESSAGE.BAD_REQUEST,
    httpCode: number = HTTP_STATUS.BAD_REQUEST,
  ) {
    super(httpMessage, httpCode)
  }
}
