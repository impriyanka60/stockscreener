import React from "react";
import "./StockCard.css";

const StockCard = ({ symbol, name, price, change }) => {
  return (
    <div className="stock-card">
      <h3 className="stock-name">{name} ({symbol})</h3>
      <p className="stock-price">${price}</p>
      <p className={`stock-change ${change >= 0 ? 'positive' : 'negative'}`}>
        {change.toFixed(2)}%
      </p>
    </div>
  );
};

export default StockCard;
