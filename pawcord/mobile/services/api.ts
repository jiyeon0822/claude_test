const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';

export interface LabItem {
  value: number;
  unit: string;
  ref_low: number | null;
  ref_high: number | null;
}

export interface CheckupRecord {
  id: string;
  exam_date: string | null;
  hospital: string | null;
  cat_name: string | null;
  weight_kg: number | null;
  filename: string;
  file_type: string;
  cbc: { [key: string]: LabItem | null };
  chemistry: { [key: string]: LabItem | null };
}

export type MarkerStatus = 'high' | 'low' | 'normal' | 'unknown';

export function getMarkerStatus(item: LabItem | null): MarkerStatus {
  if (!item) return 'unknown';
  if (item.ref_high !== null && item.value > item.ref_high) return 'high';
  if (item.ref_low !== null && item.value < item.ref_low) return 'low';
  if (item.ref_low !== null || item.ref_high !== null) return 'normal';
  return 'unknown';
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status}: ${text}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  uploadFile: async (uri: string, name: string, mimeType: string): Promise<CheckupRecord> => {
    const form = new FormData();
    form.append('file', { uri, name, type: mimeType } as any);
    const res = await fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      body: form,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => res.statusText);
      throw new Error(`${res.status}: ${text}`);
    }
    return res.json();
  },

  getRecords: (): Promise<CheckupRecord[]> =>
    request('/api/records'),

  getRecord: (id: string): Promise<CheckupRecord> =>
    request(`/api/records/${id}`),

  deleteRecord: (id: string): Promise<void> =>
    request(`/api/records/${id}`, { method: 'DELETE' }),

  getAnalysis: (): Promise<{ summary: string }> =>
    request('/api/analyze'),
};
