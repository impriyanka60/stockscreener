import React, { useEffect, useState } from 'react';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState(['AAPL', 'MSFT', 'TSLA']);
  const [companies, setCompanies] = useState([]);
  const [newSymbol, setNewSymbol] = useState('');
  const [error, setError] = useState(null);
  const API_KEY = process.env.REACT_APP_FMP_API_KEY;

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch(
          `https://financialmodelingprep.com/api/v3/profile/${watchlist.join(',')}?apikey=${API_KEY}`
        );
        if (!response.ok) throw new Error('Failed to fetch watchlist companies');
        const data = await response.json();
        setCompanies(data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (watchlist.length > 0) {
      fetchCompanies();
    } else {
      setCompanies([]);
    }
  }, [watchlist, API_KEY]);
  useEffect(() => {
  const saved = localStorage.getItem('watchlist');
  if (saved) setWatchlist(JSON.parse(saved));
}, []);

useEffect(() => {
  localStorage.setItem('watchlist', JSON.stringify(watchlist));
}, [watchlist]);


  const handleAdd = () => {
    const symbol = newSymbol.trim().toUpperCase();
    if (symbol && !watchlist.includes(symbol)) {
      setWatchlist([...watchlist, symbol]);
      setNewSymbol('');
    }
  };

  const handleRemove = (symbolToRemove) => {
    setWatchlist(watchlist.filter((sym) => sym !== symbolToRemove));
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📈 My Watchlist</h2>

      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Enter symbol (e.g. NFLX)"
          value={newSymbol}
          onChange={(e) => setNewSymbol(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleAdd} style={styles.addButton}>Add</button>
      </div>

      {error && <div style={styles.error}>Error: {error}</div>}
      {companies.length === 0 ? (
        <div style={styles.loading}>Loading or empty watchlist...</div>
      ) : (
        <ul style={styles.list}>
          {companies.map((company) => (
            <li key={company.symbol} style={styles.listItem}>
              <strong>{company.companyName}</strong> ({company.symbol}) - ${company.price}
              <button
                onClick={() => handleRemove(company.symbol)}
                style={styles.removeButton}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '700px',
    margin: 'auto',
  },
  title: {
    fontSize: '1.8rem',
    marginBottom: '10px',
    color: '#2d3436',
  },
  inputContainer: {
    display: 'flex',
    marginBottom: '15px',
    gap: '10px',
  },
  input: {
    padding: '8px',
    fontSize: '1rem',
    flex: 1,
  },
  addButton: {
    padding: '8px 12px',
    backgroundColor: '#0984e3',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '4px',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  listItem: {
    background: '#dfe6e9',
    margin: '8px 0',
    padding: '10px',
    borderRadius: '6px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  removeButton: {
    padding: '6px 10px',
    backgroundColor: '#d63031',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '4px',
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
  },
  loading: {
    fontStyle: 'italic',
  },
};

export default Watchlist;
