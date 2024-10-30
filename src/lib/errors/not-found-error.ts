import { HTTP_MESSAGE, HTTP_STATUS } from '../../constants/http-constants'
import { GenericError } from './generic-error'

export class NotFoundError extends GenericError {
  constructor(
    httpMessage: string = HTTP_MESSAGE.NOT_FOUND,
    httpCode: number = HTTP_STATUS.NOT_FOUND,
  ) {
    super(httpMessage, httpCode)
  }
}
