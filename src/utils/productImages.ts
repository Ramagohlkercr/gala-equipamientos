import { ProductCategory } from '../types';

/**
 * Mapping of stable product IDs to their verified local photographic assets.
 * Stored in /public/images/products/ for maximum stability, fast loading, and zero external dependency.
 */
export const PRODUCT_IMAGE_MAP: Record<string, string> = {
  'prod-1': '/images/products/sillas-tiffany.jpg',
  'prod-2': '/images/products/mesas-redondas.jpg',
  'prod-3': '/images/products/mesas-rectangulares.jpg',
  'prod-4': '/images/products/living-cubos.jpg',
  'prod-5': '/images/products/sillones-chester.jpg',
  'prod-6': '/images/products/mesas-ratonas.jpg',
  'prod-7': '/images/products/arco-dorado.jpg',
  'prod-8': '/images/products/guirnalda-luces.jpg',
};

/**
 * Elegant fallbacks by category when a new custom product is added without a custom image.
 */
export const CATEGORY_FALLBACK_IMAGES: Record<ProductCategory, string> = {
  Sillas: '/images/products/sillas-tiffany.jpg',
  Mesas: '/images/products/mesas-redondas.jpg',
  Livings: '/images/products/living-cubos.jpg',
  Sillones: '/images/products/sillones-chester.jpg',
  Decoración: '/images/products/arco-dorado.jpg',
  Complementos: '/images/products/guirnalda-luces.jpg',
};

/**
 * Helper to match product name to known local photographic assets
 */
export function getMatchingImageByName(name?: string): string | null {
  if (!name) return null;
  const n = name.toLowerCase();
  if (n.includes('tiffany')) return '/images/products/sillas-tiffany.jpg';
  if (n.includes('redonda')) return '/images/products/mesas-redondas.jpg';
  if (n.includes('rectangular') || n.includes('tablon') || n.includes('tablón')) {
    return '/images/products/mesas-rectangulares.jpg';
  }
  if (n.includes('cubo') || n.includes('living')) return '/images/products/living-cubos.jpg';
  if (n.includes('chester') || n.includes('sillon') || n.includes('sillón')) {
    return '/images/products/sillones-chester.jpg';
  }
  if (n.includes('ratona')) return '/images/products/mesas-ratonas.jpg';
  if (n.includes('arco') || n.includes('dorado')) return '/images/products/arco-dorado.jpg';
  if (n.includes('guirnalda') || n.includes('luces')) return '/images/products/guirnalda-luces.jpg';
  return null;
}

/**
 * Central resolver for product imagery.
 * 1. Checks stable product ID mapping.
 * 2. Checks name matching for standard Gala catalog products.
 * 3. Checks explicit product.imageUrl if it is a verified local asset.
 * 4. Falls back to category image.
 */
export function getProductImageUrl(product?: {
  id?: string;
  name?: string;
  category?: ProductCategory;
  imageUrl?: string;
}): string {
  if (!product) return '/images/products/sillas-tiffany.jpg';

  // 1. If mapped by stable demo ID, use official verified local image
  if (product.id && PRODUCT_IMAGE_MAP[product.id]) {
    return PRODUCT_IMAGE_MAP[product.id];
  }

  // 2. Check by name pattern (e.g. if user duplicated or re-added standard item)
  const byName = getMatchingImageByName(product.name);
  if (byName) {
    return byName;
  }

  // 3. If explicit custom imageUrl exists and is NOT a legacy external Unsplash URL
  if (product.imageUrl && product.imageUrl.startsWith('/images/products/')) {
    return product.imageUrl;
  }

  // 4. Fallback by category
  if (product.category && CATEGORY_FALLBACK_IMAGES[product.category]) {
    return CATEGORY_FALLBACK_IMAGES[product.category];
  }

  return '/images/products/sillas-tiffany.jpg';
}


