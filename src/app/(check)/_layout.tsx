import { TabStack } from '@/navigation/tab-stack';

/** Deep links to results get the check form as their back destination. */
export const unstable_settings = { anchor: 'index' };

export default function CheckLayout() {
  return <TabStack title="Food check" withResults />;
}
