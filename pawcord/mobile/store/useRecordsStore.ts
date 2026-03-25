import { create } from 'zustand';
import { api, CheckupRecord } from '@/services/api';

interface RecordsState {
  records: CheckupRecord[];
  isLoading: boolean;
  error: string | null;
  analysisText: string | null;
  isAnalyzing: boolean;
  fetchRecords: () => Promise<void>;
  uploadFile: (uri: string, name: string, mimeType: string) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
  fetchAnalysis: () => Promise<void>;
}

export const useRecordsStore = create<RecordsState>((set) => ({
  records: [],
  isLoading: false,
  error: null,
  analysisText: null,
  isAnalyzing: false,

  fetchRecords: async () => {
    set({ isLoading: true, error: null });
    try {
      const records = await api.getRecords();
      set({ records, isLoading: false });
    } catch (e) {
      set({ isLoading: false, error: (e as Error).message });
    }
  },

  uploadFile: async (uri, name, mimeType) => {
    set({ isLoading: true, error: null });
    try {
      await api.uploadFile(uri, name, mimeType);
      const records = await api.getRecords();
      set({ records, isLoading: false });
    } catch (e) {
      set({ isLoading: false, error: (e as Error).message });
      throw e;
    }
  },

  deleteRecord: async (id) => {
    try {
      await api.deleteRecord(id);
      set((state) => ({ records: state.records.filter((r) => r.id !== id) }));
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },

  fetchAnalysis: async () => {
    set({ isAnalyzing: true });
    try {
      const { summary } = await api.getAnalysis();
      set({ analysisText: summary, isAnalyzing: false });
    } catch (e) {
      set({ isAnalyzing: false, error: (e as Error).message });
    }
  },
}));
