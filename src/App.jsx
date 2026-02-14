import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle2,
  LogOut,
  CreditCard,
  TrendingUp,
  DollarSign,
  User,
  Users,
  BarChart3,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
} from "lucide-react";

// ============================================================================
// API Configuration & Utilities
// ============================================================================

const API_BASE_URL = "https://hitsort-backend.onrender.com";

const api = {
  login: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) throw new Error("Login failed");
    return response.json();
  },

  getCards: async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/cards`, {
      headers: { Authorization: token },
    });
    if (!response.ok) throw new Error("Failed to fetch cards");
    return response.json();
  },

  updateCard: async (token, data) => {
    const response = await fetch(`${API_BASE_URL}/api/cards/update`, {
      method: "PUT",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update card");
    return response.json();
  },

  getExpenditures: async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/expenditures/`, {
      headers: { Authorization: token },
    });
    if (!response.ok) throw new Error("Failed to fetch cards");
    return response.json();
  },

  updateExpenditure: async (token, data) => {
    const response = await fetch(`${API_BASE_URL}/api/expenditures/update`, {
      method: "PUT",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update expenditure");
    return response.json();
  },
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
    <div className="toast">
      {type === "success" ? (
        <CheckCircle2 size={20} className="toast-icon success" />
      ) : (
        <AlertCircle size={20} className="toast-icon error" />
      )}
      <span>{message}</span>
      <button onClick={onClose} className="toast-close">
        ×
      </button>
    </div>
  );
};

// ============================================================================
// Login Page Component
// ============================================================================

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.login(username, password);
      localStorage.setItem("authToken", response.token);
      onLogin(response.token);
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <div className="login-logo">
            <div className="logo-icon">
              <CreditCard size={40} />
            </div>
            <h1>HITSORT</h1>
          </div>
          <p className="login-subtitle">Admin Card Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
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
              placeholder="Enter your password"
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
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// Update Card Page Component
// ============================================================================

const UpdateExpenditurePage = ({ token, onShowToast }) => {
  const [formData, setFormData] = useState({
    usedFor: "",
    amount: "",
    usedBy: "",
  });
  const [loading, setLoading] = useState(false);

  const usedForTypes = ["Stall", "Cashback", "Prize", "Items" , "Cards"];
  const usedByTypes = [
    "Sahith",
    "Pandu",
    "Bharath",
    "Manoj",
    "Anand",
    "Ratnakar",
    "Yagnesh",
    "Pavan",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        usedFor: formData.usedFor,
        amount: parseInt(formData.amount),
        usedBy: formData.usedBy,
      };

      await api.updateExpenditure(token, payload);
      onShowToast("Expenditure updated successfully!", "success");

      setFormData({
        usedFor: "",
        amount: "",
        usedBy: "",
      });
    } catch (err) {
      onShowToast("Failed to update Expenditure. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Update Expenditure</h1>
          <p>Manage Expenditures of the Gaming Stall</p>
        </div>
      </div>

      <div className="card-form-wrapper">
        <form onSubmit={handleSubmit} className="card-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="usedFor">Used For</label>
              <select
                id="usedFor"
                value={formData.usedFor}
                onChange={(e) =>
                  setFormData({ ...formData, usedFor: e.target.value })
                }
                required
                disabled={loading}
              >
                <option value="">Select Type</option>
                {usedForTypes.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="amount">Amount Paid</label>
              <input
                id="amount"
                type="text"
                value={formData.amount}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 4) {
                    setFormData({ ...formData, amount: value });
                  }
                }}
                placeholder="00"
                required
                disabled={loading}
                maxLength={4}
              />
            </div>

            <div className="form-group">
              <label htmlFor="usedBy">Used By</label>
              <select
                id="usedBy"
                value={formData.usedBy}
                onChange={(e) =>
                  setFormData({ ...formData, usedBy: e.target.value })
                }
                required
                disabled={loading}
              >
                <option value="">Select Person</option>
                {usedByTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary btn-large"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Expenditure"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UpdateCardPage = ({ token, onShowToast }) => {
  const [formData, setFormData] = useState({
    cardId: "",
    sellerName: "",
    numberOfGames: "",
    amount: "",
    paymentType: "",
  });
  const [loading, setLoading] = useState(false);

  const sellerNames = [
    "Sahith",
    "Pandu",
    "Bharath",
    "Manoj",
    "Anand",
    "Ratnakar",
    "Yagnesh",
    "Pavan",
  ];
  const gameOptions = [1, 2];
  const amountOptions = [0, 39, 49, 69, 79, 40, 50, 70, 80];
  const paymentTypes = ["UPI", "CASH", "REFERRED"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        cardId: `HS${formData.cardId.padStart(2, "0")}`,
        sellerName: formData.sellerName,
        numberOfGames: parseInt(formData.numberOfGames),
        amount: parseInt(formData.amount),
        paymentType: formData.paymentType,
      };

      await api.updateCard(token, payload);
      onShowToast("Card updated successfully!", "success");

      setFormData({
        cardId: "",
        sellerName: "",
        numberOfGames: "",
        amount: "",
        paymentType: "",
      });
    } catch (err) {
      onShowToast("Failed to update card. Please try again.", "error");
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

      <div className="card-form-wrapper">
        <form onSubmit={handleSubmit} className="card-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="sellerName">Seller Name</label>
              <select
                id="sellerName"
                value={formData.sellerName}
                onChange={(e) =>
                  setFormData({ ...formData, sellerName: e.target.value })
                }
                required
                disabled={loading}
              >
                <option value="">Select seller</option>
                {sellerNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
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
                    const value = e.target.value.replace(/\D/g, "");
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

            <div className="form-group">
              <label htmlFor="numberOfGames">Number of Games</label>
              <select
                id="numberOfGames"
                value={formData.numberOfGames}
                onChange={(e) =>
                  setFormData({ ...formData, numberOfGames: e.target.value })
                }
                required
                disabled={loading}
              >
                <option value="">Select games</option>
                {gameOptions.map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "game" : "games"}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="amount">Amount Paid</label>
              <select
                id="amount"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                required
                disabled={loading}
              >
                <option value="">Select amount</option>
                {amountOptions.map((amt) => (
                  <option key={amt} value={amt}>
                    ₹{amt}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="paymentType">Payment Type</label>
              <select
                id="paymentType"
                value={formData.paymentType}
                onChange={(e) =>
                  setFormData({ ...formData, paymentType: e.target.value })
                }
                required
                disabled={loading}
              >
                <option value="">Select type</option>
                {paymentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary btn-large"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Card"}
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
  const [expenditures, setExpenditures] = useState([]);
  const [loading, setLoading] = useState(true);
 const [stats, setStats] = useState({
  totalCards: 0,
  soldCards: 0,
  totalRevenue: 0,
  totalGames: 0,
  totalExpenditures: 0,  // ✅ plural
});
  const [sellerStats, setSellerStats] = useState([]);
  const [expenditureStats, setExpenditureStats] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeller, setFilterSeller] = useState("");
  const cardsPerPage = 50;

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const data = await api.getCards(token);

      // Sort cards by card ID to ensure consistent display
      const sortedData = data.sort((a, b) => {
        const numA = parseInt(a.cardId?.replace("HS", "") || "0");
        const numB = parseInt(b.cardId?.replace("HS", "") || "0");
        return numA - numB;
      });

      setCards(sortedData);

      const totalRevenue = sortedData.reduce(
        (sum, card) => sum + (card.amount || 0),
        0,
      );
      const totalGames = sortedData.reduce(
        (sum, card) => sum + (card.numberOfGames || 0),
        0,
      );
      const soldCards = sortedData.filter(
        (card) => card.sellerName && card.sellerName !== "NOT_SOLD",
      ).length;

      const expendData = await api.getExpenditures(token);
      setExpenditures(expendData);
      
      const totalExpenditures = expendData.reduce(
        (sum, expenditure) => sum + (expenditure.amount || 0),
        0,
      );

      setStats({
        totalCards: sortedData.length,
        soldCards,
        totalRevenue,
        totalGames,
        totalExpenditures,
      });

      // Calculate seller stats
      const sellerMap = {};
      sortedData.forEach((card) => {
        if (card.sellerName && card.sellerName !== "NOT_SOLD") {
          if (!sellerMap[card.sellerName]) {
            sellerMap[card.sellerName] = {
              name: card.sellerName,
              cardsSold: 0,
              revenue: 0,
              games: 0,
            };
          }
          sellerMap[card.sellerName].cardsSold += 1;
          sellerMap[card.sellerName].revenue += card.amount || 0;
          sellerMap[card.sellerName].games += card.numberOfGames || 0;
        }
      });

      const sellerArray = Object.values(sellerMap).sort((a, b) => b.revenue - a.revenue);
     const enhancedSellerStats = sellerArray.map(seller => {
      const submitted = submittedAmounts[seller.name] || 0;

      return {
         ...seller,
        submitted,
        balance: seller.revenue - submitted
      };
      });

      setSellerStats(enhancedSellerStats);


      // Calculate expenditure stats grouped by person
      const expenditureMap = {};
      expendData.forEach((exp) => {
        if (exp.usedBy) {
          if (!expenditureMap[exp.usedBy]) {
            expenditureMap[exp.usedBy] = {
              name: exp.usedBy,
              totalAmount: 0,
              items: [],
            };
          }
          expenditureMap[exp.usedBy].totalAmount += exp.amount || 0;
          expenditureMap[exp.usedBy].items.push({
            usedFor: exp.usedFor,
            amount: exp.amount,
          });
        }
      });

      const expenditureArray = Object.values(expenditureMap).sort(
        (a, b) => b.totalAmount - a.totalAmount,
      );
      setExpenditureStats(expenditureArray);
      
    } catch (err) {
      onShowToast("Failed to load dashboard data", "error");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Filter and search logic
  const filteredCards = cards.filter((card) => {
    const matchesSearch =
      searchTerm === "" ||
      card.cardId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.sellerName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeller =
      filterSeller === "" || card.sellerName === filterSeller;

    return matchesSearch && matchesSeller;
  });

  // Pagination logic
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(filteredCards.length / cardsPerPage);

  // Get unique sellers for filter
  const uniqueSellers = [
    "",
    ...new Set(
      cards
        .map((card) => card.sellerName)
        .filter((name) => name && name !== "NOT_SOLD"),
    ),
  ];

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of all {stats.totalCards} cards</p>
        </div>
        <button
          onClick={fetchCards}
          className="btn-secondary"
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon orange">
            <CreditCard size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Cards</p>
            <p className="stat-value">{stats.totalCards}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Revenue</p>
            <p className="stat-value">₹{stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Expenditure</p>
            <p className="stat-value">₹{stats.totalExpenditures.toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Games</p>
            <p className="stat-value">{stats.totalGames}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Cards Sold</p>
            <p className="stat-value">{stats.soldCards}</p>
          </div>
        </div>
      </div>
      
      
      <div className="seller-stats-section">
        <div className="section-header">
          <div className="section-title">
            <Users size={24} />
            <h2>Individual Amounts</h2>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading seller stats...</p>
          </div>
        ) : sellerStats.length === 0 ? (
          <div className="empty-state">
            <Users size={48} />
            <h3>No seller data available</h3>
            <p>Start updating cards to see seller statistics</p>
          </div>
        ) : (
          <div className="seller-grid">
            {sellerStats.map((seller, index) => (
              <div key={seller.name} className="seller-card">
                <div className="seller-info">
                  <div className="seller-avatar">{seller.name.charAt(0)}</div>
                  <h3>{seller.name}</h3>
                </div>
                <div className="seller-metrics">
                  <div className="metric">
                    <span className="metric-label">Cards</span>
                    <span className="metric-value">{seller.cardsSold}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Revenue</span>
                    <span className="metric-value metric-revenue">
                      ₹{seller.revenue}
                    </span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Games</span>
                    <span className="metric-value">{seller.games}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* ========== Revenue Settlement Section ========== */}
<div className="seller-stats-section">
  <div className="section-header">
    <div className="section-title">
      <DollarSign size={24} />
      <h2>Revenue Settlement</h2>
    </div>
  </div>

  {loading ? (
    <div className="loading-state">
      <div className="spinner"></div>
      <p>Loading settlement data...</p>
    </div>
  ) : sellerStats.length === 0 ? (
    <div className="empty-state">
      <DollarSign size={48} />
      <h3>No settlement data</h3>
      <p>Seller revenue not available</p>
    </div>
  ) : (
    <div className="seller-grid">
      {sellerStats.map((seller) => (
        <div key={seller.name} className="seller-card">

          <div className="seller-info">
            <div className="seller-avatar">
              {seller.name.charAt(0)}
            </div>
            <h3>{seller.name}</h3>
          </div>

          <div className="seller-metrics">

            {/* Total Revenue */}
            <div className="metric">
              <span className="metric-label">Total Revenue</span>
              <span className="metric-value metric-revenue">
                ₹{seller.revenue}
              </span>
            </div>

            {/* Submitted */}
            <div className="metric">
              <span className="metric-label">Submitted</span>
              <span className="metric-value">
                ₹{seller.submitted}
              </span>
            </div>

            {/* Balance */}
            <div className="metric">
              <span className="metric-label">Balance</span>
              <span
                className="metric-value"
                style={{
                  color: seller.balance >= 0 ? '#22c55e' : '#ef4444'
                }}
              >
                ₹{seller.balance}
              </span>
            </div>

          </div>
        </div>
      ))}
    </div>
  )}
</div>


      <div className="seller-stats-section">
        <div className="section-header">
          <div className="section-title">
            <ShoppingCart size={24} />
            <h2>Individual Expenditure</h2>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading Expenditures...</p>
          </div>
        ) : expenditureStats.length === 0 ? (
          <div className="empty-state">
            <ShoppingCart size={48} />
            <h3>No expenditure data available</h3>
            <p>Start updating expenditures to see statistics</p>
          </div>
        ) : (
          <div className="seller-grid">
            {expenditureStats.map((exp) => (
              <div key={exp.name} className="seller-card expenditure-card">
                <div className="seller-info">
                  <div className="seller-avatar expenditure-avatar">{exp.name.charAt(0)}</div>
                  <h3>{exp.name}</h3>
                </div>
                <div className="expenditure-total">
                  <span className="expenditure-total-label">Total Spent</span>
                  <span className="expenditure-total-amount">₹{exp.totalAmount}</span>
                </div>
                <div className="expenditure-items">
                  {exp.items.map((item, idx) => (
                    <div key={idx} className="expenditure-item">
                      <span className="expenditure-item-name">{item.usedFor}</span>
                      <span className="expenditure-item-amount">₹{item.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="transactions-section">
        <div className="section-header">
          <div className="section-title">
            <BarChart3 size={24} />
            <h2>All Cards ({filteredCards.length})</h2>
          </div>
        </div>

        <div className="filters-section">
          <div className="filter-group">
            <input
              type="text"
              placeholder="Search by Card ID or Seller..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="search-input"
            />
          </div>
          <div className="filter-group">
            <select
              value={filterSeller}
              onChange={(e) => {
                setFilterSeller(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              <option value="">All Sellers</option>
              {uniqueSellers.slice(1).map((seller) => (
                <option key={seller} value={seller}>
                  {seller}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-container">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading cards...</p>
            </div>
          ) : filteredCards.length === 0 ? (
            <div className="empty-state">
              <CreditCard size={48} />
              <h3>No cards found</h3>
              <p>
                {searchTerm || filterSeller
                  ? "Try adjusting your filters"
                  : "Start by updating your first card"}
              </p>
            </div>
          ) : (
            <>
              <div className="table-info">
                <p>
                  Showing {indexOfFirstCard + 1} -{" "}
                  {Math.min(indexOfLastCard, filteredCards.length)} of{" "}
                  {filteredCards.length} cards
                </p>
              </div>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Card ID</th>
                      <th>Seller</th>
                      <th>Games</th>
                      <th>Amount</th>
                      <th>Payment</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCards.map((card, index) => (
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
                        <td>{card.numberOfGames || 0}</td>
                        <td>
                          <span className="amount-cell">
                            ₹{card.amount || 0}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`payment-badge ${card.paymentType?.toLowerCase() || "none"}`}
                          >
                            {card.paymentType || "N/A"}
                          </span>
                        </td>
                        <td className="date-cell">{formatDate(card.date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-btn"
                  >
                    <ChevronLeft size={18} />
                    Previous
                  </button>

                  <div className="pagination-numbers">
                    {getPageNumbers().map((page, index) =>
                      page === "..." ? (
                        <span
                          key={`ellipsis-${index}`}
                          className="pagination-ellipsis"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`pagination-number ${currentPage === page ? "active" : ""}`}
                        >
                          {page}
                        </button>
                      ),
                    )}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-btn"
                  >
                    Next
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Main App Component
// ============================================================================

const App = () => {
  const [currentPage, setCurrentPage] = useState("login");
  const [token, setToken] = useState(null);
  const [toast, setToast] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      setToken(savedToken);
      setCurrentPage("dashboard");
    }
  }, []);

  const handleLogin = (newToken) => {
    setToken(newToken);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setToken(null);
    setCurrentPage("login");
    setMobileMenuOpen(false);
  };

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
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
        <div className="navbar-container">
          <div className="navbar-brand">
            <CreditCard size={28} />
            <span>HITSORT</span>
          </div>

          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className={`navbar-menu ${mobileMenuOpen ? "mobile-open" : ""}`}>
            <button
              className={
                currentPage === "dashboard" ? "nav-link active" : "nav-link"
              }
              onClick={() => navigateTo("dashboard")}
            >
              Dashboard
            </button>
            <button
              className={
                currentPage === "update" ? "nav-link active" : "nav-link"
              }
              onClick={() => navigateTo("update")}
            >
              Update Card
            </button>
            <button
              className={
                currentPage === "expenditure" ? "nav-link active" : "nav-link"
              }
              onClick={() => navigateTo("expenditure")}
            >
              Update Expenditure
            </button>
            <button className="btn-logout" onClick={handleLogout}>
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        {currentPage === "dashboard" && (
          <DashboardPage token={token} onShowToast={showToast} />
        )}
        {currentPage === "update" && (
          <UpdateCardPage token={token} onShowToast={showToast} />
        )}
        {currentPage === "expenditure" && (
          <UpdateExpenditurePage token={token} onShowToast={showToast} />
        )}
      </main>

      {toast && (
        <div className="toast-container">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={closeToast}
          />
        </div>
      )}

      <style>{styles}</style>
    </div>
  );
};

// ============================================================================
// Optimized Styles with HitSort Theme + Pagination + Expenditure Styles
// ============================================================================

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    --bg-primary: #0a0e1a;
    --bg-secondary: #111827;
    --bg-tertiary: #1f2937;
    --bg-card: #1a2332;
    
    --text-primary: #ffffff;
    --text-secondary: #9ca3af;
    --text-muted: #6b7280;
    
    --border: rgba(255, 255, 255, 0.1);
    --border-focus: rgba(34, 211, 238, 0.5);
    
    --green-primary: #22c55e;
    --green-dark: #16a34a;
    --blue-primary: #22d3ee;
    --blue-dark: #06b6d4;
    --orange: #f97316;
    --purple: #a855f7;
    --yellow: #fbbf24;
    --red: #ef4444;
    
    --success: #22c55e;
    --error: #ef4444;
    
    --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3);
    --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.4);
    --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.5);
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
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
    padding: 1rem;
    background: 
      radial-gradient(circle at 20% 20%, rgba(34, 211, 238, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
      var(--bg-primary);
  }

  .login-box {
    background: var(--bg-secondary);
    border: 2px solid rgba(34, 211, 238, 0.2);
    border-radius: 1.25rem;
    padding: 2.5rem;
    width: 100%;
    max-width: 420px;
    box-shadow: var(--shadow-lg);
  }

  .login-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .login-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }

  .logo-icon {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, var(--green-primary) 0%, var(--blue-primary) 100%);
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;
    box-shadow: 0 8px 24px rgba(34, 211, 238, 0.3);
  }

  .login-logo h1 {
    font-size: 2rem;
    font-weight: 900;
    background: linear-gradient(135deg, var(--green-primary) 0%, var(--blue-primary) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: 2px;
  }

  .login-subtitle {
    color: var(--text-secondary);
    font-size: 0.875rem;
    margin-top: 0.5rem;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-group label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-secondary);
  }

  .form-group input,
  .form-group select {
    padding: 0.875rem 1rem;
    background: var(--bg-tertiary);
    border: 2px solid var(--border);
    border-radius: 0.75rem;
    color: var(--text-primary);
    font-size: 0.9375rem;
    font-family: inherit;
    transition: all 0.2s ease;
    width: 100%;
  }

  .form-group input:focus,
  .form-group select:focus {
    outline: none;
    border-color: var(--blue-primary);
    box-shadow: 0 0 0 4px rgba(34, 211, 238, 0.1);
    background: var(--bg-secondary);
  }

  .form-group input:disabled,
  .form-group select:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .error-message {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: rgba(239, 68, 68, 0.1);
    border: 2px solid rgba(239, 68, 68, 0.3);
    border-radius: 0.75rem;
    color: var(--error);
    font-size: 0.875rem;
  }

  .btn-primary {
    padding: 1rem 1.5rem;
    background: linear-gradient(135deg, var(--green-primary) 0%, var(--blue-primary) 100%);
    color: #000;
    border: none;
    border-radius: 0.75rem;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 1px;
    box-shadow: 0 4px 12px rgba(34, 211, 238, 0.3);
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(34, 211, 238, 0.4);
  }

  .btn-primary:active:not(:disabled) {
    transform: translateY(0);
  }

  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-primary.btn-large {
    width: 100%;
    padding: 1.125rem 1.5rem;
  }

  /* ========== App Layout ========== */
  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .navbar {
    background: var(--bg-secondary);
    border-bottom: 2px solid rgba(34, 211, 238, 0.2);
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: var(--shadow-md);
  }

  .navbar-container {
    max-width: 1600px;
    margin: 0 auto;
    padding: 0 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 4.5rem;
  }

  .navbar-brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.5rem;
    font-weight: 900;
    color: var(--text-primary);
    letter-spacing: 2px;
  }

  .navbar-brand svg {
    color: var(--blue-primary);
  }

  .mobile-menu-toggle {
    display: none;
    background: transparent;
    border: none;
    color: var(--text-primary);
    cursor: pointer;
    padding: 0.5rem;
  }

  .navbar-menu {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .nav-link {
    padding: 0.75rem 1.25rem;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    font-size: 0.9375rem;
    font-weight: 600;
    cursor: pointer;
    border-radius: 0.625rem;
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .nav-link:hover {
    color: var(--blue-primary);
    background: rgba(34, 211, 238, 0.1);
  }

  .nav-link.active {
    color: var(--blue-primary);
    background: rgba(34, 211, 238, 0.15);
  }

  .btn-logout {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    background: transparent;
    border: 2px solid var(--border);
    color: var(--text-secondary);
    border-radius: 0.625rem;
    font-size: 0.9375rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-left: 1rem;
    text-transform: uppercase;
  }

  .btn-logout:hover {
    border-color: var(--error);
    color: var(--error);
    background: rgba(239, 68, 68, 0.1);
  }

  .main-content {
    flex: 1;
    padding: 2rem 1.5rem;
    max-width: 1600px;
    width: 100%;
    margin: 0 auto;
  }

  /* ========== Page Header ========== */
  .page-container {
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;
    gap: 1rem;
  }

  .page-header h1 {
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 0.25rem;
    background: linear-gradient(135deg, var(--green-primary) 0%, var(--blue-primary) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .page-header p {
    color: var(--text-secondary);
    font-size: 0.9375rem;
  }

  .btn-secondary {
    padding: 0.75rem 1.25rem;
    background: var(--bg-tertiary);
    border: 2px solid var(--border);
    color: var(--text-primary);
    border-radius: 0.625rem;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .btn-secondary:hover:not(:disabled) {
    background: var(--bg-secondary);
    border-color: var(--blue-primary);
  }

  .btn-secondary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* ========== Stats Grid ========== */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.25rem;
    margin-bottom: 2.5rem;
  }

  .stat-card {
    background: var(--bg-card);
    border: 2px solid var(--border);
    border-radius: 1rem;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1.25rem;
    transition: all 0.2s ease;
  }

  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    border-color: rgba(34, 211, 238, 0.3);
  }

  .stat-icon {
    width: 56px;
    height: 56px;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;
    flex-shrink: 0;
  }

  .stat-icon.orange {
    background: linear-gradient(135deg, var(--orange) 0%, #ea580c 100%);
  }

  .stat-icon.green {
    background: linear-gradient(135deg, var(--green-primary) 0%, var(--green-dark) 100%);
  }

  .stat-icon.blue {
    background: linear-gradient(135deg, var(--blue-primary) 0%, var(--blue-dark) 100%);
  }

  .stat-icon.purple {
    background: linear-gradient(135deg, var(--purple) 0%, #9333ea 100%);
  }

  .stat-icon.red {
    background: linear-gradient(135deg, var(--red) 0%, #dc2626 100%);
  }

  .stat-content {
    flex: 1;
    min-width: 0;
  }

  .stat-label {
    font-size: 0.75rem;
    color: var(--text-secondary);
    margin-bottom: 0.25rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
  }

  .stat-value {
    font-size: 1.75rem;
    font-weight: 800;
    color: var(--text-primary);
  }

  /* ========== Filters Section ========== */
  .filters-section {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }

  .filter-group {
    flex: 1;
    min-width: 250px;
  }

  .search-input,
  .filter-select {
    width: 100%;
    padding: 0.875rem 1rem;
    background: var(--bg-tertiary);
    border: 2px solid var(--border);
    border-radius: 0.75rem;
    color: var(--text-primary);
    font-size: 0.9375rem;
    font-family: inherit;
    transition: all 0.2s ease;
  }

  .search-input:focus,
  .filter-select:focus {
    outline: none;
    border-color: var(--blue-primary);
    box-shadow: 0 0 0 4px rgba(34, 211, 238, 0.1);
    background: var(--bg-secondary);
  }

  .search-input::placeholder {
    color: var(--text-muted);
  }

  /* ========== Seller Stats ========== */
  .seller-stats-section,
  .transactions-section {
    margin-bottom: 2.5rem;
  }

  .section-header {
    margin-bottom: 1.5rem;
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .section-title svg {
    color: var(--blue-primary);
  }

  .section-title h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
  }

  .seller-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.25rem;
  }

  .seller-card {
    background: var(--bg-card);
    border: 2px solid var(--border);
    border-radius: 1rem;
    padding: 1.5rem;
    position: relative;
    transition: all 0.2s ease;
  }

  .seller-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    border-color: rgba(34, 211, 238, 0.3);
  }

  .seller-rank {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, var(--green-primary) 0%, var(--blue-primary) 100%);
    border-radius: 0.625rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    font-weight: 700;
    color: #000;
  }

  .seller-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1.25rem;
  }

  .seller-avatar {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, var(--blue-primary) 0%, var(--purple) 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.75rem;
    font-weight: 700;
    color: #000;
    margin-bottom: 0.75rem;
  }

  .seller-avatar.expenditure-avatar {
    background: linear-gradient(135deg, var(--orange) 0%, var(--red) 100%);
  }

  .seller-info h3 {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--text-primary);
  }

  .seller-metrics {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
  }

  .metric {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 0.625rem;
    border: 1px solid var(--border);
  }

  .metric-label {
    font-size: 0.6875rem;
    color: var(--text-secondary);
    margin-bottom: 0.25rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
  }

  .metric-value {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--text-primary);
  }

  .metric-revenue {
    color: var(--green-primary);
  }

  /* ========== Expenditure Card Styles ========== */
  .expenditure-card {
    display: flex;
    flex-direction: column;
  }

  .expenditure-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: rgba(239, 68, 68, 0.1);
    border: 2px solid rgba(239, 68, 68, 0.2);
    border-radius: 0.75rem;
    margin-bottom: 1rem;
  }

  .expenditure-total-label {
    font-size: 0.75rem;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
  }

  .expenditure-total-amount {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--red);
  }

  .expenditure-items {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .expenditure-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    transition: all 0.2s ease;
  }

  .expenditure-item:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(34, 211, 238, 0.3);
  }

  .expenditure-item-name {
    font-size: 0.875rem;
    color: var(--text-primary);
    font-weight: 500;
  }

  .expenditure-item-amount {
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--orange);
  }

  /* ========== Card Form ========== */
  .card-form-wrapper {
    background: var(--bg-card);
    border: 2px solid rgba(34, 211, 238, 0.2);
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: var(--shadow-sm);
  }

  .card-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.25rem;
  }

  .card-id-input {
    position: relative;
    display: flex;
    align-items: center;
  }

  .card-prefix {
    position: absolute;
    left: 1rem;
    font-weight: 700;
    color: var(--blue-primary);
    font-size: 0.9375rem;
    pointer-events: none;
  }

  .card-id-input input {
    padding-left: 3rem !important;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    padding-top: 0.5rem;
  }

  /* ========== Table ========== */
  .table-container {
    background: var(--bg-card);
    border: 2px solid var(--border);
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: var(--shadow-sm);
  }

  .table-info {
    padding: 1rem 1.25rem;
    background: rgba(34, 211, 238, 0.05);
    border-bottom: 1px solid var(--border);
  }

  .table-info p {
    color: var(--text-secondary);
    font-size: 0.875rem;
    font-weight: 600;
  }

  .table-wrapper {
    overflow-x: auto;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
  }

  .data-table thead {
    background: rgba(34, 211, 238, 0.1);
  }

  .data-table th {
    padding: 1rem 1.25rem;
    text-align: left;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--blue-primary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .data-table tbody tr {
    border-bottom: 1px solid var(--border);
    transition: background 0.2s ease;
  }

  .data-table tbody tr:hover {
    background: rgba(34, 211, 238, 0.05);
  }

  .data-table tbody tr:last-child {
    border-bottom: none;
  }

  .data-table td {
    padding: 1rem 1.25rem;
    font-size: 0.875rem;
    color: var(--text-primary);
  }

  .card-id-badge {
    display: inline-block;
    padding: 0.375rem 0.875rem;
    background: rgba(34, 211, 238, 0.15);
    border: 2px solid rgba(34, 211, 238, 0.3);
    color: var(--blue-primary);
    border-radius: 0.5rem;
    font-weight: 700;
    font-size: 0.8125rem;
    font-family: monospace;
    letter-spacing: 1px;
  }

  .seller-cell {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-secondary);
  }

  .amount-cell {
    font-weight: 700;
    color: var(--green-primary);
    font-size: 1rem;
  }

  .payment-badge {
    display: inline-block;
    padding: 0.375rem 0.875rem;
    border-radius: 0.5rem;
    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .payment-badge.upi {
    background: rgba(34, 197, 94, 0.15);
    color: var(--green-primary);
    border: 2px solid rgba(34, 197, 94, 0.3);
  }

  .payment-badge.cash {
    background: rgba(251, 191, 36, 0.15);
    color: var(--yellow);
    border: 2px solid rgba(251, 191, 36, 0.3);
  }

  .payment-badge.referred {
    background: rgba(168, 85, 247, 0.15);
    color: var(--purple);
    border: 2px solid rgba(168, 85, 247, 0.3);
  }

  .payment-badge.none {
    background: rgba(107, 114, 128, 0.15);
    color: var(--text-muted);
    border: 2px solid rgba(107, 114, 128, 0.3);
  }

  .date-cell {
    color: var(--text-secondary);
    font-size: 0.8125rem;
  }

  /* ========== Pagination ========== */
  .pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem 1.25rem;
    border-top: 1px solid var(--border);
    gap: 1rem;
    flex-wrap: wrap;
  }

  .pagination-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    background: var(--bg-tertiary);
    border: 2px solid var(--border);
    color: var(--text-primary);
    border-radius: 0.625rem;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    text-transform: uppercase;
  }

  .pagination-btn:hover:not(:disabled) {
    background: var(--bg-secondary);
    border-color: var(--blue-primary);
    color: var(--blue-primary);
  }

  .pagination-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .pagination-numbers {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .pagination-number {
    min-width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 0.75rem;
    background: var(--bg-tertiary);
    border: 2px solid var(--border);
    color: var(--text-secondary);
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .pagination-number:hover {
    background: var(--bg-secondary);
    border-color: var(--blue-primary);
    color: var(--blue-primary);
  }

  .pagination-number.active {
    background: linear-gradient(135deg, var(--green-primary) 0%, var(--blue-primary) 100%);
    border-color: transparent;
    color: #000;
    font-weight: 700;
  }

  .pagination-ellipsis {
    color: var(--text-muted);
    padding: 0 0.5rem;
    font-weight: 700;
  }

  /* ========== Loading & Empty States ========== */
  .loading-state,
  .empty-state {
    padding: 4rem 1.25rem;
    text-align: center;
    color: var(--text-secondary);
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid rgba(255, 255, 255, 0.1);
    border-top-color: var(--blue-primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .empty-state svg {
    color: var(--text-muted);
    margin-bottom: 1rem;
  }

  .empty-state h3 {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  .empty-state p {
    font-size: 0.875rem;
  }

  /* ========== Toast ========== */
  .toast-container {
    position: fixed;
    top: 1.5rem;
    right: 1.5rem;
    z-index: 1000;
  }

  .toast {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    background: var(--bg-secondary);
    border: 2px solid rgba(34, 211, 238, 0.3);
    border-radius: 0.75rem;
    box-shadow: var(--shadow-lg);
    min-width: 300px;
    animation: slideIn 0.3s ease;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(100px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .toast-icon.success {
    color: var(--success);
  }

  .toast-icon.error {
    color: var(--error);
  }

  .toast span {
    flex: 1;
    font-size: 0.875rem;
    color: var(--text-primary);
  }

  .toast-close {
    background: transparent;
    border: none;
    color: var(--text-secondary);
    font-size: 1.5rem;
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
    color: var(--blue-primary);
  }

  /* ========== Responsive Design ========== */
  @media (max-width: 768px) {
    .mobile-menu-toggle {
      display: block;
    }

    .navbar-menu {
      position: fixed;
      top: 4.5rem;
      left: 0;
      right: 0;
      background: var(--bg-secondary);
      border-bottom: 2px solid rgba(34, 211, 238, 0.2);
      flex-direction: column;
      align-items: stretch;
      padding: 1rem;
      gap: 0.75rem;
      transform: translateY(-100%);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      box-shadow: var(--shadow-md);
    }

    .navbar-menu.mobile-open {
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
    }

    .nav-link,
    .btn-logout {
      width: 100%;
      justify-content: center;
      margin-left: 0;
    }

    .main-content {
      padding: 1.5rem 1rem;
    }

    .page-header {
      flex-direction: column;
      align-items: stretch;
    }

    .page-header h1 {
      font-size: 1.75rem;
    }

    .login-box {
      padding: 2rem 1.5rem;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }

    .seller-grid {
      grid-template-columns: 1fr;
    }

    .form-grid {
      grid-template-columns: 1fr;
    }

    .card-form-wrapper {
      padding: 1.5rem;
    }

    .form-actions {
      justify-content: stretch;
    }

    .form-actions .btn-primary {
      width: 100%;
    }

    .toast-container {
      left: 1rem;
      right: 1rem;
      top: 1rem;
    }

    .toast {
      min-width: auto;
      width: 100%;
    }

    .seller-metrics {
      grid-template-columns: 1fr;
    }

    .stat-value {
      font-size: 1.5rem;
    }

    .filters-section {
      flex-direction: column;
    }

    .filter-group {
      min-width: auto;
    }

    .pagination {
      flex-direction: column;
      gap: 1rem;
    }

    .pagination-btn {
      width: 100%;
      justify-content: center;
    }
  }

  @media (max-width: 480px) {
    .navbar-brand {
      font-size: 1.25rem;
    }

    .page-header h1 {
      font-size: 1.5rem;
    }

    .login-logo h1 {
      font-size: 1.75rem;
    }

    .logo-icon {
      width: 50px;
      height: 50px;
    }

    .seller-avatar {
      width: 56px;
      height: 56px;
      font-size: 1.5rem;
    }

    .section-title h2 {
      font-size: 1.25rem;
    }
  }
`;

export default App;
