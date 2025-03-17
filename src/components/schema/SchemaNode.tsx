import { motion } from 'framer-motion';

interface SchemaNodeProps {
  data: HierarchyNode;
  isExpanded: boolean;
  isHighlighted: boolean;
  onExpand: () => void;
}

export const SchemaNode = ({
  data,
  isExpanded,
  isHighlighted,
  onExpand,
}: SchemaNodeProps) => {
  return (
    <motion.div
      layout
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        backgroundColor: isHighlighted
          ? 'var(--highlight-color)'
          : 'transparent',
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onExpand}
      className="rounded-lg border p-4 cursor-pointer"
    >
      <motion.div
        animate={{ rotate: isExpanded ? 90 : 0 }}
        className="flex items-center gap-2"
      >
        <ChevronRight className="h-4 w-4" />
        <span>{data.name}</span>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-2 pl-4 border-l"
          >
            {/* Child content */}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
