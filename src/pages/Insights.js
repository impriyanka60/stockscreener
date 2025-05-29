import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';

const Insights = () => {
  const [stocks, setStocks] = useState([]);
  const [category, setCategory] = useState('gainers');
  const [error, setError] = useState(null);
  const API_KEY = process.env.REACT_APP_FMP_API_KEY;

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await fetch(
          `https://financialmodelingprep.com/api/v3/stock_market/${category}?apikey=${API_KEY}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch market data');
        }
        const data = await response.json();
        setStocks(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchStocks();
  }, [category, API_KEY]);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  if (error) return <div style={styles.error}>Error: {error}</div>;
  if (stocks.length === 0) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📊 Market Insights - {category.charAt(0).toUpperCase() + category.slice(1)}</h2>

      <select onChange={handleCategoryChange} value={category} style={styles.select}>
        <option value="gainers">Top Gainers</option>
        <option value="losers">Top Losers</option>
        <option value="actives">Most Active</option>
      </select>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={stocks.slice(0, 10)} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="ticker" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="price" fill="#8884d8" name="Price ($)" />
        </BarChart>
      </ResponsiveContainer>

      <ul style={styles.list}>
        {stocks.map((stock) => (
          <li key={stock.ticker} style={styles.listItem}>
            <strong>{stock.companyName}</strong> ({stock.ticker}) — 
            <span style={styles.price}> ${stock.price}</span> 
            <span style={styles.change}> {stock.changesPercentage}</span>
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
  title: {
    fontSize: '1.8rem',
    marginBottom: '10px',
    color: '#0a3d62',
  },
  select: {
    padding: '8px 12px',
    fontSize: '1rem',
    marginBottom: '20px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  listItem: {
    fontSize: '1.1rem',
    margin: '8px 0',
    background: '#f1f2f6',
    padding: '10px',
    borderRadius: '6px',
  },
  price: {
    color: '#2ecc71',
    marginLeft: '10px',
  },
  change: {
    color: '#27ae60',
    marginLeft: '5px',
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
  },
  loading: {
    fontStyle: 'italic',
  },
};

export default Insights;
