import React from 'react';
import { useOrderStore } from '../store/orderStore';
import type { OrderStage } from '../store/orderStore';
import { OrderCard } from './OrderCard';
import './Board.css';

const STAGES: { id: OrderStage; title: string }[] = [
  { id: 'INTAKE', title: 'Intake' },
  { id: 'PAYMENT_PENDING', title: 'Payment' },
  { id: 'INVENTORY_CHECK', title: 'Inventory' },
  { id: 'PREPARATION', title: 'Preparation' },
  { id: 'DELIVERY', title: 'Delivery' },
  { id: 'COMPLETED', title: 'Completed' },
];

export const Board: React.FC = () => {
  const orders = useOrderStore((state) => state.orders);

  return (
    <div className="board-container">
      <div className="board">
        {STAGES.map((stage) => {
          const stageOrders = orders.filter((o) => o.stage === stage.id);
          
          return (
            <div key={stage.id} className={`board-column bento-${stage.id}`}>
              <div className="board-column-header">
                <h2>{stage.title}</h2>
                <span className="order-count">{stageOrders.length}</span>
              </div>
              
              <div className="board-column-content">
                {stageOrders.length === 0 ? (
                  <div className="empty-state">No orders</div>
                ) : (
                  stageOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
