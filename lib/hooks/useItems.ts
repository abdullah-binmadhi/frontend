import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

export function useItems() {
    return useQuery({
        queryKey: ['items'],
        queryFn: api.items.getAll,
        staleTime: 5 * 60 * 1000,
    });
}

export function useItem(id: number) {
    return useQuery({
        queryKey: ['item', id],
        queryFn: () => api.items.getById(id),
        staleTime: 5 * 60 * 1000,
        enabled: !!id,
    });
}

export function useTierList(params?: Record<string, string>) {
    return useQuery({
        queryKey: ['tierList', params],
        queryFn: () => api.items.getTierList(params),
        staleTime: 5 * 60 * 1000,
    });
}
