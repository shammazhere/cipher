/**
 * Image Cache Preloader
 * 
 * Non-technical explanation:
 * Pre-warms the browser's in-memory image cache during background idle time.
 * When the user clicks to view any event photo album or activities gallery,
 * the images are already downloaded and display instantaneously with zero lag.
 */

const PRELOAD_ASSETS = [
  '/images/cipher-logo.webp',
  '/lumiere/website_photo_1.webp',
  '/lumiere/website_photo_2.webp',
  '/lumiere/website_photo_3.webp',
  '/lumiere/website_photo_4.webp',
  '/lumiere/website_photo_5.webp',
  '/lumiere/website_photo_6.webp',
  '/lumiere/website_photo_7.webp',
  '/lumiere/website_photo_8.webp',
  '/promptops/website_photo_1.webp',
  '/promptops/website_photo_2.webp',
  '/promptops/website_photo_3.webp',
  '/promptops/website_photo_4.webp',
  '/promptops/website_photo_5.webp',
  '/promptops/website_photo_6.webp',
  '/promptops/website_photo_7.webp',
  '/promptops/website_photo_8.webp',
];

const preloadedSet = new Set<string>();

export function preloadImage(src: string): Promise<void> {
  if (preloadedSet.has(src)) return Promise.resolve();
  preloadedSet.add(src);

  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.decoding = 'async';
    img.onload = () => resolve();
    img.onerror = () => resolve();
  });
}

export function preloadImageGroup(images: string[]) {
  images.forEach(preloadImage);
}

export function warmImageCache() {
  if (typeof window === 'undefined') return;

  const loadAll = () => {
    // Rapid-fire stagger: 15ms between each to fill cache quickly without blocking main thread
    PRELOAD_ASSETS.forEach((src, idx) => {
      setTimeout(() => {
        preloadImage(src);
      }, idx * 15);
    });
  };

  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(loadAll, { timeout: 800 });
  } else {
    setTimeout(loadAll, 200);
  }
}
