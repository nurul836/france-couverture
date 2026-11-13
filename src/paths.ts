// Vite resolves BASE_URL for each deployment; do not hardcode a hosting provider.
export const routerBase = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";
export function assetPath(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\/+/, "");
}
