import { motion } from 'framer-motion';

export const SchemaRelationship = ({ path }: { path: string }) => {
  return (
    <motion.path
      d={path}
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
      className="stroke-2 stroke-blue-500"
    />
  );
};
