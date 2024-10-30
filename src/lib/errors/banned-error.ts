import { HTTP_MESSAGE, HTTP_STATUS } from '../../constants/http-constants'
import { GenericError } from './generic-error'

export class BannedError extends GenericError {
  constructor(
    httpMessage: string = HTTP_MESSAGE.BANNED,
    httpCode: number = HTTP_STATUS.BANNED,
  ) {
    super(httpMessage, httpCode)
  }
}
