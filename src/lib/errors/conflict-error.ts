import { HTTP_MESSAGE, HTTP_STATUS } from '../../constants/http-constants'
import { GenericError } from './generic-error'

export class ConfictError extends GenericError {
  constructor(
    httpMessage: string = HTTP_MESSAGE.CONFLICT,
    httpCode: number = HTTP_STATUS.CONFLICT,
  ) {
    super(httpMessage, httpCode)
  }
}
