import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, ProductCategory } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { getTodayString, addDaysString } from '../../utils/dateUtils';
import { calculateProductAvailability } from '../../engine/availabilityEngine';
import { getProductImageUrl } from '../../utils/productImages';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProductFormModal } from '../../components/admin/ProductFormModal';
import {
  Plus,
  Search,
  SlidersHorizontal,
  Armchair,
  Edit2,
  Trash2,
  AlertCircle,
  Calendar,
  Check,
  EyeOff,
  Eye,
} from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const { products, reservations, deleteProduct, toggleProductActive } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Period check inside inventory
  const today = getTodayString();
  const [checkStartDate, setCheckStartDate] = useState(today);
  const [checkEndDate, setCheckEndDate] = useState(addDaysString(today, 2));
  const [enablePeriodFilter, setEnablePeriodFilter] = useState(true);

  const categories = ['todos', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'todos' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const handleDelete = (id: string, name: string) => {
    setDeleteError(null);
    if (window.confirm(`¿Estás seguro de que deseás eliminar "${name}" del inventario?`)) {
      const res = deleteProduct(id);
      if (!res.success) {
        setDeleteError(res.error || 'No se pudo eliminar el producto.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-gala-black">
              Inventario de Mobiliario
            </h1>
            <span className="text-[10px] font-medium bg-gala-accent/30 text-gala-accent-dark px-2.5 py-0.5 rounded-full border border-gala-accent/50">
              Datos de ejemplo
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gala-gray mt-1">
            Administrá el stock total, valores de alquiler y consultá la disponibilidad según fechas.
          </p>
          <p className="text-[11px] text-stone-400 italic mt-0.5">
            * Fotografías ilustrativas para demostración comercial.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<Plus size={16} />}
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
        >
          Agregar producto
        </Button>
      </div>

      {deleteError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-gala-red flex-shrink-0" />
            <span>{deleteError}</span>
          </div>
          <button
            onClick={() => setDeleteError(null)}
            className="text-xs font-semibold text-red-700 hover:text-red-900 ml-4"
          >
            Entendido
          </button>
        </div>
      )}

      {/* Date Inspection Bar */}
      <div data-tour="availability-checker" className="p-4 bg-gala-surface rounded-2xl border border-gala-border flex flex-wrap items-center justify-between gap-4 shadow-subtle">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gala-accent-dark" />
          <span className="text-xs font-semibold text-gala-black">
            Consultar disponibilidad para un período:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-gala-bg px-3 py-1.5 rounded-xl border border-gala-border text-xs">
            <span className="text-gala-gray text-[11px]">Desde:</span>
            <input
              type="date"
              value={checkStartDate}
              onChange={e => {
                const val = e.target.value;
                setCheckStartDate(val);
                if (val > checkEndDate) setCheckEndDate(val);
              }}
              className="bg-transparent text-gala-black font-medium focus:outline-none cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-gala-bg px-3 py-1.5 rounded-xl border border-gala-border text-xs">
            <span className="text-gala-gray text-[11px]">Hasta:</span>
            <input
              type="date"
              value={checkEndDate}
              min={checkStartDate}
              onChange={e => setCheckEndDate(e.target.value)}
              className="bg-transparent text-gala-black font-medium focus:outline-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-3 text-gala-gray" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar mobiliario..."
            className="w-full pl-10 pr-4 py-2 bg-gala-surface rounded-xl border border-gala-border text-xs focus:outline-none focus:border-gala-black text-gala-black placeholder:text-gala-gray"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar pb-1 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-gala-black text-gala-white font-semibold'
                  : 'bg-gala-surface text-gala-gray hover:text-gala-black border border-gala-border'
              }`}
            >
              {cat === 'todos' ? 'Todos' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div data-tour="inventory-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map(product => {
          const avail = calculateProductAvailability(
            product,
            checkStartDate,
            checkEndDate,
            reservations
          );

          return (
            <div
              key={product.id}
              className={`bg-gala-surface rounded-2xl border transition-all overflow-hidden flex flex-col justify-between shadow-subtle ${
                product.active
                  ? 'border-gala-border hover:border-gala-border-dark'
                  : 'border-dashed border-stone-300 opacity-60'
              }`}
            >
              <div>
                {/* Product Image or Placeholder */}
                <div className="relative h-44 bg-gala-bg overflow-hidden border-b border-gala-border/80">
                  <img
                    src={getProductImageUrl(product)}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/images/products/sillas-tiffany.jpg';
                    }}
                  />

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold bg-gala-black/70 backdrop-blur-xs text-white px-2.5 py-0.5 rounded-full">
                      {product.category}
                    </span>
                    {!product.active && (
                      <span className="text-[10px] font-semibold bg-stone-800 text-stone-300 px-2 py-0.5 rounded-full">
                        Inactivo
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2.5 right-2.5">
                    <span className="text-xs font-bold bg-white/90 backdrop-blur-xs text-gala-black px-2.5 py-1 rounded-lg border border-gala-border shadow-xs">
                      {formatCurrency(product.rentalPrice)} / unid.
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <h3 className="font-serif text-base font-semibold text-gala-black leading-snug">
                    {product.name}
                  </h3>

                  {product.description && (
                    <p className="text-xs text-gala-gray line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  )}

                  {/* Stock & Availability Box */}
                  <div className="mt-3 p-3 bg-gala-bg rounded-xl border border-gala-border/80 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gala-gray">Stock total propio:</span>
                      <strong className="text-gala-black font-semibold">
                        {product.totalQuantity} unidades
                      </strong>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-gala-border/60">
                      <span className="text-gala-gray">Disponible en período:</span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-serif font-bold text-sm ${
                            avail.availableQuantity > 0 ? 'text-gala-black' : 'text-gala-red'
                          }`}
                        >
                          {avail.availableQuantity}
                        </span>
                        {avail.status === 'disponible' && (
                          <Badge variant="success" size="sm">
                            Libre
                          </Badge>
                        )}
                        {avail.status === 'stock_bajo' && (
                          <Badge variant="warning" size="sm">
                            Bajo
                          </Badge>
                        )}
                        {avail.status === 'agotado' && (
                          <Badge variant="danger" size="sm">
                            Agotado
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 border-t border-gala-border/80 bg-white/40 flex items-center justify-between">
                <button
                  onClick={() => toggleProductActive(product.id)}
                  className="text-xs text-gala-gray hover:text-gala-black flex items-center gap-1"
                  title={product.active ? 'Ocultar del catálogo' : 'Activar en catálogo'}
                >
                  {product.active ? <EyeOff size={14} /> : <Eye size={14} />}
                  <span>{product.active ? 'Desactivar' : 'Activar'}</span>
                </button>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Edit2 size={13} />}
                    onClick={() => {
                      setEditingProduct(product);
                      setIsModalOpen(true);
                    }}
                  >
                    Editar
                  </Button>

                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    className="p-2 rounded-lg text-gala-gray hover:text-gala-red hover:bg-red-50 transition-colors"
                    title="Eliminar producto"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Add / Edit */}
      <ProductFormModal
        product={editingProduct}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
      />
    </div>
  );
};

