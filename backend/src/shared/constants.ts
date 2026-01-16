export const SORT_BY = {
  DATE: 'date',
  POPULARITY: 'popularity',
} as const;

export type SortBy = typeof SORT_BY[keyof typeof SORT_BY];

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export type SortOrder = typeof SORT_ORDER[keyof typeof SORT_ORDER];
