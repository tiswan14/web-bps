type ApiError = {
  message?: string
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(endpoint, {
    ...options,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...options.headers,
    },
  })

  const contentType = response.headers.get('content-type')
  const isJson = contentType?.includes('application/json')

  const result = isJson
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const error = result as ApiError

    throw new Error(
      error.message || `Request gagal dengan status ${response.status}`,
    )
  }

  return result as T
}