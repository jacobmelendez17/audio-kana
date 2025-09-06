import { create } from "zustand";

import type { VocabItem } from "../lib/wanikani";
import { fetchVocabForLevels } from "../lib/wanikani";

type SelState = {
    loading: boolean;
    error: string | null;
    level: number;
    vocab: VocabItem[];
    selectedIds: Set<number>;
    setLevel: (lv: number) => void;
    loadLevel: (lv: number) => Promise<void>;
    toggle: (id: number) => void;
    selectAll: () => void;
    clearAll: () => void;
};

export const useSelection = create<SelState>((set, get) => ({
    loading: false,
    error: null,
    level: 1,
    vocab: [],
    selectedIds: new Set<number>(),

    setLevel: (lv) => set({ level: lv }),

    loadLevel: async (lv: number) => {
        set({ loading: true, error: null });
        try {
            const items = await fetchVocabForLevels([lv], 400);
            set({ vocab: items, selectedIds: new Set(items.map(i => i.id)) });
        } catch (e: any) {
            set({ error: e?.message ?? "Failed to load." });
        } finally {
            set({ loading: false });
        }
    },

    toggle: (id) => {
        const s = new Set(get().selectedIds);
        s.has(id) ? s.delete(id) : s.add(id);
        set({ selectedIds: s });
    },

    selectAll: () => set({ selectedIds: new Set(get().vocab.map(v => v.id)) }),
    clearAll: () => set({ selectedIds: new Set() }),
}));