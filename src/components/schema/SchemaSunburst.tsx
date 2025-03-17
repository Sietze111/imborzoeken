import { Sunburst } from '@nivo/sunburst';

export const SchemaSunburst = () => {
  const sunburstData = useMemo(() => {
    // Transform data into hierarchical structure
    // with size values based on number of attributes/relations
    return {
      name: 'IMBOR',
      children: [
        {
          name: 'Beheerlagen',
          children: [
            {
              name: 'Water',
              children: [
                /* ... */
              ],
              value: 20,
            },
          ],
        },
      ],
    };
  }, []);

  return (
    <div className="h-[600px] border rounded-lg">
      <Sunburst
        data={sunburstData}
        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        cornerRadius={2}
        borderColor={{ theme: 'background' }}
        colors={{ scheme: 'nivo' }}
        childColor={{
          from: 'color',
          modifiers: [['brighter', 0.1]],
        }}
        enableArcLabels={true}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: 'color',
          modifiers: [['darker', 1.4]],
        }}
      />
    </div>
  );
};
