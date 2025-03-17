import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { findSimilarItems, SearchItem, searchItems } from '@/utils/search';
import { Search, StarIcon } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CustomCommandEmpty,
  CustomCommandInput,
  CustomCommandItem,
  CustomCommandList,
} from './CustomCommand';

export const SearchView = () => {
  usePageTitle('Zoeken');
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const {
    recentItems,
    favoriteItems,
    addToRecent,
    toggleFavorite,
    isFavorite,
  } = useSearchHistory();

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      return [];
    }
    return searchItems(searchQuery, selectedType);
  }, [searchQuery, selectedType]);

  const handleSelectItem = (item: SearchItem) => {
    addToRecent(item);
    const similarItems = findSimilarItems(item);

    if (similarItems.length > 1) {
      navigate(
        `/overview?field=${item.field}&value=${encodeURIComponent(item.value)}`
      );
    } else {
      navigate(`/detail/${item.itemIndex}`);
    }
  };

  const renderResults = useCallback(() => {
    if (filteredResults.length === 0 && searchQuery) {
      return <CustomCommandEmpty>Geen resultaten gevonden.</CustomCommandEmpty>;
    }

    return filteredResults.map((item) => (
      <CustomCommandItem
        key={item.id}
        onSelect={() => handleSelectItem(item)}
        className="flex items-center justify-between"
      >
        <span>{item.value}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{item.field}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(item);
            }}
          >
            <StarIcon
              className={`h-4 w-4 ${
                isFavorite(item.id) ? 'fill-yellow-400' : 'fill-none'
              }`}
            />
          </Button>
        </div>
      </CustomCommandItem>
    ));
  }, [
    filteredResults,
    searchQuery,
    handleSelectItem,
    toggleFavorite,
    isFavorite,
  ]);

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>IMBOR Zoeken</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-4">
            <div className="rounded-lg border shadow-sm">
              <div className="flex items-center border-b px-3 py-2">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <CustomCommandInput
                  placeholder="Zoek in IMBOR database..."
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  className="flex-1"
                  autoFocus={true}
                />
              </div>
              <div className="p-2 border-b bg-muted/50">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full border-0 bg-transparent shadow-none h-8 px-2">
                    <SelectValue placeholder="Filter op type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle types</SelectItem>
                    <SelectItem value="beheerlaag">Beheerlaag</SelectItem>
                    <SelectItem value="objecttype">Objecttype</SelectItem>
                    <SelectItem value="type">Type</SelectItem>
                    <SelectItem value="type_detail">Type detail</SelectItem>
                    <SelectItem value="type_extra_detail">
                      Type extra detail
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="max-h-72 overflow-auto">
                <CustomCommandList>{renderResults()}</CustomCommandList>
              </div>
            </div>
          </div>

          {/* Recent and Favorites */}
          {!searchQuery && (
            <div className="mt-6 space-y-6">
              {favoriteItems.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Favorieten</h3>
                  <div className="grid gap-2">
                    {favoriteItems.map((item) => (
                      <CustomCommandItem
                        key={item.id}
                        onSelect={() => handleSelectItem(item)}
                        className="flex items-center justify-between"
                      >
                        <span>{item.value}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {item.field}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(item);
                            }}
                          >
                            <StarIcon className="h-4 w-4 fill-yellow-400" />
                          </Button>
                        </div>
                      </CustomCommandItem>
                    ))}
                  </div>
                </div>
              )}

              {recentItems.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Recent bekeken</h3>
                  <div className="grid gap-2">
                    {recentItems.map((item) => (
                      <CustomCommandItem
                        key={item.id}
                        onSelect={() => handleSelectItem(item)}
                        className="flex items-center justify-between"
                      >
                        <span>{item.value}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {item.field}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(item);
                            }}
                          >
                            <StarIcon
                              className={`h-4 w-4 ${
                                isFavorite(item.id)
                                  ? 'fill-yellow-400'
                                  : 'fill-none'
                              }`}
                            />
                          </Button>
                        </div>
                      </CustomCommandItem>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-4 text-sm text-muted-foreground">
            <p>Keyboard shortcuts:</p>
            <ul className="mt-2 space-y-1">
              <li>
                <kbd className="px-2 py-1 bg-muted rounded">ESC</kbd> Ga terug
              </li>
              <li>
                <kbd className="px-2 py-1 bg-muted rounded">/</kbd> Focus zoeken
              </li>
              <li>
                <kbd className="px-2 py-1 bg-muted rounded">s</kbd> Open schema
                explorer
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
