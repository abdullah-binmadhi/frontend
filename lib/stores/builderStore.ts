import { create } from 'zustand';

interface BuilderState {
    championId: number | null;
    position: string;
    coreItems: number[];
    situationalItems: number[];
    startingItems: number[];
    buildName: string;
    description: string;
    setChampion: (id: number) => void;
    setPosition: (position: string) => void;
    addCoreItem: (itemId: number) => void;
    removeCoreItem: (itemId: number) => void;
    addSituationalItem: (itemId: number) => void;
    removeSituationalItem: (itemId: number) => void;
    addStartingItem: (itemId: number) => void;
    removeStartingItem: (itemId: number) => void;
    setBuildName: (name: string) => void;
    setDescription: (desc: string) => void;
    reset: () => void;
}

const initialState = {
    championId: null as number | null,
    position: 'MIDDLE',
    coreItems: [] as number[],
    situationalItems: [] as number[],
    startingItems: [] as number[],
    buildName: '',
    description: '',
};

export const useBuilderStore = create<BuilderState>()((set) => ({
    ...initialState,
    setChampion: (id) => set({ championId: id }),
    setPosition: (position) => set({ position }),
    addCoreItem: (itemId) =>
        set((s) => ({ coreItems: s.coreItems.length < 6 ? [...s.coreItems, itemId] : s.coreItems })),
    removeCoreItem: (itemId) =>
        set((s) => ({ coreItems: s.coreItems.filter((id) => id !== itemId) })),
    addSituationalItem: (itemId) =>
        set((s) => ({ situationalItems: [...s.situationalItems, itemId] })),
    removeSituationalItem: (itemId) =>
        set((s) => ({ situationalItems: s.situationalItems.filter((id) => id !== itemId) })),
    addStartingItem: (itemId) =>
        set((s) => ({ startingItems: [...s.startingItems, itemId] })),
    removeStartingItem: (itemId) =>
        set((s) => ({ startingItems: s.startingItems.filter((id) => id !== itemId) })),
    setBuildName: (name) => set({ buildName: name }),
    setDescription: (desc) => set({ description: desc }),
    reset: () => set(initialState),
}));
