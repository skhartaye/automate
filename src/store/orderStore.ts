import { create } from 'zustand';

export type OrderStage = 
  | 'INTAKE' 
  | 'PAYMENT_PENDING' 
  | 'INVENTORY_CHECK' 
  | 'PREPARATION' 
  | 'DELIVERY' 
  | 'COMPLETED';

export interface CatalogItem {
  id: string;
  name: string;
  price: number;
  currentStock: number;
  icon?: string;
  color?: string;
}

export interface OrderItem {
  id: string; // The catalog item ID
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  stage: OrderStage;
  items: OrderItem[];
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface OrderStore {
  catalog: CatalogItem[];
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'stage' | 'createdAt' | 'updatedAt'>) => void;
  updateOrderStage: (id: string, newStage: OrderStage) => void;
  deleteOrder: (id: string) => void;
  updateStock: (itemId: string, change: number) => void;
}

const INITIAL_CATALOG: CatalogItem[] = [
  { id: 'c1', name: 'Espresso', price: 3.50, currentStock: 100, color: '#78350f' },
  { id: 'c2', name: 'Latte', price: 4.50, currentStock: 80, color: '#b45309' },
  { id: 'c3', name: 'Cappuccino', price: 4.50, currentStock: 75, color: '#92400e' },
  { id: 'c4', name: 'Americano', price: 3.00, currentStock: 150, color: '#451a03' },
  { id: 'c5', name: 'Iced Matcha', price: 5.50, currentStock: 40, color: '#166534' },
  { id: 'c6', name: 'Croissant', price: 4.00, currentStock: 30, color: '#d97706' },
  { id: 'c7', name: 'Blueberry Muffin', price: 3.75, currentStock: 25, color: '#4338ca' },
  { id: 'c8', name: 'Avocado Toast', price: 8.50, currentStock: 15, color: '#15803d' }
];

export const useOrderStore = create<OrderStore>((set) => ({
  catalog: INITIAL_CATALOG,
  orders: [], // Empty initially (no mock data)
  
  addOrder: (orderData) => set((state) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      stage: 'INTAKE',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Deduct stock for each item immediately at POS checkout
    const updatedCatalog = state.catalog.map(item => {
      const orderedItem = orderData.items.find(i => i.id === item.id);
      if (orderedItem) {
        return { ...item, currentStock: Math.max(0, item.currentStock - orderedItem.quantity) };
      }
      return item;
    });

    return { 
      orders: [newOrder, ...state.orders],
      catalog: updatedCatalog
    };
  }),
  
  updateOrderStage: (id, newStage) => set((state) => ({
    orders: state.orders.map((order) => 
      order.id === id 
        ? { ...order, stage: newStage, updatedAt: new Date() } 
        : order
    )
  })),

  deleteOrder: (id) => set((state) => ({
    orders: state.orders.filter((order) => order.id !== id)
  })),

  updateStock: (itemId, change) => set((state) => ({
    catalog: state.catalog.map(item => 
      item.id === itemId 
        ? { ...item, currentStock: Math.max(0, item.currentStock + change) } 
        : item
    )
  }))
}));
