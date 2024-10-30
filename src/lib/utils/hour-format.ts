export function hourFormat(hour: string) {
  const hourSplited = hour.split(':')

  const hourParsed = parseInt(hourSplited[0])
  const minutesParsed = parseInt(hourSplited[1])

  return new Date(0, 0, 0, hourParsed, minutesParsed)
}
