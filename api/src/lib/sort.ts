// Pretty odd that this is needed. lodash FTW
export function sortArray(x: Record<string, any>, y: Record<string, any>) {
  if (x.firstName < y.firstName) {
    return -1;
  }

  if (x.firstName > y.firstName) {
    return 1;
  }

  return 0;
}
