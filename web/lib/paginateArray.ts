export function paginateArray<T>(
  array: T[],
  cursor?: string,
  limit: number = 10
): {
  data: T[];
  hasMore: boolean;
  nextCursor?: string;
  total: number;
} {
  const startIndex = cursor ? parseInt(cursor) : 0;
  const endIndex = startIndex + limit;
  const data = array.slice(startIndex, endIndex);
  const hasMore = endIndex < array.length;
  const nextCursor = hasMore ? endIndex.toString() : undefined;

  return {
    data,
    hasMore,
    nextCursor,
    total: array.length,
  };
}

export function generateId(prefix: string): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${prefix}-${timestamp}-${random}`;
}
