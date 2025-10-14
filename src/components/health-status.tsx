'use client'

import { useHealthCheck } from '@/hooks/use-api'
import { formatDateTime } from '@/utils/format'

export function HealthStatus() {
  const { data, isLoading, error, refetch } = useHealthCheck()

  if (isLoading) {
    return (
      <div className="p-4 border rounded-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
        <h3 className="text-red-800 font-medium">Error</h3>
        <p className="text-red-600 text-sm">
          Failed to fetch health status: {error.message}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-2 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 border rounded-lg bg-green-50 border-green-200">
      <h3 className="text-green-800 font-medium">System Status</h3>
      <div className="text-sm text-green-700 space-y-1">
        <p>Status: {data?.status}</p>
        <p>Last Check: {data?.timestamp ? formatDateTime(data.timestamp) : 'N/A'}</p>
        <p>Uptime: {data?.uptime ? `${Math.floor(data.uptime / 60)} minutes` : 'N/A'}</p>
      </div>
      <button
        onClick={() => refetch()}
        className="mt-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
      >
        Refresh
      </button>
    </div>
  )
}

