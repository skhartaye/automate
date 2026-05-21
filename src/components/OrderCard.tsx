import React from 'react';
import { useOrderStore } from '../store/orderStore';
import type { Order, OrderStage } from '../store/orderStore';
import { Clock, Package, CreditCard, Box, Truck, CheckCircle, ArrowRight } from 'lucide-react';
import './OrderCard.css';

interface OrderCardProps {
  order: Order;
}

const STAGE_CONFIG: Record<OrderStage, { icon: React.ReactNode, label: string, color: string, nextAction: string, nextStage: OrderStage | null }> = {
  INTAKE: {
    icon: <Package size={16} />,
    label: 'Intake',
    color: 'var(--primary)',
    nextAction: 'Verify Payment',
    nextStage: 'PAYMENT_PENDING'
  },
  PAYMENT_PENDING: {
    icon: <CreditCard size={16} />,
    label: 'Awaiting Payment',
    color: 'var(--warning)',
    nextAction: 'Check Inventory',
    nextStage: 'INVENTORY_CHECK'
  },
  INVENTORY_CHECK: {
    icon: <Box size={16} />,
    label: 'Inventory Check',
    color: 'var(--info)',
    nextAction: 'Prepare Order',
    nextStage: 'PREPARATION'
  },
  PREPARATION: {
    icon: <Clock size={16} />,
    label: 'Preparing',
    color: 'var(--primary-hover)',
    nextAction: 'Send for Delivery',
    nextStage: 'DELIVERY'
  },
  DELIVERY: {
    icon: <Truck size={16} />,
    label: 'Out for Delivery',
    color: 'var(--success)',
    nextAction: 'Mark Fulfilled',
    nextStage: 'COMPLETED'
  },
  COMPLETED: {
    icon: <CheckCircle size={16} />,
    label: 'Completed',
    color: 'var(--text-muted)',
    nextAction: '',
    nextStage: null
  }
};

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const updateOrderStage = useOrderStore((state) => state.updateOrderStage);
  const config = STAGE_CONFIG[order.stage];

  const handleNextAction = () => {
    if (config.nextStage) {
      updateOrderStage(order.id, config.nextStage);
    }
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
  }).format(new Date(order.createdAt));

  return (
    <div className="order-card animate-fade-in">
      <div className="order-card-header">
        <span className="order-id">{order.id}</span>
        <span className="order-date">{formattedDate}</span>
      </div>
      
      <div className="order-card-body">
        <h3 className="customer-name">{order.customerName}</h3>
        
        <div className="order-items-list">
          {order.items.map(item => (
            <div key={item.id} className="order-item-line">
              <span className="order-item-qty">{item.quantity}x</span>
              <span className="order-item-name">{item.name}</span>
            </div>
          ))}
        </div>

        <p className="order-items-summary">
          Total: ${order.totalAmount.toFixed(2)}
        </p>
      </div>

      <div className="order-card-footer">
        <div 
          className="stage-badge" 
          style={{ '--badge-color': config.color } as React.CSSProperties}
        >
          {config.icon}
          <span>{config.label}</span>
        </div>
        
        {config.nextStage && (
          <button className="btn btn-primary btn-sm next-action-btn" onClick={handleNextAction}>
            {config.nextAction}
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
};
