import React, { useEffect, useState } from 'react';

const Screener = () => {
  const [stocks, setStocks] = useState([]);
  const [error, setError] = useState(null);
  const [sector, setSector] = useState('Technology');
  const [minMarketCap, setMinMarketCap] = useState(10000000000);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('price');
  const API_KEY = process.env.REACT_APP_FMP_API_KEY;

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await fetch(
          `https://financialmodelingprep.com/api/v3/stock-screener?marketCapMoreThan=${minMarketCap}&sector=${sector}&limit=${limit}&apikey=${API_KEY}`
        );
        if (!response.ok) throw new Error('Failed to fetch stocks');
        const data = await response.json();

        const sortedData = [...data].sort((a, b) => {
          if (!a[sortBy] || !b[sortBy]) return 0;
          return b[sortBy] - a[sortBy];
        });

        setStocks(sortedData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchStocks();
  }, [API_KEY, sector, minMarketCap, limit, sortBy]);

  if (error) return <div style={styles.error}>Error: {error}</div>;
  if (stocks.length === 0) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>📊 Stock Screener</h2>

      <div style={styles.filterContainer}>
        <div style={styles.filterItem}>
          <label style={styles.label}>Sector: </label>
          <select value={sector} onChange={(e) => setSector(e.target.value)} style={styles.input}>
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Finance">Finance</option>
            <option value="Energy">Energy</option>
            <option value="Consumer Cyclical">Consumer Cyclical</option>
          </select>
        </div>

        <div style={styles.filterItem}>
          <label style={styles.label}>Min Market Cap: </label>
          <input
            type="number"
            value={minMarketCap}
            onChange={(e) => setMinMarketCap(Number(e.target.value))}
            style={styles.input}
          />
        </div>

        <div style={styles.filterItem}>
          <label style={styles.label}>Limit: </label>
          <input
            type="number"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            style={styles.input}
          />
        </div>

        <div style={styles.filterItem}>
          <label style={styles.label}>Sort By: </label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.input}>
            <option value="price">Price</option>
            <option value="marketCap">Market Cap</option>
            <option value="volume">Volume</option>
          </select>
        </div>

        <button
          onClick={() => {
            setSector('Technology');
            setMinMarketCap(10000000000);
            setLimit(10);
            setSortBy('price');
          }}
          style={styles.resetButton}
        >
          Reset Filters
        </button>
      </div>

      <ul style={styles.stockList}>
        {stocks.map((stock) => (
          <li key={stock.symbol} style={styles.stockItem}>
            <strong>{stock.companyName}</strong> ({stock.symbol}) – $
            {stock.price?.toFixed(2).toLocaleString()} 
            {stock.sector && (
              <span style={styles.sectorTag}>{stock.sector}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    fontSize: '2rem',
    marginBottom: '20px',
  },
  filterContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '15px',
    marginBottom: '20px',
  },
  filterItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  label: {
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  input: {
    padding: '5px',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  resetButton: {
    padding: '6px 12px',
    backgroundColor: '#d63031',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  stockList: {
    listStyleType: 'none',
    padding: 0,
  },
  stockItem: {
    margin: '10px 0',
    fontSize: '1.1rem',
  },
  sectorTag: {
    marginLeft: '10px',
    backgroundColor: '#74b9ff',
    color: 'white',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '0.85rem',
  },
  error: {
    color: 'red',
    fontSize: '1.2rem',
  },
  loading: {
    fontSize: '1.2rem',
    fontStyle: 'italic',
    color: '#636e72',
  },
};

export default Screener;
