import { HTTP_MESSAGE, HTTP_STATUS } from '../../constants/http-constants'
import { GenericError } from './generic-error'

export class ForbiddenError extends GenericError {
  constructor(
    httpMessage: string = HTTP_MESSAGE.FORBIDDEN,
    httpCode: number = HTTP_STATUS.FORBIDDEN,
  ) {
    super(httpMessage, httpCode)
  }
}
