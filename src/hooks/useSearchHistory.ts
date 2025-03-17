import { useLocalStorage } from '@/hooks/useLocalStorage';
import { SearchItem } from '@/utils/search';

interface SearchHistory {
  recentItems: SearchItem[];
  favoriteItems: SearchItem[];
}

export const useSearchHistory = () => {
  const [history, setHistory] = useLocalStorage<SearchHistory>(
    'search-history',
    {
      recentItems: [],
      favoriteItems: [],
    }
  );

  const addToRecent = (item: SearchItem) => {
    setHistory((prev) => ({
      ...prev,
      recentItems: [
        item,
        ...prev.recentItems.filter((i) => i.id !== item.id).slice(0, 9),
      ],
    }));
  };

  const toggleFavorite = (item: SearchItem) => {
    setHistory((prev) => {
      const isFavorite = prev.favoriteItems.some((i) => i.id === item.id);
      return {
        ...prev,
        favoriteItems: isFavorite
          ? prev.favoriteItems.filter((i) => i.id !== item.id)
          : [...prev.favoriteItems, item],
      };
    });
  };

  const isFavorite = (itemId: string) => {
    return history.favoriteItems.some((item) => item.id === itemId);
  };

  return {
    recentItems: history.recentItems,
    favoriteItems: history.favoriteItems,
    addToRecent,
    toggleFavorite,
    isFavorite,
  };
};
