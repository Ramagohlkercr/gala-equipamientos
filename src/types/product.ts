export type ProductCategory = 
  | 'Sillas'
  | 'Mesas'
  | 'Livings'
  | 'Sillones'
  | 'Decoración'
  | 'Complementos';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description?: string;
  imageUrl?: string;
  totalQuantity: number;
  rentalPrice: number; // in ARS ($)
  active: boolean;
  isDemoExample?: boolean;
}
