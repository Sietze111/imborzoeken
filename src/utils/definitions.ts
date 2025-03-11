import { imborDef } from '@/data/imbordef';

export const fields = [
  { label: 'Beheerlaag', field: 'beheerlaag' },
  { label: 'Objecttype', field: 'objecttype' },
  { label: 'Type', field: 'type' },
  { label: 'Type detail', field: 'type_detail' },
  { label: 'Type extra detail', field: 'type_extra_detail' },
] as const;

export const getDefinition = (field: string, value: string) => {
  const definition = imborDef.find(
    (def) => def.domeinwaarde_domeinwaarde === value
  );
  return definition?.domeinwaarde_definitie || '-';
};
