import React, { useState, useEffect } from 'react';
import { Product, ProductCategory } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';

interface ProductFormModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: ProductCategory[] = [
  'Sillas',
  'Mesas',
  'Livings',
  'Sillones',
  'Decoración',
  'Complementos',
];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { createProduct, updateProduct } = useApp();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Sillas');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [totalQuantity, setTotalQuantity] = useState<number>(50);
  const [rentalPrice, setRentalPrice] = useState<number>(3500);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategory(product.category);
      setDescription(product.description || '');
      setImageUrl(product.imageUrl || '');
      setTotalQuantity(product.totalQuantity);
      setRentalPrice(product.rentalPrice);
      setActive(product.active);
    } else {
      setName('');
      setCategory('Sillas');
      setDescription('');
      setImageUrl('');
      setTotalQuantity(50);
      setRentalPrice(3500);
      setActive(true);
    }
  }, [product, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (product) {
      updateProduct(product.id, {
        name,
        category,
        description,
        imageUrl: imageUrl || undefined,
        totalQuantity,
        rentalPrice,
        active,
      });
    } else {
      createProduct({
        name,
        category,
        description,
        imageUrl: imageUrl || undefined,
        totalQuantity,
        rentalPrice,
        active,
        isDemoExample: false,
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'Editar producto' : 'Agregar nuevo producto al mobiliario'}
      subtitle="Definí las características, rubro y cantidad de unidades reales disponibles."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Name */}
        <div>
          <label className="block font-semibold text-gala-black mb-1">Nombre del producto *</label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ej. Sillas Tiffany Blancas"
            className="w-full px-3 py-2 bg-white rounded-xl border border-gala-border focus:outline-none focus:border-gala-black font-medium"
          />
        </div>

        {/* Category & Status */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-gala-black mb-1">Categoría / Rubro *</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as ProductCategory)}
              className="w-full px-3 py-2 bg-white rounded-xl border border-gala-border focus:outline-none focus:border-gala-black"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gala-black mb-1">Estado de catálogo</label>
            <select
              value={active ? 'true' : 'false'}
              onChange={e => setActive(e.target.value === 'true')}
              className="w-full px-3 py-2 bg-white rounded-xl border border-gala-border focus:outline-none focus:border-gala-black"
            >
              <option value="true">Activo (Visible)</option>
              <option value="false">Inactivo (Oculto)</option>
            </select>
          </div>
        </div>

        {/* Quantities & Rental Price */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-gala-black mb-1">
              Stock total de unidades *
            </label>
            <input
              type="number"
              required
              min="1"
              value={totalQuantity}
              onChange={e => setTotalQuantity(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-white rounded-xl border border-gala-border focus:outline-none focus:border-gala-black font-semibold"
            />
          </div>

          <div>
            <label className="block font-semibold text-gala-black mb-1">
              Precio alquiler sugerido (ARS)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gala-gray font-serif font-bold text-sm">$</span>
              <input
                type="number"
                min="0"
                step="any"
                value={rentalPrice}
                onChange={e => setRentalPrice(parseFloat(e.target.value) || 0)}
                className="w-full pl-8 pr-3 py-2 bg-white rounded-xl border border-gala-border focus:outline-none focus:border-gala-black font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="block font-semibold text-gala-black mb-1">URL de fotografía (opcional)</label>
          <input
            type="url"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2 bg-white rounded-xl border border-gala-border focus:outline-none focus:border-gala-black"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold text-gala-black mb-1">Descripción y detalles</label>
          <textarea
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Medidas, terminación, color, tapizado, capacidad recomendada..."
            className="w-full px-3 py-2 bg-white rounded-xl border border-gala-border focus:outline-none focus:border-gala-black resize-none"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-gala-border/80">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" size="sm" type="submit">
            {product ? 'Guardar cambios' : 'Agregar producto'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
