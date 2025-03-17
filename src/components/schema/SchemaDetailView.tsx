import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CopyButton } from '@/components/ui/copy-button';
import { ErrorMessage } from '@/components/ui/error-message';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { imborkolommen } from '@/data/imborkolommen';
import { imbortabellen } from '@/data/imbortabellen';
import { usePageTitle } from '@/hooks/usePageTitle';
import { AlertCircle, Database } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { SchemaExport } from './SchemaExport';

type LaagType = keyof typeof laagTypeColors;

const laagTypeColors = {
  Hoofdlaag: 'bg-blue-100 text-blue-800',
  'Sublaag zonder geometrie': 'bg-purple-100 text-purple-800',
  'Sublaag met geometrie': 'bg-green-100 text-green-800',
  'Inspectielaag zonder geometrie': 'bg-orange-100 text-orange-800',
  'Inspectielaag met geometrie': 'bg-yellow-100 text-yellow-800',
  Planningslaag: 'bg-pink-100 text-pink-800',
  Referentielaag: 'bg-gray-100 text-gray-800',
} as const;

const getLaagTypeColor = (laagtype: string) => {
  return laagTypeColors[laagtype as LaagType] || 'bg-gray-100 text-gray-800';
};

interface Column {
  kolom_attribuut: string;
  kolom_kolom: string;
  kolom_datatype: string;
  kolom_definitie: string;
  kolom_uri: string;
  kolom_infomodel: string;
}

interface ColumnTableProps {
  columns: Column[];
  showCopyButton?: boolean;
}

export const ColumnTable = ({
  columns,
  showCopyButton = true,
}: ColumnTableProps) => {
  const [selectedDataType, setSelectedDataType] = useState<string>('all');

  const filteredColumns = useMemo(() => {
    if (selectedDataType === 'all') return columns;
    return columns.filter((col) => col.kolom_datatype === selectedDataType);
  }, [columns, selectedDataType]);

  const uniqueDataTypes = useMemo(
    () => Array.from(new Set(columns.map((col) => col.kolom_datatype))).sort(),
    [columns]
  );

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength)}...`;
  };

  return (
    <div>
      <div className="mb-4">
        <Select value={selectedDataType} onValueChange={setSelectedDataType}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter op datatype" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle datatypes</SelectItem>
            {uniqueDataTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Attribuut</TableHead>
            <TableHead className="w-[150px]">Kolom</TableHead>
            <TableHead className="w-[150px]">Type</TableHead>
            <TableHead>Definitie</TableHead>
            {showCopyButton && (
              <TableHead className="w-[100px]">Acties</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredColumns.map((column) => (
            <TableRow key={`${column.kolom_kolom}-${column.kolom_attribuut}`}>
              <TableCell className="font-medium">
                {column.kolom_attribuut}
              </TableCell>
              <TableCell>
                <code className="bg-muted px-1 py-0.5 rounded text-sm">
                  {column.kolom_kolom}
                </code>
              </TableCell>
              <TableCell>{column.kolom_datatype}</TableCell>
              <TableCell className="max-w-xl">
                <TooltipProvider>
                  <Tooltip delayDuration={200}>
                    <TooltipTrigger asChild>
                      <span className="cursor-help">
                        {truncateText(column.kolom_definitie)}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent
                      className="max-w-[500px] whitespace-normal break-words"
                      side="right"
                      align="start"
                    >
                      <p className="text-sm leading-relaxed">
                        {column.kolom_definitie}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              {showCopyButton && (
                <TableCell>
                  <CopyButton value={column.kolom_kolom} />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export const SchemaDetailView = () => {
  usePageTitle('Schema Details');
  const { tableName } = useParams<{ tableName: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tableInfo = useMemo(() => {
    const info = imbortabellen.find((t) => t.tabel === tableName);
    if (!info) {
      setError('Tabel niet gevonden');
      return null;
    }
    return info;
  }, [tableName]);

  const columns = useMemo(
    () => imborkolommen.filter((col) => col.tabel === tableName),
    [tableName]
  );

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 0);
  }, [tableName]);

  if (!tableName) {
    return <Navigate to="/schema" replace />;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !tableInfo) {
    return (
      <div className="container mx-auto py-8">
        <ErrorMessage
          message={error || 'Tabel niet gevonden'}
          retry={() => navigate('/schema')}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/schema" className="text-sm font-medium hover:underline">
              Schema Explorer
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage>{tableInfo.laag}</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl mb-2">
                  {tableInfo.laag}
                </CardTitle>
                <div className="flex gap-2 items-center text-sm text-muted-foreground">
                  <Database className="h-4 w-4" />
                  <span>{tableInfo.tabel}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge className={getLaagTypeColor(tableInfo.laagtype)}>
                  {tableInfo.laagtype}
                </Badge>
                <Badge
                  variant={
                    tableInfo.infomodel === 'IMBOR' ? 'default' : 'outline'
                  }
                >
                  {tableInfo.infomodel}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {tableInfo.toelichting && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Toelichting</AlertTitle>
                <AlertDescription>{tableInfo.toelichting}</AlertDescription>
              </Alert>
            )}

            {tableInfo.objecttypes && tableInfo.objecttypes.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Objecttypes</h3>
                <div className="flex flex-wrap gap-2">
                  {tableInfo.objecttypes
                    .sort((a, b) => a.localeCompare(b))
                    .map((type) => (
                      <Badge key={type} variant="secondary">
                        {type}
                      </Badge>
                    ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Kolommen</CardTitle>
            <div className="flex gap-2">
              <SchemaExport tableName={tableName} />
            </div>
          </CardHeader>
          <CardContent>
            <ColumnTable columns={columns} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
