import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
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
import { Search } from 'lucide-react';
import { useState } from 'react';

export const SchemaView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('all');

  // Get unique disciplines
  const disciplines = Array.from(
    new Set(
      imbortabellen
        .flatMap((table) =>
          Array.isArray(table.vakdiscipline)
            ? table.vakdiscipline
            : [table.vakdiscipline]
        )
        .filter(Boolean)
    )
  ).sort();

  // Filter and sort tables based on search and discipline
  const filteredTables = imbortabellen
    .filter((table) => {
      const matchesSearch =
        table.tabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        table.laag.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDiscipline =
        selectedDiscipline === 'all' ||
        (Array.isArray(table.vakdiscipline)
          ? table.vakdiscipline.includes(selectedDiscipline)
          : table.vakdiscipline === selectedDiscipline);

      return matchesSearch && matchesDiscipline;
    })
    .sort((a, b) => {
      // Handle empty laag values
      if (!a.laag) return 1;
      if (!b.laag) return -1;
      return a.laag.localeCompare(b.laag);
    });

  const getLaagTypeColor = (laagtype: string) => {
    const colors = {
      Hoofdlaag: 'bg-blue-100 text-blue-800',
      'Sublaag zonder geometrie': 'bg-purple-100 text-purple-800',
      'Sublaag met geometrie': 'bg-green-100 text-green-800',
      'Inspectielaag zonder geometrie': 'bg-orange-100 text-orange-800',
      'Inspectielaag met geometrie': 'bg-yellow-100 text-yellow-800',
      Planningslaag: 'bg-pink-100 text-pink-800',
      Referentielaag: 'bg-gray-100 text-gray-800',
    };
    return colors[laagtype] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>IMBOR Schema Explorer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Zoek in tabellen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select
              value={selectedDiscipline}
              onValueChange={setSelectedDiscipline}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter op vakgebied" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle vakgebieden</SelectItem>
                {disciplines.map((discipline) => (
                  <SelectItem key={discipline} value={discipline}>
                    {discipline}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="relative">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Laag</TableHead>
                  <TableHead className="w-[300px]">Tabel</TableHead>
                  <TableHead className="w-[200px]">Type</TableHead>
                  <TableHead className="w-[150px]">Geometrie</TableHead>
                  <TableHead className="w-[100px]">Model</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTables.map((table) => (
                  <HoverCard key={table.tabel}>
                    <HoverCardTrigger asChild>
                      <TableRow className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {table.laag}
                        </TableCell>
                        <TableCell>{table.tabel}</TableCell>
                        <TableCell>
                          <Badge className={getLaagTypeColor(table.laagtype)}>
                            {table.laagtype}
                          </Badge>
                        </TableCell>
                        <TableCell>{table.geometrietype || '-'}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              table.infomodel === 'IMBOR'
                                ? 'default'
                                : 'outline'
                            }
                          >
                            {table.infomodel}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-4">
                        {table.toelichting && (
                          <div>
                            <h4 className="font-semibold mb-1">Toelichting</h4>
                            <p className="text-sm text-muted-foreground">
                              {table.toelichting}
                            </p>
                          </div>
                        )}
                        {table.objecttypes && table.objecttypes.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">Objecttypes</h4>
                            <div className="flex flex-wrap gap-2">
                              {table.objecttypes.map((type) => (
                                <Badge key={type} variant="secondary">
                                  {type}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
