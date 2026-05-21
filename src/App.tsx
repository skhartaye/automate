import React, { useState } from 'react';
import { Board } from './components/Board';
import { OrderIntakeForm } from './components/OrderIntakeForm';
import { Activity, Plus } from 'lucide-react';
import './App.css';

function App() {
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);

  return (
    <div className="app-layout">
      {/* Sidebar/Navbar */}
      <header className="app-header">
        <div className="logo">
          <div className="logo-icon">
            <Activity size={24} color="var(--primary)" />
          </div>
          <h1>Fulfillment<span>Flow</span></h1>
        </div>
        
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => setIsIntakeOpen(true)}>
            <Plus size={18} />
            New Order
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        <Board />
      </main>

      {/* Modals */}
      {isIntakeOpen && (
        <OrderIntakeForm onClose={() => setIsIntakeOpen(false)} />
      )}
    </div>
  );
}

export default App;
