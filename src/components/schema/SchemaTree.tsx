import { Tree, TreeNode } from 'react-d3-tree';

interface HierarchyNode {
  name: string;
  children?: HierarchyNode[];
  type: 'beheerlaag' | 'objecttype' | 'type' | 'type_detail';
  attributes?: Record<string, string>;
}

export const SchemaTree = () => {
  const hierarchyData = useMemo(() => {
    // Transform IMBOR data into a tree structure
    // e.g., Beheerlaag -> Objecttype -> Type -> Type Detail
    return {
      name: 'IMBOR',
      children: [
        {
          name: 'Water',
          type: 'beheerlaag',
          children: [
            {
              name: 'Waterdeel',
              type: 'objecttype',
              children: [
                /* ... */
              ],
            },
          ],
        },
      ],
    };
  }, []);

  return (
    <div className="h-[600px] border rounded-lg">
      <Tree
        data={hierarchyData}
        orientation="vertical"
        renderCustomNodeElement={(node) => (
          <TreeNode
            node={node}
            className={cn('p-2 rounded', {
              'bg-blue-100': node.data.type === 'beheerlaag',
              'bg-green-100': node.data.type === 'objecttype',
              'bg-yellow-100': node.data.type === 'type',
            })}
          />
        )}
      />
    </div>
  );
};
