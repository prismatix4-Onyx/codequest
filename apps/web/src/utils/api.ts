// Shared resilient API URL Builder for CODEQUEST
export function getApiEndpoint(path: string): string {
  const raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
  const base = raw.replace(/\/+$/, '');
  const hasApiV1 = base.endsWith('/api/v1');
  const root = hasApiV1 ? base : `${base}/api/v1`;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${root}${cleanPath}`;
}
