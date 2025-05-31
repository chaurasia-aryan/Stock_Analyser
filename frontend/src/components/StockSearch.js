import React, { useState } from 'react';
import { FaSearch, FaSpinner } from 'react-icons/fa';

function StockSearch({ onSearch, loading }) {
  const [ticker, setTicker] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ticker.trim()) {
      onSearch(ticker.trim());
    }
  };

  return (
    <div className="mb-8">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex-grow relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            placeholder="Enter stock ticker (e.g., AAPL, MSFT, GOOGL)"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center disabled:bg-indigo-400"
          disabled={loading || !ticker.trim()}
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Analyzing...
            </>
          ) : (
            'Analyze Stock'
          )}
        </button>
      </form>
      <p className="mt-2 text-sm text-gray-500">
        Try searching for popular stocks like AAPL (Apple), MSFT (Microsoft), or AMZN (Amazon)
      </p>
    </div>
  );
}

export default StockSearch;