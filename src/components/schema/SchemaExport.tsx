import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { imborkolommen } from '@/data/imborkolommen';
import { DownloadIcon } from 'lucide-react';

interface SchemaExportProps {
  tableName: string;
}

export const SchemaExport = ({ tableName }: SchemaExportProps) => {
  const columns = imborkolommen.filter((col) => col.tabel === tableName);

  const exportSQL = () => {
    const sql = `CREATE TABLE ${tableName} (
${columns
  .map(
    (col) =>
      `  ${col.kolom_kolom} ${col.kolom_datatype} -- ${col.kolom_definitie}`
  )
  .join(',\n')}
);`;
    downloadFile(sql, `${tableName}.sql`, 'text/plain');
  };

  const exportJSON = () => {
    const schema = {
      tableName,
      columns: columns.map((col) => ({
        name: col.kolom_kolom,
        attribute: col.kolom_attribuut,
        type: col.kolom_datatype,
        definition: col.kolom_definitie,
        infoModel: col.kolom_infomodel,
      })),
    };
    downloadFile(
      JSON.stringify(schema, null, 2),
      `${tableName}.json`,
      'application/json'
    );
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <DownloadIcon className="mr-2 h-4 w-4" />
          Exporteer
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={exportSQL}>
          Exporteer als SQL
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportJSON}>
          Exporteer als JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
