import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const CompanyDetails = () => {
  const { symbol } = useParams();
  const [company, setCompany] = useState(null);
  const [error, setError] = useState(null);
  const API_KEY = process.env.REACT_APP_FMP_API_KEY;

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await fetch(
          `https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${API_KEY}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch company details');
        }
        const data = await response.json();
        setCompany(data[0]);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCompany();
  }, [symbol, API_KEY]);

  if (error) return <div>Error: {error}</div>;
  if (!company) return <div>Loading...</div>;

  return (
    <div className="company-details">
      <h2>{company.companyName} ({company.symbol})</h2>
      <img src={company.image} alt={`${company.companyName} logo`} />
      <p><strong>Industry:</strong> {company.industry}</p>
      <p><strong>Sector:</strong> {company.sector}</p>
      <p><strong>CEO:</strong> {company.ceo}</p>
      <p><strong>Website:</strong> <a href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a></p>
      <p><strong>Description:</strong> {company.description}</p>
    </div>
  );
};

export default CompanyDetails;
