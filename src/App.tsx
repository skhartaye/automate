import { useState } from 'react';
import { Board } from './components/Board';
import { OrderIntakeForm } from './components/OrderIntakeForm';
import { Activity, Plus } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
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
      
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--surface)',
            color: 'var(--text-main)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)'
          },
        }}
      />
    </div>
  );
}

export default App;
