import { imborData } from '@/data/imbordata';
import Fuse from 'fuse.js';

type ImborField = keyof (typeof imborData)[0];

export interface SearchItem {
  id: string;
  field: ImborField;
  value: string;
  originalItem: (typeof imborData)[0];
  itemIndex: number;
}

// Optimize search options
const fuseOptions = {
  includeScore: false, // Remove if we don't use the score
  threshold: 0.3,
  keys: ['value'],
  minMatchCharLength: 2, // Only search terms of 2+ chars
  shouldSort: true,
  ignoreLocation: true, // Faster if we don't care about where the match occurs
  cache: true, // Enable caching
};

// Pre-process search items once
const searchItemsData = imborData.flatMap((item, index) =>
  Object.entries(item)
    .filter(([_, value]) => value && typeof value === 'string')
    .map(([field, value]) => ({
      id: `${index}-${field}`,
      field: field as ImborField,
      value: value as string,
      originalItem: item,
      itemIndex: index,
    }))
);

const fuse = new Fuse(searchItemsData, fuseOptions);

// Debounce and memoize search results
const searchCache = new Map<string, SearchItem[]>();

export const searchItems = (
  query: string,
  type: string = 'all'
): SearchItem[] => {
  if (!query.trim()) return [];

  const cacheKey = `${query}-${type}`;
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey)!;
  }

  const results = fuse.search(query).map((result) => result.item);
  const filtered =
    type === 'all' ? results : results.filter((item) => item.field === type);

  const deduplicated = filtered.filter(
    (item, index, self) =>
      index ===
      self.findIndex((t) => t.value === item.value && t.field === item.field)
  );

  searchCache.set(cacheKey, deduplicated);
  if (searchCache.size > 100) {
    // Prevent memory leaks
    const firstKey = searchCache.keys().next().value;
    searchCache.delete(firstKey);
  }

  return deduplicated;
};

export const findSimilarItems = (item: SearchItem) => {
  return imborData.filter((dataItem) => dataItem[item.field] === item.value);
};
