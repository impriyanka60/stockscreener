import React, { useState, useEffect } from 'react';
import './compare.css'; // Assuming you have some CSS for styling
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Compare = () => {
  const [symbols, setSymbols] = useState(['AAPL', 'GOOGL']); // Default companies
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState(null);
  const [inputSymbols, setInputSymbols] = useState(['', '']); // For user input
  const [historicalData, setHistoricalData] = useState([]);

  const API_KEY = process.env.REACT_APP_FMP_API_KEY;

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch(
          `https://financialmodelingprep.com/api/v3/profile/${symbols.join(',')}?apikey=${API_KEY}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch company profiles');
        }
        const data = await response.json();
        // Ensure data is an array and contains results for both companies
        if (Array.isArray(data)) {
          setCompanies(data);
        } else {
          throw new Error('Invalid data structure');
        }
      } catch (err) {
        setError(err.message);
      }
    };
    const fetchHistoricalData = async () => {
  try {
    const results = await Promise.all(
      symbols.map(async (symbol) => {
        const res = await fetch(
          `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?serietype=line&timeseries=30&apikey=${API_KEY}`
        );
        if (!res.ok) throw new Error('Failed to fetch historical data');
        const json = await res.json();
        return {
          symbol,
          data: json.historical.reverse() // oldest to newest
        };
      })
    );
    setHistoricalData(results);
  } catch (err) {
    setError('Error fetching historical chart data');
  }
};

fetchHistoricalData();


    fetchCompanies();
  }, [symbols, API_KEY]);

  const handleInputChange = (e, index) => {
    const newSymbols = [...inputSymbols];
    newSymbols[index] = e.target.value;
    setInputSymbols(newSymbols);
  };

  const handleCompareClick = () => {
    // Only update the symbols if both inputs are not empty
    if (inputSymbols[0] && inputSymbols[1]) {
      setSymbols(inputSymbols);
    } else {
      setError('Please provide two stock symbols to compare');
    }
  };
  const chartData = {
  labels: historicalData[0]?.data.map((entry) => entry.date),
  datasets: historicalData.map((company, index) => ({
    label: company.symbol,
    data: company.data.map((entry) => entry.close),
    borderColor: index === 0 ? '#007bff' : '#28a745',
    fill: false,
    tension: 0.3,
  })),
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: '30-Day Stock Price Comparison',
    },
  },
};


  if (error) return <div>Error: {error}</div>;
  if (companies.length === 0) return <div>Loading...</div>;

  return (
    <div className="compare">
      <h2>Compare Companies</h2>
      
      {/* Input Fields for Stock Symbols */}
      <div className="input-symbols">
        <input
          type="text"
          value={inputSymbols[0]}
          onChange={(e) => handleInputChange(e, 0)}
          placeholder="Enter first stock symbol (e.g., AAPL)"
        />
        <input
          type="text"
          value={inputSymbols[1]}
          onChange={(e) => handleInputChange(e, 1)}
          placeholder="Enter second stock symbol (e.g., GOOGL)"
        />
        <button onClick={handleCompareClick}>Compare</button>
      </div>

      {/* Display Company Profiles in Table */}
      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Price</th>
            <th>Market Cap</th>
            <th>Sector</th>
            <th>Industry</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.symbol}>
              <td>{company.companyName}</td>
              <td>${company.price}</td>
              <td>{company.mktCap}</td>
              <td>{company.sector}</td>
              <td>{company.industry}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="chart-container" style={{ marginTop: '40px' }}>
  <h3 style={{ textAlign: 'center' }}>Stock Price Comparison</h3>
  {historicalData.length === 2 ? (
    <div className='chart-containeer'>
    <Line data={chartData} options={chartOptions} />
  </div>
  ) : (
    <p style={{ textAlign: 'center' }}>Loading chart...</p>
  )}
</div>

    </div>
  );
};

export default Compare;
