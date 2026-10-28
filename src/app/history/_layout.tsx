import { TabStack } from '@/navigation/tab-stack';

/** Deep links to a past result get the history list as their back destination. */
export const unstable_settings = { anchor: 'index' };

export default function HistoryLayout() {
  return <TabStack title="History" withResults />;
}
