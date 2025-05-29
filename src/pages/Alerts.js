import React, { useState } from 'react';

const Alerts = () => {
  const [symbol, setSymbol] = useState('');
  const [price, setPrice] = useState('');
  const [alerts, setAlerts] = useState([]);

  const handleAddAlert = () => {
    if (symbol && price) {
      setAlerts([...alerts, { symbol, price }]);
      setSymbol('');
      setPrice('');
    }
  };

  return (
    <div className="alerts">
      <h2>Price Alerts</h2>
      <div>
        <input
          type="text"
          placeholder="Stock Symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
        />
        <input
          type="number"
          placeholder="Target Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button onClick={handleAddAlert}>Add Alert</button>
      </div>
      <ul>
        {alerts.map((alert, index) => (
          <li key={index}>
            Alert for {alert.symbol} at ${alert.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Alerts;
