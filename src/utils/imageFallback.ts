/**
 * Image Fallback Utility
 *
 * Provides a resilient onError handler for <img> elements.
 * If a .webp image fails to load, it automatically retries with .jpg or .png.
 * If a .jpg/.png fails, it retries with .webp.
 * This handles stale localStorage caches and browser compatibility issues.
 */

/** Map of extensions to try as fallbacks, ordered by priority */
const FALLBACK_MAP: Record<string, string[]> = {
  '.jpg': ['.webp'],
  '.jpeg': ['.webp'],
  '.png': ['.webp'],
  '.webp': [],
};

/**
 * Extracts the file extension from a URL path (ignoring query params).
 */
function getExtension(src: string): string {
  const pathPart = src.split('?')[0];
  const dotIndex = pathPart.lastIndexOf('.');
  return dotIndex !== -1 ? pathPart.slice(dotIndex).toLowerCase() : '';
}

/**
 * Replaces the file extension in a URL path.
 */
function replaceExtension(src: string, oldExt: string, newExt: string): string {
  const idx = src.lastIndexOf(oldExt);
  if (idx === -1) return src;
  return src.slice(0, idx) + newExt + src.slice(idx + oldExt.length);
}

/**
 * Generic onError handler for <img> elements.
 * Automatically swaps file extensions (.webp <-> .jpg/.png) on load failure.
 *
 * Usage:
 *   <img src={url} onError={handleImageError} />
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>
): void {
  const img = event.currentTarget;
  const currentSrc = img.src;

  // Prevent infinite retry loops by tracking attempted fallbacks
  const attempted = img.dataset.fallbackAttempted || '';
  const attemptedSet = new Set(attempted.split(',').filter(Boolean));

  const ext = getExtension(currentSrc);
  const fallbacks = FALLBACK_MAP[ext] || [];

  for (const fallbackExt of fallbacks) {
    const candidateSrc = replaceExtension(currentSrc, ext, fallbackExt);
    if (!attemptedSet.has(candidateSrc)) {
      // Mark this fallback as attempted
      attemptedSet.add(candidateSrc);
      img.dataset.fallbackAttempted = Array.from(attemptedSet).join(',');
      img.src = candidateSrc;
      return;
    }
  }

  // All fallbacks exhausted -- hide the broken image icon gracefully
  img.style.visibility = 'hidden';
}
