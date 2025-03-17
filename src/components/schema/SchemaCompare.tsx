import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { imborkolommen } from '@/data/imborkolommen';
import { imbortabellen } from '@/data/imbortabellen';
import { cn } from '@/lib/utils';
import { useMemo, useState } from 'react';

type FilterType = 'all' | 'shared' | 'unique';

export const SchemaCompare = () => {
  const [table1, setTable1] = useState('');
  const [table2, setTable2] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');

  const columns1 = imborkolommen.filter((col) => col.tabel === table1);
  const columns2 = imborkolommen.filter((col) => col.tabel === table2);

  const tableInfo1 = imbortabellen.find((t) => t.tabel === table1);
  const tableInfo2 = imbortabellen.find((t) => t.tabel === table2);

  const comparison = useMemo(() => {
    if (!columns1.length || !columns2.length) return { table1: [], table2: [] };

    const cols1 = columns1
      .map((col) => ({
        ...col,
        exists: columns2.some((c) => c.kolom_kolom === col.kolom_kolom),
      }))
      .sort((a, b) => a.kolom_kolom.localeCompare(b.kolom_kolom));

    const cols2 = columns2
      .map((col) => ({
        ...col,
        exists: columns1.some((c) => c.kolom_kolom === col.kolom_kolom),
      }))
      .sort((a, b) => a.kolom_kolom.localeCompare(b.kolom_kolom));

    return {
      table1: cols1,
      table2: cols2,
      summary: {
        shared: cols1.filter((col) => col.exists).length,
        uniqueToTable1: cols1.filter((col) => !col.exists).length,
        uniqueToTable2: cols2.filter((col) => !col.exists).length,
      },
    };
  }, [columns1, columns2]);

  const getFilteredColumns = (columns: typeof comparison.table1) => {
    switch (filter) {
      case 'shared':
        return columns.filter((col) => col.exists);
      case 'unique':
        return columns.filter((col) => !col.exists);
      default:
        return columns;
    }
  };

  const ComparisonTable = ({
    columns,
    tableName,
    showSummary,
  }: {
    columns: typeof comparison.table1;
    tableName: string;
    showSummary?: boolean;
  }) => {
    const filteredColumns = getFilteredColumns(columns);

    return (
      <>
        {showSummary && (
          <div className="mb-4 flex gap-3">
            <Badge variant="outline" className="text-sm">
              Gedeeld: {comparison.summary?.shared}
            </Badge>
            <Badge variant="destructive" className="text-sm">
              Uniek:{' '}
              {tableName === table1
                ? comparison.summary?.uniqueToTable1
                : comparison.summary?.uniqueToTable2}
            </Badge>
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kolom</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredColumns.map((col) => (
              <TableRow
                key={`${tableName}-${col.kolom_kolom}`}
                className={cn(
                  'transition-colors',
                  col.exists
                    ? 'bg-green-50 dark:bg-green-950/30'
                    : 'bg-red-50 dark:bg-red-950/30'
                )}
              >
                <TableCell>
                  <code className="bg-muted px-1 py-0.5 rounded text-sm">
                    {col.kolom_kolom}
                  </code>
                </TableCell>
                <TableCell>{col.kolom_datatype}</TableCell>
                <TableCell>
                  <Badge
                    variant={col.exists ? 'default' : 'destructive'}
                    className="w-fit"
                  >
                    {col.exists ? 'Gedeeld' : 'Uniek'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </>
    );
  };

  const sortedTables = useMemo(
    () => [...imbortabellen].sort((a, b) => a.laag.localeCompare(b.laag)),
    []
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Vergelijk tabellen</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] w-[1400px] h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Tabellen vergelijken</DialogTitle>
        </DialogHeader>
        <div className="flex gap-4 mt-4">
          <Select value={table1} onValueChange={setTable1}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Selecteer tabel 1" />
            </SelectTrigger>
            <SelectContent>
              {sortedTables.map((table) => (
                <SelectItem key={table.tabel} value={table.tabel}>
                  {table.laag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={table2} onValueChange={setTable2}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Selecteer tabel 2" />
            </SelectTrigger>
            <SelectContent>
              {sortedTables.map((table) => (
                <SelectItem key={table.tabel} value={table.tabel}>
                  {table.laag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filter}
            onValueChange={(value) => setFilter(value as FilterType)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter kolommen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle kolommen</SelectItem>
              <SelectItem value="shared">Alleen gedeelde</SelectItem>
              <SelectItem value="unique">Alleen unieke</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 flex-1 min-h-0">
          <div className="overflow-auto rounded-lg border p-4">
            {table1 && tableInfo1 && (
              <>
                <h3 className="font-semibold text-lg mb-4">
                  {tableInfo1.laag}
                </h3>
                <ComparisonTable
                  columns={comparison.table1}
                  tableName={table1}
                  showSummary
                />
              </>
            )}
          </div>
          <div className="overflow-auto rounded-lg border p-4">
            {table2 && tableInfo2 && (
              <>
                <h3 className="font-semibold text-lg mb-4">
                  {tableInfo2.laag}
                </h3>
                <ComparisonTable
                  columns={comparison.table2}
                  tableName={table2}
                  showSummary
                />
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
