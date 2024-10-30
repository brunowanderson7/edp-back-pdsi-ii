import { monthOrder } from '../../constants/month-order'

export function dateFormat(date: string) {
  const splitedData = date.split(' ').slice(1) // date: "Thu Jan 04 2024" splitedDate: ["Jan", "04", "2024"]

  const month = monthOrder[splitedData[0]]
  const day = parseInt(splitedData[1])
  const year = parseInt(splitedData[2])

  return new Date(month - 1, day, year) // Date uses a zero-based index for months.
}
