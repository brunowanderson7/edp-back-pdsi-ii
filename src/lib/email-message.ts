export const emailMessage = (
  name: string,
  goal: string,
  url: string,
): string => {
  return `Olá ${name}, clique no link para ${goal}:\n${url}`
}
