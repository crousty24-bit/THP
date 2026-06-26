const DEFAULT_API_BASE_URL = 'https://api.example.com'

export const env = {
  apiBaseUrl: String(import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(
    /\/$/,
    '',
  ),
}
