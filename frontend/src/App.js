import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import StockSearch from './components/StockSearch';
import StockInfo from './components/StockInfo';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (ticker) => {
    setLoading(true);
    setError(null);
    
    try {
      // First try with JSON
      const response = await axios({
        method: 'post',
        url: 'http://localhost:8000/analyze',
        data: { ticker },
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      setStockData(response.data);
    } catch (err) {
      console.error('Error fetching stock data:', err);
      
      try {
        // Fallback to FormData if JSON fails
        const formData = new FormData();
        formData.append('ticker', ticker);
        
        const formResponse = await axios({
          method: 'post',
          url: 'http://localhost:8000/analyze',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        setStockData(formResponse.data);
      } catch (formErr) {
        console.error('FormData request also failed:', formErr);
        setError(
          formErr.response?.data?.detail || 
          formErr.response?.data?.error || 
          'Failed to fetch stock data. Please try again.'
        );
        setStockData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
              AI-Powered Stock Analysis Dashboard
            </h1>
            
            <StockSearch onSearch={handleSearch} loading={loading} />
            
            {error && (
              <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                <p className="font-semibold">Error:</p>
                <p>{error}</p>
              </div>
            )}
            
            {stockData && !error && (
              <StockInfo stockData={stockData} />
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;