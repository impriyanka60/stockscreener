import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer,
} from 'recharts';

const Home = () => {
  const [gainers, setGainers] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [search, setSearch] = useState('');
  const [searchedStock, setSearchedStock] = useState(null);
  const [error, setError] = useState(null);
  const API_KEY = process.env.REACT_APP_FMP_API_KEY;

  const fetchTopGainers = async () => {
    try {
      const response = await fetch(`https://financialmodelingprep.com/api/v3/stock_market/gainers?apikey=${API_KEY}`);
      const data = await response.json();
      setGainers(data.slice(0, 5));
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchChartData = async (symbol = 'AAPL') => {
    try {
      const response = await fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?serietype=line&apikey=${API_KEY}`);
      const data = await response.json();
      if (data.historical) {
        const recentData = data.historical
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 10)
          .reverse();
        setChartData(recentData);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchTopGainers();
    fetchChartData();
  }, [API_KEY]);

  const handleSearch = async () => {
    if (!search) return;
    try {
      const response = await fetch(`https://financialmodelingprep.com/api/v3/profile/${search}?apikey=${API_KEY}`);
      const data = await response.json();
      if (data.length > 0) {
        setSearchedStock(data[0]);
        fetchChartData(data[0].symbol);
        fetchSectorGainers(data[0].sector);
      } else {
        setSearchedStock(null);
        setGainers([]);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchSectorGainers = async (sector) => {
    try {
      const response = await fetch(`https://financialmodelingprep.com/api/v3/stock-screener?sector=${sector}&limit=5&apikey=${API_KEY}`);
      const data = await response.json();
      setGainers(data);
    } catch {
      fetchTopGainers();
    }
  };

  const getDummySentimentScore = () => `${Math.floor(Math.random() * 100)}% positive`;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📊 Stock & News Dashboard</h1>

      {/* Cards */}
      <div style={styles.cardGrid}>
        {/* Search */}
        <div style={styles.card}>
          <h2 style={styles.subtitle}>🔎 Search Stock</h2>
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Enter stock symbol (e.g., AAPL)"
              value={search}
              onChange={(e) => setSearch(e.target.value.toUpperCase())}
              style={styles.input}
            />
            <button onClick={handleSearch} style={styles.button}>Search</button>
          </div>
          {searchedStock && (
            <div>
              <h3>{searchedStock.companyName} ({searchedStock.symbol})</h3>
              <p>Price: ${searchedStock.price}</p>
              <p>Industry: {searchedStock.industry}</p>
              <p>Sentiment: {getDummySentimentScore()}</p>
            </div>
          )}
        </div>

        {/* Gainers */}
        <div style={styles.card}>
          <h2 style={styles.subtitle}>📈 Top Gainers</h2>
          {error ? (
            <p style={styles.error}>Error: {error}</p>
          ) : (
            <ul style={styles.list}>
              {gainers.map((stock) => (
                <li key={stock.symbol || stock.ticker} style={styles.listItem}>
                  {stock.companyName} ({stock.symbol || stock.ticker}) - ${stock.price} ({stock.changesPercentage || 'N/A'})
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* News */}
        <div style={styles.card}>
          <h2 style={styles.subtitle}>📰 Market News</h2>
          <ul style={styles.list}>
            <li style={styles.listItem}>🔍 Apple to unveil new M4 chip this month.</li>
            <li style={styles.listItem}>💸 Microsoft surpasses $3T market cap milestone.</li>
            <li style={styles.listItem}>🚀 Tesla launches new AI-powered autopilot.</li>
          </ul>
        </div>
      </div>

      {/* Chart */}
      <section style={styles.section}>
        <h2 style={styles.subtitle}>📊 AAPL Stock Chart (Last 10 Days)</h2>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Line type="monotone" dataKey="close" stroke="#2196f3" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

// ✅ Updated Responsive Styles
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Inter, sans-serif',
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: '#f8fafc',
  },

  title: {
    fontSize: '2.5rem',
    textAlign: 'center',
    marginBottom: '30px',
    color: '#1e293b',
  },

  subtitle: {
    fontSize: '1.4rem',
    marginBottom: '12px',
    fontWeight: '600',
    color: '#334155',
  },

  // Grid for cards
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },

  // Card style
  card: {
    backgroundColor: 'rgb(246, 250, 240)', // soft professional blue-gray
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.06)',
  },

  list: {
    listStyleType: 'none',
    padding: 0,
    marginTop: '10px',
  },

  listItem: {
    padding: '8px 0',
    fontSize: '1rem',
    borderBottom: '1px solid #e2e8f0',
    color: '#334155',
  },

  input: {
    padding: '10px',
    fontSize: '1rem',
    marginRight: '10px',
    width: '70%',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
  },

  button: {
    padding: '10px 16px',
    fontSize: '1rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },

  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
  },

  section: {
    marginTop: '30px',
    background: '#ffffff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },

  error: {
    color: '#dc2626',
    fontWeight: '500',
  },
};


export default Home;
