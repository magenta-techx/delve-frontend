/**
 * Ensures a URL starts with http:// or https://.
 * If it doesn't and is not empty, prepends https://.
 * @param url The URL string to check.
 * @returns The formatted URL string.
 */
export const ensureProtocol = (url: string): string => {
  if (!url) return url;
  
  const trimmedUrl = url.trim();
  if (trimmedUrl === '') return '';

  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    return trimmedUrl;
  }
  
  return `https://${trimmedUrl}`;
};
