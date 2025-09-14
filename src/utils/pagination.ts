export function getPageNumbers(page: number, totalPages: number, maxVisible: number = 5): number[] {
  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, page - half);
  let end = Math.min(totalPages, page + half);

  if (end - start + 1 < maxVisible) {
    if (start === 1) {
      end = Math.min(totalPages, start + maxVisible - 1);
    } else if (end === totalPages) {
      start = Math.max(1, end - maxVisible + 1);
    }
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}