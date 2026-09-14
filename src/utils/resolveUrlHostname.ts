export function resolveUrlHostname(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}
