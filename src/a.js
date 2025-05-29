import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';


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
        .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date descending (most recent first)
        .slice(0, 10) // Get the 10 most recent entries
        .reverse(); // Reverse to make it chronological (oldest to newest)
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
    } catch (err) {
      // fallback to global gainers
      fetchTopGainers();
    }
  };

  const getDummySentimentScore = () => {
    const score = Math.floor(Math.random() * 100);
    return `${score}% positive`;
  };

  // Chart normalization
  const maxPrice = Math.max(...chartData.map(d => d.close), 0);
  const minPrice = Math.min(...chartData.map(d => d.close), 0);
  const normalize = (price) => {
    if (maxPrice === minPrice) return 100;
    return ((price - minPrice) / (maxPrice - minPrice)) * 150;
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📊 Stock & News Dashboard</h1>

      {/* Stock Search */}
      <section style={styles.section}>
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
          <div style={styles.resultCard}>
            <h3>{searchedStock.companyName} ({searchedStock.symbol})</h3>
            <p>Price: ${searchedStock.price}</p>
            <p>Industry: {searchedStock.industry}</p>
            <p>Sentiment: {getDummySentimentScore()}</p>
          </div>
        )}
      </section>

      {/* Trending Stocks */}
      <section style={styles.section}>
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
      </section>

      {/* Chart */}
     <section style={styles.section}>
  <h2 style={styles.subtitle}>📊 AAPL Stock Chart (Last 10 Days)</h2>
  <div style={{ width: '100%', height: 300 }}>
    <ResponsiveContainer>
      <LineChart data={chartData.reverse()} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={['auto', 'auto']} />
        <Tooltip />
        <Line type="monotone" dataKey="close" stroke="#2196f3" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
</section>


      {/* News */}
      <section style={styles.section}>
        <h2 style={styles.subtitle}>📰 Market News (Sample)</h2>
        <ul style={styles.list}>
          <li style={styles.listItem}>🔍 Apple to unveil new M4 chip this month.</li>
          <li style={styles.listItem}>💸 Microsoft surpasses $3T market cap milestone.</li>
          <li style={styles.listItem}>🚀 Tesla launches new AI-powered autopilot.</li>
        </ul>
      </section>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Segoe UI, sans-serif',
    maxWidth: '900px',
    margin: '0 auto',
  },
  title: {
    fontSize: '2.5rem',
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333',
  },
  subtitle: {
    fontSize: '1.5rem',
    marginBottom: '10px',
    color: '#333',
  },
  section: {
    marginBottom: '40px',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  listItem: {
    padding: '8px 0',
    fontSize: '1.1rem',
    borderBottom: '1px solid #eee',
  },
  chart: {
    display: 'flex',
    alignItems: 'flex-end',
    height: '200px',
    gap: '5px',
    background: '#f8f9fa',
    padding: '10px',
    overflowX: 'auto',
  },
  bar: {
    width: '20px',
    background: '#2196f3',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    position: 'relative',
  },
  barLabel: {
    fontSize: '0.7rem',
    color: '#fff',
    position: 'absolute',
    bottom: 0,
    transform: 'translateY(100%)',
  },
  input: {
    padding: '8px',
    fontSize: '1rem',
    marginRight: '10px',
    width: '250px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '8px 12px',
    fontSize: '1rem',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
  },
  resultCard: {
    background: '#f1f1f1',
    padding: '15px',
    borderRadius: '8px',
  },
  error: {
    color: 'red',
  },
};

export default Home;
