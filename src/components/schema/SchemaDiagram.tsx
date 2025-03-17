import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { imbortabellen } from '@/data/imbortabellen';
import { useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  Position,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

interface TableNodeData {
  label: string;
  columns: string[];
}

const TableNode = ({ data }: { data: TableNodeData }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="bg-card border rounded-lg shadow-lg p-4 min-w-[200px]">
            <h3 className="font-semibold border-b pb-2 mb-2">{data.label}</h3>
            <div className="text-sm text-muted-foreground">
              {data.columns.map((col) => (
                <div key={col} className="py-1">
                  {col}
                </div>
              ))}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{data.columns.length} objecttypes</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const nodeTypes = {
  tableNode: TableNode,
};

export const SchemaDiagram = () => {
  const { nodes, edges } = useMemo(() => {
    const tableNodes: Node[] = imbortabellen.map((table, index) => ({
      id: table.tabel,
      type: 'tableNode',
      position: { x: (index % 3) * 300, y: Math.floor(index / 3) * 300 },
      data: {
        label: table.laag,
        columns: table.objecttypes || [],
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    }));

    // Add relationships based on common objecttypes
    const tableEdges: Edge[] = [];
    imbortabellen.forEach((table1) => {
      imbortabellen.forEach((table2) => {
        if (table1.tabel !== table2.tabel) {
          const commonTypes = table1.objecttypes?.filter((type) =>
            table2.objecttypes?.includes(type)
          );
          if (commonTypes?.length) {
            tableEdges.push({
              id: `${table1.tabel}-${table2.tabel}`,
              source: table1.tabel,
              target: table2.tabel,
              label: `${commonTypes.length} objecttypes`,
              data: {
                commonTypes,
              },
              animated: true,
              style: { stroke: '#94a3b8' },
            });
          }
        }
      });
    });

    return { nodes: tableNodes, edges: tableEdges };
  }, []);

  const [flowNodes, , onNodesChange] = useNodesState(nodes);
  const [flowEdges, , onEdgesChange] = useEdgesState(edges);

  return (
    <div className="h-[600px] border rounded-lg">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};
