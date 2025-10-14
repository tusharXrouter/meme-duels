import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchApi, ApiError } from '@/utils/api'

// Generic query hook
export function useApiQuery<T>(
  key: string[],
  url: string,
  options?: {
    enabled?: boolean
    staleTime?: number
    gcTime?: number
  }
) {
  return useQuery({
    queryKey: key,
    queryFn: () => fetchApi<T>(url),
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime,
    gcTime: options?.gcTime,
  })
}

// Generic mutation hook
export function useApiMutation<TData, TVariables>(
  url: string,
  options?: {
    method?: 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    onSuccess?: (data: TData) => void
    onError?: (error: ApiError) => void
  }
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variables: TVariables) =>
      fetchApi<TData>(url, {
        method: options?.method || 'POST',
        body: JSON.stringify(variables),
      }),
    onSuccess: (data) => {
      options?.onSuccess?.(data)
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries()
    },
    onError: (error: ApiError) => {
      options?.onError?.(error)
    },
  })
}

// Health check hook
export function useHealthCheck() {
  return useApiQuery<{ status: string; timestamp: string; uptime: number }>(['health'], '/api/health', {
    staleTime: 30 * 1000, // 30 seconds
  })
}
