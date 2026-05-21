import React, { useState, useMemo } from 'react';
import { useOrderStore } from '../store/orderStore';
import type { CatalogItem } from '../store/orderStore';
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import './OrderIntakeForm.css';

interface OrderIntakeFormProps {
  onClose: () => void;
}

interface CartItem extends CatalogItem {
  quantity: number;
}

export const OrderIntakeForm: React.FC<OrderIntakeFormProps> = ({ onClose }) => {
  const { catalog, addOrder } = useOrderStore();
  const [customerName, setCustomerName] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CatalogItem) => {
    if (item.currentStock <= 0) return;
    
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        if (existing.quantity >= item.currentStock) return prev; // Cannot exceed stock
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === itemId) {
        const newQuantity = item.quantity + delta;
        if (newQuantity <= 0) return item; // Handled by remove button
        if (newQuantity > item.currentStock) return item; // Cannot exceed stock
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const totalAmount = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    addOrder({
      customerName: customerName || 'Walk-in Customer',
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      totalAmount
    });

    onClose();
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="pos-modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Left Pane: Catalog Grid */}
        <div className="pos-catalog">
          <div className="pos-header">
            <h2>Select Items</h2>
          </div>
          <div className="catalog-grid">
            {catalog.map(item => {
              const cartItem = cart.find(c => c.id === item.id);
              const remainingStock = item.currentStock - (cartItem?.quantity || 0);
              const isOutOfStock = remainingStock <= 0;

              return (
                <button
                  key={item.id}
                  className={`catalog-item-btn ${isOutOfStock ? 'out-of-stock' : ''}`}
                  onClick={() => addToCart(item)}
                  disabled={isOutOfStock}
                  style={{ '--item-color': item.color || 'var(--primary)' } as React.CSSProperties}
                >
                  <div className="item-name">{item.name}</div>
                  <div className="item-price">${item.price.toFixed(2)}</div>
                  <div className="item-stock">{remainingStock} left</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Ticket / Cart */}
        <div className="pos-ticket">
          <div className="pos-header">
            <div className="ticket-title">
              <ShoppingBag size={20} />
              <h2>Current Order</h2>
            </div>
            <button className="btn-icon" onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          <div className="ticket-customer">
            <input 
              type="text" 
              className="form-input" 
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer Name (Optional)"
            />
          </div>

          <div className="ticket-items">
            {cart.length === 0 ? (
              <div className="empty-cart">Cart is empty</div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="ticket-item">
                  <div className="ticket-item-info">
                    <span className="ticket-item-name">{item.name}</span>
                    <span className="ticket-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                  <div className="ticket-item-controls">
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)} disabled={item.quantity <= 1}>
                      <Minus size={14} />
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)} disabled={item.quantity >= item.currentStock}>
                      <Plus size={14} />
                    </button>
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="ticket-footer">
            <div className="ticket-total">
              <span>Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <button 
              className="btn btn-primary pos-checkout-btn" 
              onClick={handleSubmit}
              disabled={cart.length === 0}
            >
              Submit Order
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
