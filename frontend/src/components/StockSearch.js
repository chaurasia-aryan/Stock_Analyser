import React, { useState } from 'react';
import { FaSearch, FaSpinner } from 'react-icons/fa';

function StockSearch({ onSearch }) {
  const [ticker, setTicker] = useState('');
  const [avgPrice, setAvgPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ticker) {
      setError('Please enter a stock symbol');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ticker,
          avg_holding_price: avgPrice ? parseFloat(avgPrice) : null
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stock data');
      }

      const data = await response.json();
      onSearch(data);
    } catch (err) {
      setError('Failed to analyze stock. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <label htmlFor="ticker" className="block text-sm font-medium text-gray-700 mb-1">
              Stock Symbol
            </label>
            <div className="relative">
              <input
                type="text"
                id="ticker"
                placeholder="Enter stock symbol (e.g., TATAMOTORS.NS)"
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="md:w-1/3">
            <label htmlFor="avgPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Average Holding Price (Optional)
            </label>
            <input
              type="number"
              id="avgPrice"
              placeholder="₹ Enter price"
              value={avgPrice}
              onChange={(e) => setAvgPrice(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-2 text-white font-medium rounded-lg transition-colors
              ${isLoading 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <FaSpinner className="animate-spin mr-2" />
                Analyzing...
              </span>
            ) : (
              <span className="flex items-center">
                <FaSearch className="mr-2" />
                Analyze Stock
              </span>
            )}
          </button>
        </div>

        {error && (
          <div className="text-red-600 text-center text-sm">{error}</div>
        )}
      </form>
    </div>
  );
}

export default StockSearch;