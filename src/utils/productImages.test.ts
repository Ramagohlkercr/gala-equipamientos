import { describe, it, expect, beforeEach } from 'vitest';
import { INITIAL_PRODUCTS } from '../data/mockData';
import { PRODUCT_IMAGE_MAP, CATEGORY_FALLBACK_IMAGES, getProductImageUrl, getMatchingImageByName } from './productImages';
import { storageService } from '../services/storageService';

describe('Product Images & Visual Coherence — Gala Equipamientos', () => {
  it('1. Debe mapear exactamente los 8 productos del catálogo con sus fotografías correspondientes', () => {
    const expectedMappings: Record<string, string> = {
      'prod-1': '/images/products/sillas-tiffany.jpg',
      'prod-2': '/images/products/mesas-redondas.jpg',
      'prod-3': '/images/products/mesas-rectangulares.jpg',
      'prod-4': '/images/products/living-cubos.jpg',
      'prod-5': '/images/products/sillones-chester.jpg',
      'prod-6': '/images/products/mesas-ratonas.jpg',
      'prod-7': '/images/products/arco-dorado.jpg',
      'prod-8': '/images/products/guirnalda-luces.jpg',
    };

    for (const [id, path] of Object.entries(expectedMappings)) {
      expect(PRODUCT_IMAGE_MAP[id]).toBe(path);
      const product = INITIAL_PRODUCTS.find(p => p.id === id);
      expect(product).toBeDefined();
      expect(product?.imageUrl).toBe(path);
      expect(getProductImageUrl(product)).toBe(path);
    }
  });

  it('2. Debe reconocer imágenes por nombre de mobiliario', () => {
    expect(getMatchingImageByName('Sillas Tiffany Doradas')).toBe('/images/products/sillas-tiffany.jpg');
    expect(getMatchingImageByName('Mesa Redonda 1.80')).toBe('/images/products/mesas-redondas.jpg');
    expect(getMatchingImageByName('Mesa rectangular banquete')).toBe('/images/products/mesas-rectangulares.jpg');
    expect(getMatchingImageByName('Living de cubos lounge')).toBe('/images/products/living-cubos.jpg');
    expect(getMatchingImageByName('Sillón Chester individual')).toBe('/images/products/sillones-chester.jpg');
    expect(getMatchingImageByName('Mesa ratona madera')).toBe('/images/products/mesas-ratonas.jpg');
    expect(getMatchingImageByName('Arco dorado circular')).toBe('/images/products/arco-dorado.jpg');
    expect(getMatchingImageByName('Guirnalda de luces vintage')).toBe('/images/products/guirnalda-luces.jpg');
  });

  it('3. Debe migrar URLs legadas de Unsplash a fotografías locales seguras', () => {
    const legacyProducts = [
      {
        id: 'prod-1',
        name: 'Sillas Tiffany Blancas',
        category: 'Sillas' as const,
        description: 'Silla para eventos',
        imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48',
        totalQuantity: 120,
        rentalPrice: 3500,
        active: true,
      },
      {
        id: 'custom-99',
        name: 'Mesa Ratona de diseño',
        category: 'Mesas' as const,
        description: 'Mesa baja',
        imageUrl: 'https://images.unsplash.com/photo-random',
        totalQuantity: 5,
        rentalPrice: 5000,
        active: true,
      },
    ];

    const { products, migrated } = storageService.sanitizeAndMigrateProductImages(legacyProducts);

    expect(migrated).toBe(true);
    expect(products[0].imageUrl).toBe('/images/products/sillas-tiffany.jpg');
    expect(products[1].imageUrl).toBe('/images/products/mesas-ratonas.jpg');
    // Mantiene cantidades y precios del usuario intactos
    expect(products[0].totalQuantity).toBe(120);
    expect(products[1].rentalPrice).toBe(5000);
  });

  it('4. Debe tener fallbacks elegantes para todas las categorías', () => {
    const categories = ['Sillas', 'Mesas', 'Livings', 'Sillones', 'Decoración', 'Complementos'] as const;
    for (const cat of categories) {
      expect(CATEGORY_FALLBACK_IMAGES[cat]).toBeDefined();
      expect(CATEGORY_FALLBACK_IMAGES[cat].startsWith('/images/products/')).toBe(true);
      expect(getProductImageUrl({ category: cat })).toBe(CATEGORY_FALLBACK_IMAGES[cat]);
    }
  });
});
