import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { LinkedInLogoIcon } from '@radix-ui/react-icons';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { AvatarImage } from '@radix-ui/react-avatar';
import { imborData } from './data/imbordata';

// Custom Command components implementation
const CustomCommandInput = ({
  placeholder,
  value,
  onValueChange,
  className,
  autoFocus,
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className={`w-full p-2 focus:outline-none ${className}`}
      autoFocus={autoFocus}
    />
  );
};

const CustomCommandItem = ({ children, onSelect, className }) => {
  return (
    <div
      onClick={onSelect}
      className={`p-2 cursor-pointer hover:bg-gray-100 ${className}`}
    >
      {children}
    </div>
  );
};

const CustomCommandEmpty = ({ children }) => {
  return <div className="p-2 text-gray-500 text-center">{children}</div>;
};

const App = () => {
  // Sample data from the prompt

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [view, setView] = useState('search'); // 'search', 'detail', 'overview'
  const [overviewField, setOverviewField] = useState('');
  const [overviewValue, setOverviewValue] = useState('');

  // URL routing
  useEffect(() => {
    // Handle initial URL and browser navigation
    const handleUrlNavigation = () => {
      const path = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);

      if (path.includes('/detail/')) {
        const itemId = path.split('/detail/')[1];
        // Find the item by ID or index
        const item = imborData[itemId] || null;
        if (item) {
          setSelectedItem(item);
          setView('detail');
        } else {
          // Redirect to search if item not found
          navigateToSearch();
        }
      } else if (path.includes('/overview/')) {
        const field = searchParams.get('field');
        const value = searchParams.get('value');
        if (field && value) {
          setOverviewField(field);
          setOverviewValue(decodeURIComponent(value));
          setView('overview');
        } else {
          navigateToSearch();
        }
      } else {
        // Default to search view
        setView('search');
      }
    };

    handleUrlNavigation();

    // Listen for browser navigation (back/forward)
    window.addEventListener('popstate', handleUrlNavigation);
    return () => window.removeEventListener('popstate', handleUrlNavigation);
  }, []);

  // Update URL when view changes
  useEffect(() => {
    let url = '/';

    if (view === 'detail' && selectedItem) {
      const itemIndex = imborData.findIndex((item) => item === selectedItem);
      url = `/detail/${itemIndex}`;
    } else if (view === 'overview') {
      url = `/overview/?field=${overviewField}&value=${encodeURIComponent(
        overviewValue
      )}`;
    }

    // Update URL without triggering page reload
    window.history.pushState({}, '', url);
  }, [view, selectedItem, overviewField, overviewValue]);

  // Process data for search
  const prepareSearchItems = () => {
    let searchItems = [];

    imborData.forEach((item, index) => {
      // Create a unique key for each item
      const itemKey = `item-${index}`;

      // Add each field as a searchable item if it has a value
      if (item.beheerlaag) {
        searchItems.push({
          id: `${itemKey}-beheerlaag`,
          field: 'beheerlaag',
          value: item.beheerlaag,
          originalItem: item,
          itemIndex: index,
        });
      }

      if (item.objecttype) {
        searchItems.push({
          id: `${itemKey}-objecttype`,
          field: 'objecttype',
          value: item.objecttype,
          originalItem: item,
          itemIndex: index,
        });
      }

      if (item.type) {
        searchItems.push({
          id: `${itemKey}-type`,
          field: 'type',
          value: item.type,
          originalItem: item,
          itemIndex: index,
        });
      }

      if (item.type_detail) {
        searchItems.push({
          id: `${itemKey}-type_detail`,
          field: 'type_detail',
          value: item.type_detail,
          originalItem: item,
          itemIndex: index,
        });
      }

      if (item.type_extra_detail) {
        searchItems.push({
          id: `${itemKey}-type_extra_detail`,
          field: 'type_extra_detail',
          value: item.type_extra_detail,
          originalItem: item,
          itemIndex: index,
        });
      }
    });

    return searchItems;
  };

  const allSearchItems = prepareSearchItems();

  // Filter search results based on query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredItems([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = allSearchItems.filter((item) =>
      item.value.toLowerCase().includes(query)
    );

    // Remove duplicates (by value) from results
    const uniqueResults = results.filter(
      (item, index, self) =>
        index ===
        self.findIndex((t) => t.value === item.value && t.field === item.field)
    );

    setFilteredItems(uniqueResults);
  }, [searchQuery]);

  // Update the findSimilarItems function to check based on the selected field
  const findSimilarItems = (item) => {
    return imborData.filter((dataItem) => dataItem[item.field] === item.value);
  };

  // Update the handleSelectItem function
  const handleSelectItem = (item) => {
    const similarItems = findSimilarItems(item);

    if (similarItems.length > 1) {
      // Multiple items found with the same field value - show overview
      setOverviewField(item.field);
      setOverviewValue(item.value);
      setView('overview');
    } else {
      // Single unique item - show detail
      setSelectedItem(item.originalItem);
      setView('detail');
    }
  };

  // Handle field click in detail view
  const handleFieldClick = (field, value) => {
    if (field !== 'type_extra_detail' && value) {
      setOverviewField(field);
      setOverviewValue(value);
      setView('overview');
    }
  };

  // Get items for overview page
  const getOverviewItems = () => {
    // Get all items with the selected field value
    const itemsWithSameValue = imborData.filter(
      (item) => item[overviewField] === overviewValue
    );

    return itemsWithSameValue;
  };

  // Navigate to search
  const navigateToSearch = () => {
    setView('search');
    setSearchQuery('');
  };

  // Go back to previous view
  const goBack = () => {
    if (view === 'detail') {
      setView('search');
    } else if (view === 'overview') {
      setView('detail');
    }
  };

  // Render search view
  const renderSearchView = () => {
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
                      <span className="text-sm text-gray-500">
                        {item.field}
                      </span>
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

  // Render detail view
  const renderDetailView = () => {
    if (!selectedItem) return null;

    return (
      <div className="w-full max-w-2xl mx-auto p-4">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={navigateToSearch}>Zoeken</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbPage>Details</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>IMBOR Object Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-3 gap-4">
              <dt className="font-semibold col-span-1">Beheerlaag:</dt>
              <dd
                className="col-span-2 underline cursor-pointer text-blue-600"
                onClick={() =>
                  handleFieldClick('beheerlaag', selectedItem.beheerlaag)
                }
              >
                {selectedItem.beheerlaag || '-'}
              </dd>

              <dt className="font-semibold col-span-1">Objecttype:</dt>
              <dd
                className="col-span-2 underline cursor-pointer text-blue-600"
                onClick={() =>
                  handleFieldClick('objecttype', selectedItem.objecttype)
                }
              >
                {selectedItem.objecttype || '-'}
              </dd>

              <dt className="font-semibold col-span-1">Type:</dt>
              <dd
                className="col-span-2 underline cursor-pointer text-blue-600"
                onClick={() => handleFieldClick('type', selectedItem.type)}
              >
                {selectedItem.type || '-'}
              </dd>

              <dt className="font-semibold col-span-1">Type detail:</dt>
              <dd
                className="col-span-2 underline cursor-pointer text-blue-600"
                onClick={() =>
                  handleFieldClick('type_detail', selectedItem.type_detail)
                }
              >
                {selectedItem.type_detail || '-'}
              </dd>

              <dt className="font-semibold col-span-1">Type extra detail:</dt>
              <dd className="col-span-2">
                {selectedItem.type_extra_detail || '-'}
              </dd>
            </dl>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Render overview view
  const renderOverviewView = () => {
    const overviewItems = getOverviewItems();

    return (
      <div className="w-full max-w-2xl mx-auto p-4">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={navigateToSearch}>Zoeken</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {selectedItem && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink onClick={goBack}>Details</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            <BreadcrumbPage>Overzicht</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>
                {overviewField}: {overviewValue}
              </span>
              <span className="text-sm text-gray-500">
                {overviewItems.length}{' '}
                {overviewItems.length === 1 ? 'resultaat' : 'resultaten'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {overviewItems.map((item, index) => (
                <Card
                  key={index}
                  className="w-full p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    setSelectedItem(item);
                    setView('detail');
                  }}
                >
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-semibold">Beheerlaag:</div>
                    <div>{item.beheerlaag || '-'}</div>

                    <div className="font-semibold">Objecttype:</div>
                    <div>{item.objecttype || '-'}</div>

                    <div className="font-semibold">Type:</div>
                    <div>{item.type || '-'}</div>

                    <div className="font-semibold">Type detail:</div>
                    <div>{item.type_detail || '-'}</div>

                    <div className="font-semibold">Type extra detail:</div>
                    <div>{item.type_extra_detail || '-'}</div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Render appropriate view based on state
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Add the header */}
      <header className="w-full border-b bg-white">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <h1 className="text-xl font-semibold">IMBOR Explorer</h1>
          <HoverCard>
            <HoverCardTrigger asChild>
              <button className="rounded-full">
                <Avatar>
                  <AvatarImage src="https://avatars.githubusercontent.com/u/62135837?v=4" />
                  <AvatarFallback>SS</AvatarFallback>
                </Avatar>
              </button>
            </HoverCardTrigger>
            <HoverCardContent className="flex">
              <div className="justify-between space-x-1">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Sietze Soet</h4>
                  <div className="flex items-center pt-2">
                    <LinkedInLogoIcon className="mr-2 h-4 w-4" />
                    <a
                      href="https://www.linkedin.com/in/sietzesoet/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      @sietzesoet
                    </a>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </header>

      <div className="py-8">
        {view === 'search' && renderSearchView()}
        {view === 'detail' && renderDetailView()}
        {view === 'overview' && renderOverviewView()}
      </div>
    </div>
  );
};

export default App;
