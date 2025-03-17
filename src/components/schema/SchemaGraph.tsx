import { ForceGraph2D } from 'react-force-graph';

interface GraphNode {
  id: string;
  name: string;
  type: string;
  group: string;
  size: number;
}

interface GraphLink {
  source: string;
  target: string;
  type: string;
  strength: number;
}

export const SchemaGraph = () => {
  const graphData = useMemo(() => {
    return {
      nodes: imbortabellen.map((table) => ({
        id: table.tabel,
        name: table.laag,
        type: table.laagtype,
        group: table.infomodel,
        size: table.objecttypes?.length || 1,
      })),
      links: generateRelationships(), // Generate links based on common properties
    };
  }, []);

  return (
    <div className="h-[600px] border rounded-lg">
      <ForceGraph2D
        graphData={graphData}
        nodeAutoColorBy="group"
        nodeRelSize={6}
        nodeLabel={(node) => `${node.name} (${node.type})`}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.005}
        onNodeClick={handleNodeClick}
        cooldownTicks={50}
      />
    </div>
  );
};
