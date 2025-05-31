import React from 'react';
import { FaArrowUp, FaArrowDown, FaInfoCircle } from 'react-icons/fa';

function StockInfo({ stockData }) {
  const {
    company_name,
    ticker,
    current_price,
    day_change,
    day_change_percent,
    market_cap,
    pe_ratio,
    dividend_yield,
    fifty_two_week_range,
    volume,
    analysis,
    recommendation,
    exchange
  } = stockData;

  const formatCurrency = (value) => {
    if (value === null || value === undefined || isNaN(value)) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatLargeNumber = (value) => {
    if (value === null || value === undefined || isNaN(value)) return 'N/A';
    
    if (value >= 1e12) {
      return `₹${(value / 1e12).toFixed(2)}T`;
    } else if (value >= 1e9) {
      return `₹${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e7) {
      return `₹${(value / 1e7).toFixed(2)}Cr`;
    } else if (value >= 1e5) {
      return `₹${(value / 1e5).toFixed(2)}L`;
    } else {
      return `₹${value.toLocaleString('en-IN')}`;
    }
  };

  const formatPercent = (value) => {
    if (value === null || value === undefined || isNaN(value)) return 'N/A';
    return `${value.toFixed(2)}%`;
  };

  const formatPERatio = (value) => {
    if (value === null || value === undefined || isNaN(value) || value === 'N/A') return 'N/A';
    const numValue = parseFloat(value);
    return numValue.toFixed(2);
  };

  const getRecommendationClass = () => {
    if (!recommendation) return 'bg-gray-100 text-gray-800';
    const lowerRec = recommendation.toLowerCase();
    if (lowerRec.includes('buy')) return 'bg-green-100 text-green-800';
    if (lowerRec.includes('hold')) return 'bg-yellow-100 text-yellow-800';
    if (lowerRec.includes('sell')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="stock-card mt-8 bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{company_name || 'N/A'}</h2>
            <div className="flex items-center">
              <p className="text-gray-500">{ticker}</p>
              {exchange && <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">{exchange}</span>}
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="text-3xl font-bold">{formatCurrency(current_price)}</div>
            <div className={`flex items-center ${day_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {day_change >= 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
              <span>
                {formatCurrency(Math.abs(day_change))} 
                ({day_change_percent ? Math.abs(day_change_percent).toFixed(2) : '0.00'}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Stats */}
      <div className="p-6 bg-gray-50">
        <h3 className="text-lg font-semibold mb-4">Key Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-3 rounded shadow-sm">
            <p className="text-sm text-gray-500">Market Cap</p>
            <p className="font-medium">{market_cap || 'N/A'}</p>
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <p className="text-sm text-gray-500">P/E Ratio</p>
            <p className="font-medium">{formatPERatio(pe_ratio)}</p>
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <p className="text-sm text-gray-500">Dividend Yield</p>
            <p className="font-medium">{dividend_yield || 'N/A'}</p>
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <p className="text-sm text-gray-500">52-Week Range</p>
            <p className="font-medium text-sm">{fifty_two_week_range || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* AI Analysis */}
      <div className="p-6">
        <div className="flex items-center mb-4">
          <FaInfoCircle className="text-indigo-600 mr-2" />
          <h3 className="text-lg font-semibold">AI Analysis</h3>
        </div>
        <p className="text-gray-700 mb-6 whitespace-pre-line">{analysis || 'No analysis available.'}</p>
        
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Recommendation</h3>
          <div className={`inline-block px-4 py-2 rounded-full font-medium ${getRecommendationClass()}`}>
            {recommendation || 'No recommendation available'}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-gray-50 text-xs text-gray-500 border-t border-gray-200">
        <p>This analysis is generated by AI and should not be considered as financial advice. Always do your own research before making investment decisions. Stock data is from Indian markets (NSE/BSE).</p>
      </div>
    </div>
  );
}

export default StockInfo;