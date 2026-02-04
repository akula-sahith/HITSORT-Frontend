import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, LogOut, CreditCard, TrendingUp, DollarSign, User } from 'lucide-react';

// ============================================================================
// API Configuration & Utilities
// ============================================================================

const API_BASE_URL = 'https://hitsort-backend.onrender.com';

const api = {
  login: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },
  
  getCards: async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/cards`, {
      headers: { 'Authorization': token }
    });
    if (!response.ok) throw new Error('Failed to fetch cards');
    return response.json();
  },
  
  updateCard: async (token, data) => {
    const response = await fetch(`${API_BASE_URL}/api/cards/update`, {
      method: 'PUT',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update card');
    return response.json();
  }
};

// ============================================================================
// Toast Notification Component
// ============================================================================

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast" style={{ animationDelay: '0s' }}>
      {type === 'success' ? (
        <CheckCircle2 size={20} style={{ color: '#10b981', flexShrink: 0 }} />
      ) : (
        <AlertCircle size={20} style={{ color: '#ef4444', flexShrink: 0 }} />
      )}
      <span>{message}</span>
      <button onClick={onClose} className="toast-close">×</button>
    </div>
  );
};

// ============================================================================
// Login Page Component
// ============================================================================

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.login(username, password);
      localStorage.setItem('authToken', response.token);
      onLogin(response.token);
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <div className="login-icon">
            <CreditCard size={32} />
          </div>
          <h1>HitSort Admin</h1>
          <p>Card Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <div className="login-decoration"></div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Update Card Page Component
// ============================================================================

const UpdateCardPage = ({ token, onShowToast }) => {
  const [formData, setFormData] = useState({
    cardId: '',
    sellerName: '',
    numberOfGames: '',
    amount: '',
    paymentType: ''
  });
  const [loading, setLoading] = useState(false);

  const sellerNames = ['Sahith', 'Pandu', 'Bharath', 'Manoj', 'Anand','Ratnakar','Yagnesh','Pavan'];
  const gameOptions = [1, 2 ];
  const amountOptions = [0, 39, 49, 59, 79 , 40 , 50 , 60 , 80];
  const paymentTypes = ['UPI', 'CASH', 'REFERRED'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        cardId: `HS${formData.cardId.padStart(2, '0')}`,
        sellerName: formData.sellerName,
        numberOfGames: parseInt(formData.numberOfGames),
        amount: parseInt(formData.amount),
        paymentType: formData.paymentType
      };

      await api.updateCard(token, payload);
      onShowToast('Card updated successfully!', 'success');
      
      // Reset form
      setFormData({
        cardId: '',
        sellerName: '',
        numberOfGames: '',
        amount: '',
        paymentType: ''
      });
    } catch (err) {
      onShowToast('Failed to update card. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Update Card</h1>
          <p>Manage card transactions and seller information</p>
        </div>
      </div>

      <div className="card-form-container">
        <form onSubmit={handleSubmit} className="card-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="sellerName">Seller Name</label>
              <select
                id="sellerName"
                value={formData.sellerName}
                onChange={(e) => setFormData({ ...formData, sellerName: e.target.value })}
                required
                disabled={loading}
              >
                <option value="">Select seller</option>
                {sellerNames.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="cardId">Card Number</label>
              <div className="card-id-input">
                <span className="card-prefix">HS</span>
                <input
                  id="cardId"
                  type="text"
                  value={formData.cardId}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 4) {
                      setFormData({ ...formData, cardId: value });
                    }
                  }}
                  placeholder="01"
                  required
                  disabled={loading}
                  maxLength={4}
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="numberOfGames">Number of Games</label>
              <select
                id="numberOfGames"
                value={formData.numberOfGames}
                onChange={(e) => setFormData({ ...formData, numberOfGames: e.target.value })}
                required
                disabled={loading}
              >
                <option value="">Select games</option>
                {gameOptions.map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'game' : 'games'}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="amount">Amount Paid</label>
              <select
                id="amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                disabled={loading}
              >
                <option value="">Select amount</option>
                {amountOptions.map(amt => (
                  <option key={amt} value={amt}>₹{amt}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="paymentType">Payment Type</label>
              <select
                id="paymentType"
                value={formData.paymentType}
                onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
                required
                disabled={loading}
              >
                <option value="">Select type</option>
                {paymentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// Dashboard Page Component
// ============================================================================

const DashboardPage = ({ token, onShowToast }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCards: 0,
    totalRevenue: 0,
    totalGames: 0
  });

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const data = await api.getCards(token);
      setCards(data);
      
      // Calculate stats
      const totalRevenue = data.reduce((sum, card) => sum + (card.amount || 0), 0);
const totalGames = data.reduce((sum, card) => sum + (card.numberOfGames || 0), 0);

setStats({
  totalCards: data.length,
  totalRevenue,
  totalGames
});

    } catch (err) {
      onShowToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of all card transactions</p>
        </div>
        <button onClick={fetchCards} className="btn-secondary" disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <CreditCard size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Cards</p>
            <p className="stat-value">{stats.totalCards}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Revenue</p>
            <p className="stat-value">₹{stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Games</p>
            <p className="stat-value">{stats.totalGames}</p>
          </div>
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading cards...</p>
          </div>
        ) : cards.length === 0 ? (
          <div className="empty-state">
            <CreditCard size={48} />
            <h3>No cards found</h3>
            <p>Start by updating your first card</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Card ID</th>
                  <th>Seller Name</th>
                  <th>Games</th>
                  <th>Amount</th>
                  <th>Payment Type</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {cards.map((card, index) => (
                  <tr key={card.cardId || index}>
                    <td>
                      <span className="card-id-badge">{card.cardId}</span>
                    </td>
                    <td>
                      <div className="seller-cell">
                        <User size={16} />
                        <span>{card.sellerName}</span>
                      </div>
                    </td>
                    <td>{card.numberOfGames}</td>
                    <td>
                      <span className="amount-cell">₹{card.amount}</span>
                    </td>
                    <td>
                      <span className={`payment-badge ${card.paymentType?.toLowerCase()}`}>
                        {card.paymentType}
                      </span>
                    </td>
                    <td className="date-cell">{formatDate(card.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// Main App Component
// ============================================================================

const App = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [token, setToken] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      setToken(savedToken);
      setCurrentPage('dashboard');
    }
  }, []);

  const handleLogin = (newToken) => {
    setToken(newToken);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setCurrentPage('login');
  };

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  if (!token) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <style>{styles}</style>
      </>
    );
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-brand">
          <CreditCard size={24} />
          <span>HitSort Admin</span>
        </div>
        <div className="navbar-menu">
          <button
            className={currentPage === 'dashboard' ? 'nav-link active' : 'nav-link'}
            onClick={() => setCurrentPage('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={currentPage === 'update' ? 'nav-link active' : 'nav-link'}
            onClick={() => setCurrentPage('update')}
          >
            Update Card
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <main className="main-content">
        {currentPage === 'dashboard' && (
          <DashboardPage token={token} onShowToast={showToast} />
        )}
        {currentPage === 'update' && (
          <UpdateCardPage token={token} onShowToast={showToast} />
        )}
      </main>

      {toast && (
        <div className="toast-container">
          <Toast message={toast.message} type={toast.type} onClose={closeToast} />
        </div>
      )}

      <style>{styles}</style>
    </div>
  );
};

// ============================================================================
// Styles
// ============================================================================

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Onest:wght@300;400;500;600;700&family=Lexend:wght@300;400;500;600&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    --bg-primary: #0a0a0f;
    --bg-secondary: #13131a;
    --bg-tertiary: #1a1a24;
    --text-primary: #f5f5f7;
    --text-secondary: #a1a1aa;
    --text-muted: #71717a;
    --border: #27272f;
    --accent: #6366f1;
    --accent-hover: #4f46e5;
    --success: #10b981;
    --error: #ef4444;
    --shadow: rgba(0, 0, 0, 0.4);
  }

  body {
    font-family: 'Onest', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--bg-primary);
    color: var(--text-primary);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* ========== Login Page ========== */
  .login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: 
      radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
      var(--bg-primary);
  }

  .login-box {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 48px;
    width: 100%;
    max-width: 440px;
    box-shadow: 0 20px 60px var(--shadow);
    animation: fadeInUp 0.6s ease-out;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .login-header {
    text-align: center;
    margin-bottom: 40px;
  }

  .login-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 20px;
    background: linear-gradient(135deg, var(--accent) 0%, #8b5cf6 100%);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    animation: float 3s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  .login-header h1 {
    font-family: 'Lexend', sans-serif;
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 8px;
    background: linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .login-header p {
    color: var(--text-secondary);
    font-size: 14px;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .form-group label {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-secondary);
  }

  .form-group input,
  .form-group select {
    padding: 14px 16px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border);
    border-radius: 12px;
    color: var(--text-primary);
    font-size: 15px;
    font-family: inherit;
    transition: all 0.2s ease;
  }

  .form-group input:focus,
  .form-group select:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  .form-group input:disabled,
  .form-group select:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .error-message {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 10px;
    color: var(--error);
    font-size: 14px;
    animation: shake 0.4s ease;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }

  .btn-primary {
    padding: 14px 24px;
    background: linear-gradient(135deg, var(--accent) 0%, #8b5cf6 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: inherit;
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
  }

  .btn-primary:active:not(:disabled) {
    transform: translateY(0);
  }

  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .login-footer {
    margin-top: 32px;
    padding-top: 32px;
    border-top: 1px solid var(--border);
  }

  .login-decoration {
    height: 4px;
    background: linear-gradient(90deg, var(--accent), #8b5cf6, var(--accent));
    border-radius: 4px;
    animation: shimmer 2s ease-in-out infinite;
    background-size: 200% 100%;
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  /* ========== App Layout ========== */
  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .navbar {
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border);
    padding: 0 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 72px;
    position: sticky;
    top: 0;
    z-index: 100;
    backdrop-filter: blur(10px);
  }

  .navbar-brand {
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: 'Lexend', sans-serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .navbar-brand svg {
    color: var(--accent);
  }

  .navbar-menu {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .nav-link {
    padding: 10px 20px;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    border-radius: 10px;
    transition: all 0.2s ease;
    font-family: inherit;
  }

  .nav-link:hover {
    color: var(--text-primary);
    background: var(--bg-tertiary);
  }

  .nav-link.active {
    color: var(--accent);
    background: rgba(99, 102, 241, 0.1);
  }

  .btn-logout {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text-secondary);
    border-radius: 10px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-left: 16px;
    font-family: inherit;
  }

  .btn-logout:hover {
    border-color: var(--error);
    color: var(--error);
    background: rgba(239, 68, 68, 0.05);
  }

  .main-content {
    flex: 1;
    padding: 32px;
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;
  }

  /* ========== Page Header ========== */
  .page-container {
    animation: fadeIn 0.4s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 32px;
  }

  .page-header h1 {
    font-family: 'Lexend', sans-serif;
    font-size: 32px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .page-header p {
    color: var(--text-secondary);
    font-size: 15px;
  }

  .btn-secondary {
    padding: 12px 24px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border);
    color: var(--text-primary);
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: inherit;
  }

  .btn-secondary:hover:not(:disabled) {
    background: var(--bg-secondary);
    border-color: var(--accent);
  }

  .btn-secondary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* ========== Stats Grid ========== */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
    margin-bottom: 32px;
  }

  .stat-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 20px;
    transition: all 0.3s ease;
    animation: slideUp 0.5s ease;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px var(--shadow);
  }

  .stat-icon {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;
  }

  .stat-content {
    flex: 1;
  }

  .stat-label {
    font-size: 14px;
    color: var(--text-secondary);
    margin-bottom: 4px;
  }

  .stat-value {
    font-size: 28px;
    font-weight: 700;
    font-family: 'Lexend', sans-serif;
    color: var(--text-primary);
  }

  /* ========== Card Form ========== */
  .card-form-container {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 32px;
    animation: slideUp 0.5s ease;
  }

  .card-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .form-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
  }

  .card-id-input {
    position: relative;
    display: flex;
    align-items: center;
  }

  .card-prefix {
    position: absolute;
    left: 16px;
    font-weight: 600;
    color: var(--accent);
    font-size: 15px;
    pointer-events: none;
  }

  .card-id-input input {
    padding-left: 48px !important;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    padding-top: 8px;
  }

  /* ========== Table ========== */
  .table-container {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
    animation: slideUp 0.5s ease;
  }

  .table-wrapper {
    overflow-x: auto;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
  }

  .data-table thead {
    background: var(--bg-tertiary);
    border-bottom: 1px solid var(--border);
  }

  .data-table th {
    padding: 16px 20px;
    text-align: left;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .data-table tbody tr {
    border-bottom: 1px solid var(--border);
    transition: background 0.2s ease;
  }

  .data-table tbody tr:hover {
    background: var(--bg-tertiary);
  }

  .data-table tbody tr:last-child {
    border-bottom: none;
  }

  .data-table td {
    padding: 16px 20px;
    font-size: 14px;
    color: var(--text-primary);
  }

  .card-id-badge {
    display: inline-block;
    padding: 6px 12px;
    background: rgba(99, 102, 241, 0.15);
    border: 1px solid rgba(99, 102, 241, 0.3);
    color: var(--accent);
    border-radius: 8px;
    font-weight: 600;
    font-size: 13px;
    font-family: 'Lexend', monospace;
  }

  .seller-cell {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-secondary);
  }

  .amount-cell {
    font-weight: 600;
    font-family: 'Lexend', sans-serif;
    color: var(--success);
  }

  .payment-badge {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
  }

  .payment-badge.upi {
    background: rgba(16, 185, 129, 0.15);
    color: var(--success);
    border: 1px solid rgba(16, 185, 129, 0.3);
  }

  .payment-badge.cash {
    background: rgba(251, 191, 36, 0.15);
    color: #fbbf24;
    border: 1px solid rgba(251, 191, 36, 0.3);
  }

  .payment-badge.referred {
    background: rgba(139, 92, 246, 0.15);
    color: #8b5cf6;
    border: 1px solid rgba(139, 92, 246, 0.3);
  }

  .date-cell {
    color: var(--text-secondary);
    font-size: 13px;
  }

  /* ========== Loading & Empty States ========== */
  .loading-state,
  .empty-state {
    padding: 80px 20px;
    text-align: center;
    color: var(--text-secondary);
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .empty-state svg {
    color: var(--text-muted);
    margin-bottom: 16px;
  }

  .empty-state h3 {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 8px;
  }

  .empty-state p {
    font-size: 14px;
  }

  /* ========== Toast Notifications ========== */
  .toast-container {
    position: fixed;
    top: 24px;
    right: 24px;
    z-index: 1000;
  }

  .toast {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 12px;
    box-shadow: 0 20px 60px var(--shadow);
    min-width: 320px;
    animation: slideInRight 0.3s ease;
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .toast span {
    flex: 1;
    font-size: 14px;
    color: var(--text-primary);
  }

  .toast-close {
    background: transparent;
    border: none;
    color: var(--text-secondary);
    font-size: 24px;
    cursor: pointer;
    line-height: 1;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s ease;
  }

  .toast-close:hover {
    color: var(--text-primary);
  }

  /* ========== Responsive Design ========== */
  @media (max-width: 768px) {
    .navbar {
      padding: 0 20px;
      height: auto;
      flex-direction: column;
      gap: 16px;
      padding-top: 16px;
      padding-bottom: 16px;
    }

    .navbar-menu {
      width: 100%;
      justify-content: space-between;
    }

    .btn-logout {
      margin-left: 0;
    }

    .main-content {
      padding: 20px;
    }

    .page-header {
      flex-direction: column;
      gap: 16px;
    }

    .login-box {
      padding: 32px 24px;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }

    .form-row {
      grid-template-columns: 1fr;
    }

    .table-wrapper {
      overflow-x: scroll;
    }

    .data-table {
      min-width: 700px;
    }

    .toast-container {
      left: 16px;
      right: 16px;
      top: 16px;
    }

    .toast {
      min-width: auto;
      width: 100%;
    }
  }

  @media (max-width: 480px) {
    .page-header h1 {
      font-size: 24px;
    }

    .navbar-brand {
      font-size: 18px;
    }

    .stat-value {
      font-size: 24px;
    }

    .card-form-container {
      padding: 24px 16px;
    }
  }
`;

export default App;