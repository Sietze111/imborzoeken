import { AnimatePresence, motion } from 'framer-motion';

export const SearchResults = ({ results }: { results: SearchItem[] }) => {
  return (
    <div className="space-y-2">
      <AnimatePresence>
        {results.map((result, index) => (
          <motion.div
            key={result.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.05 }} // Stagger effect
            className="p-4 border rounded-lg"
          >
            {/* Result content */}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
