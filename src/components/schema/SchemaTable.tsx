import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
import { imbortabellen } from '@/data/imbortabellen';
import { Database } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const laagTypeColors = {
  Hoofdlaag: 'bg-blue-100 text-blue-800',
  'Sublaag zonder geometrie': 'bg-purple-100 text-purple-800',
  'Sublaag met geometrie': 'bg-green-100 text-green-800',
  'Inspectielaag zonder geometrie': 'bg-orange-100 text-orange-800',
  'Inspectielaag met geometrie': 'bg-yellow-100 text-yellow-800',
  Planningslaag: 'bg-pink-100 text-pink-800',
  Referentielaag: 'bg-gray-100 text-gray-800',
} as const;

type LaagType = keyof typeof laagTypeColors;

export const SchemaTable = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const uniqueTypes = useMemo(() => {
    return Array.from(
      new Set(imbortabellen.map((table) => table.laagtype))
    ).sort();
  }, []);

  const filteredTables = useMemo(() => {
    return imbortabellen
      .filter((table) => {
        const matchesSearch =
          table.tabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
          table.laag.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType =
          selectedType === 'all' || table.laagtype === selectedType;

        return matchesSearch && matchesType;
      })
      .sort((a, b) => a.laag.localeCompare(b.laag));
  }, [searchQuery, selectedType]);

  const getLaagTypeColor = (laagtype: string) => {
    return laagTypeColors[laagtype as LaagType] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Zoek op naam of tabel..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Filter op type" />
          </SelectTrigger>
          <SelectContent className="min-w-[300px]">
            <SelectItem value="all">Alle types</SelectItem>
            {uniqueTypes.map((type) => (
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
            <TableHead>Laag</TableHead>
            <TableHead>Tabel</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Infomodel</TableHead>
            <TableHead>Objecttypes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTables.map((table) => (
            <TableRow
              key={table.tabel}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => navigate(`/schema/${table.tabel}`)}
            >
              <TableCell className="font-medium">{table.laag}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <code className="text-sm bg-muted px-1 py-0.5 rounded">
                    {table.tabel}
                  </code>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getLaagTypeColor(table.laagtype)}>
                  {table.laagtype}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={table.infomodel === 'IMBOR' ? 'default' : 'outline'}
                >
                  {table.infomodel}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {table.objecttypes?.length || 0} types
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
