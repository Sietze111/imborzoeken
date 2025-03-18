import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SchemaCompare } from './SchemaCompare';
import { SchemaDiagram } from './SchemaDiagram';
import { SchemaPasswordDialog } from './SchemaPasswordDialog';
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authenticated = sessionStorage.getItem('schema-authenticated');
    if (authenticated === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePasswordSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <div className="container mx-auto py-8">
      {!isAuthenticated ? (
        <SchemaPasswordDialog onCorrectPassword={handlePasswordSuccess} />
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Schema Explorer</h1>
            <SchemaCompare />
          </div>

          <Tabs defaultValue="tables">
            <TabsList className="mb-4">
              <TabsTrigger value="tables">Tabellen</TabsTrigger>
              <TabsTrigger value="diagram">Diagram</TabsTrigger>
              <TabsTrigger value="compare">Vergelijken</TabsTrigger>
            </TabsList>
            <TabsContent value="tables">
              <Card>
                <CardHeader>
                  <CardTitle>IMBOR Tabellen</CardTitle>
                </CardHeader>
                <CardContent>
                  <SchemaTable />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="diagram">
              <Card>
                <CardHeader>
                  <CardTitle>Relatie Diagram</CardTitle>
                </CardHeader>
                <CardContent>
                  <SchemaDiagram />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="compare">
              <SchemaCompare />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};
