export function getHttpResponse(
  message = 'Internal Server Error',
  statusCode = 500,
): { statusCode: number; response: { message: string; error?: unknown } } {
  return {
    response: { message },
    statusCode,
  }
}
