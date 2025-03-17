import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { HighlightControls } from './HighlightControls';
import { NodeDetails } from './NodeDetails';
import { SchemaGraph } from './SchemaGraph';
import { SchemaSunburst } from './SchemaSunburst';
import { SchemaTree } from './SchemaTree';
import { ViewSelector } from './ViewSelector';

interface ExplorerNode {
  id: string;
  type: 'table' | 'column' | 'relation';
  data: unknown;
  connections: string[];
}

export const SchemaExplorer = () => {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [explorerView, setExplorerView] = useState<
    'graph' | 'tree' | 'sunburst'
  >('graph');
  const [highlightMode, setHighlightMode] = useState<
    'type' | 'relations' | 'usage'
  >('type');

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <ViewSelector view={explorerView} onChange={setExplorerView} />
        <HighlightControls mode={highlightMode} onChange={setHighlightMode} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={explorerView}
          className="h-[600px] border rounded-lg overflow-hidden"
          initial="enter"
          animate="center"
          exit="exit"
          variants={slideVariants}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          {explorerView === 'graph' && <SchemaGraph />}
          {explorerView === 'tree' && <SchemaTree />}
          {explorerView === 'sunburst' && <SchemaSunburst />}
        </motion.div>
      </AnimatePresence>

      {activeNode && (
        <NodeDetails node={activeNode} onClose={() => setActiveNode(null)} />
      )}
    </div>
  );
};
