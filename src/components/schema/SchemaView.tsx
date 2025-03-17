import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { imbortabellen } from '@/data/imbortabellen';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SchemaCompare } from './SchemaCompare';
import { SchemaDiagram } from './SchemaDiagram';
import { SchemaTable } from './SchemaTable';

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

export const SchemaView = () => {
  usePageTitle('Schema Explorer');

  const navigate = useNavigate();
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
    return laagTypeColors[laagtype as LaagType] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Schema Explorer</h1>
        <SchemaCompare />
      </div>

      <Tabs defaultValue="tables">
        <TabsList>
          <TabsTrigger value="tables">Tabellen</TabsTrigger>
          <TabsTrigger value="diagram">Diagram</TabsTrigger>
        </TabsList>
        <TabsContent value="tables" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>IMBOR Tabellen</CardTitle>
            </CardHeader>
            <CardContent>
              <SchemaTable />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="diagram" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Relatie Diagram</CardTitle>
            </CardHeader>
            <CardContent>
              <SchemaDiagram />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
