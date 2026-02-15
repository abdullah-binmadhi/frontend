import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

export function useChampions() {
    return useQuery({
        queryKey: ['champions'],
        queryFn: api.champions.getAll,
        staleTime: 5 * 60 * 1000,
    });
}

export function useChampion(id: number) {
    return useQuery({
        queryKey: ['champion', id],
        queryFn: () => api.champions.getById(id),
        staleTime: 5 * 60 * 1000,
        enabled: !!id,
    });
}
