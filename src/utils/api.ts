export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function fetchApi<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new ApiError(
      `HTTP error! status: ${response.status}`,
      response.status,
      response.statusText
    )
  }

  return response.json()
}

export function createApiUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`
}

