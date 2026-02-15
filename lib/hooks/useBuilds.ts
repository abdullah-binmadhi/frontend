import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

export function useBuilds() {
    return useQuery({
        queryKey: ['builds'],
        queryFn: api.builds.getAll,
        staleTime: 5 * 60 * 1000,
    });
}

export function useBuild(id: string) {
    return useQuery({
        queryKey: ['build', id],
        queryFn: () => api.builds.getById(id),
        staleTime: 5 * 60 * 1000,
        enabled: !!id,
    });
}
