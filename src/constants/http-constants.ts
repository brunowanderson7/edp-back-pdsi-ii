export enum HTTP_STATUS {
  OK = 200,
  CREATED = 201,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  BAD_REQUEST = 400,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
  EMAIL_NOT_SENT_ERROR = 551,
  BANNED = 552,
}

export enum HTTP_MESSAGE {
  OK = 'OK',
  CREATED = 'Created',
  UNAUTHORIZED = 'Unauthorized',
  FORBIDDEN = 'Forbidden',
  NOT_FOUND = 'Not Found',
  BAD_REQUEST = 'Bad Request',
  CONFLICT = 'Conflict',
  UNPROCESSABLE_ENTITY = 'Unprocessable Entity',
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
  EMAIL_NOT_SENT_ERROR = 'Failed to send email',
  BANNED = 'Banned',
}
