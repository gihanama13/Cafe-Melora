import { MenuItem, DealItem } from '../data/menuData';

export interface CartCustomization {
  sweetness?: string;
  ice?: string;
  toppings?: string[];
  toppingsPrice?: number;
  notes?: string;
}

export interface CartItem {
  cartItemId: string;
  isDeal?: boolean;
  item: MenuItem | DealItem;
  quantity: number;
  unitPrice: number;
  customization?: CartCustomization;
  dealSelections?: {
    beverage1?: string;
    beverage2?: string;
    snack?: string;
  };
}

export type OrderMode = 'dine_in' | 'takeaway' | 'delivery';

export interface OrderCustomerDetails {
  mode: OrderMode;
  tableNumber: string;
  customerName: string;
  phoneNumber: string;
  deliveryAddress: string;
  specialInstructions: string;
  studentDiscountApplied: boolean;
}
