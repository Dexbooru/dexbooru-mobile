export function createPageNumberPaginator() {
  let pageNumber = 0;

  return {
    get pageNumber() {
      return pageNumber;
    },
    nextPage() {
      const current = pageNumber;
      pageNumber += 1;
      return current;
    },
    reset() {
      pageNumber = 0;
    },
  };
}

export function getNextPageParam<T>(
  lastPage: T[] | undefined,
  lastPageParam: number,
  pageSize: number,
): number | undefined {
  if (!Array.isArray(lastPage) || lastPage.length === 0 || lastPage.length < pageSize) return undefined;
  return lastPageParam + 1;
}
