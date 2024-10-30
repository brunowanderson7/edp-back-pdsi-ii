import { HTTP_MESSAGE, HTTP_STATUS } from '../../constants/http-constants'
import { GenericError } from './generic-error'

export class UnauthorizedError extends GenericError {
  constructor(
    httpMessage: string = HTTP_MESSAGE.UNAUTHORIZED,
    httpCode: number = HTTP_STATUS.UNAUTHORIZED,
  ) {
    super(httpMessage, httpCode)
  }
}
