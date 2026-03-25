import { useMemo } from 'react';
import { CheckupRecord, getMarkerStatus } from '@/services/api';

export function useAbnormalCount(record: CheckupRecord): number {
  return useMemo(() => {
    let count = 0;
    const panels = [record.cbc, record.chemistry];
    for (const panel of panels) {
      for (const item of Object.values(panel)) {
        const status = getMarkerStatus(item);
        if (status === 'high' || status === 'low') count++;
      }
    }
    return count;
  }, [record]);
}
