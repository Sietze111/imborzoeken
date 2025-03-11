import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { findSimilarItems, prepareSearchItems } from '@/utils/search';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CustomCommandEmpty,
  CustomCommandInput,
  CustomCommandItem,
} from './CustomCommand';

export const SearchView = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const allSearchItems = prepareSearchItems();

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredItems([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = allSearchItems.filter((item) =>
      item.value.toLowerCase().includes(query)
    );

    const uniqueResults = results.filter(
      (item, index, self) =>
        index ===
        self.findIndex((t) => t.value === item.value && t.field === item.field)
    );

    setFilteredItems(uniqueResults);
  }, [searchQuery]);

  const handleSelectItem = (item) => {
    const similarItems = findSimilarItems(item);

    if (similarItems.length > 1) {
      navigate(
        `/overview?field=${item.field}&value=${encodeURIComponent(item.value)}`
      );
    } else {
      navigate(`/detail/${item.itemIndex}`);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>IMBOR Zoeken</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border shadow-md">
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
            <div className="max-h-72 overflow-auto">
              {filteredItems.length === 0 && searchQuery && (
                <CustomCommandEmpty>
                  Geen resultaten gevonden.
                </CustomCommandEmpty>
              )}
              <div>
                {filteredItems.map((item) => (
                  <CustomCommandItem
                    key={item.id}
                    onSelect={() => handleSelectItem(item)}
                    className="flex justify-between"
                  >
                    <span>{item.value}</span>
                    <span className="text-sm text-gray-500">{item.field}</span>
                  </CustomCommandItem>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
