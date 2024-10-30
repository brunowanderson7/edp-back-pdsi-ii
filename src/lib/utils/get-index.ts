export function getIndex<T>(item: T, items: T[]) {
  return items.findIndex((itemOfItems) => itemOfItems === item)
}
