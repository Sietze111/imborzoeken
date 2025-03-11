import { imborData } from '@/data/imbordata';

interface SearchItem {
  id: string;
  field: string;
  value: string;
  originalItem: (typeof imborData)[0];
  itemIndex: number;
}

export const prepareSearchItems = (): SearchItem[] => {
  const searchItems: SearchItem[] = [];

  imborData.forEach((item, index) => {
    const itemKey = `item-${index}`;

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

export const findSimilarItems = (item: SearchItem) => {
  return imborData.filter((dataItem) => dataItem[item.field] === item.value);
};
