import React from 'react';
import { FaArrowUp, FaArrowDown, FaInfoCircle, FaChartLine, FaUsers, FaShieldAlt } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell } from 'recharts';

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
    book_value,
    roce,
    debt_equity,
    shareholding_pattern,
    technical_indicators,
    industry_analysis,
    risk_assessment,
    stock_rating,
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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const shareholdingData = [
    { name: 'FII', value: parseFloat(shareholding_pattern?.fii_holding) || 0 },
    { name: 'DII', value: parseFloat(shareholding_pattern?.dii_holding) || 0 },
    { name: 'Promoter', value: parseFloat(shareholding_pattern?.promoter_holding) || 0 },
    { name: 'Public', value: parseFloat(shareholding_pattern?.public_holding) || 0 }
  ];

  const ratingData = [
    { subject: 'Financial Health', value: parseInt(stock_rating?.financial_health) || 0 },
    { subject: 'Growth', value: parseInt(stock_rating?.growth_prospects) || 0 },
    { subject: 'Management', value: parseInt(stock_rating?.management_quality) || 0 },
    { subject: 'Valuation', value: parseInt(stock_rating?.valuation) || 0 },
    { subject: 'Technical', value: parseInt(stock_rating?.technical_strength) || 0 }
  ];

  return (
    <div className="stock-card mt-8 bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
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

      {/* Overall Rating */}
      <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Overall Rating</h3>
          <div className="text-3xl font-bold text-purple-600">
            {stock_rating?.overall_rating || 'N/A'}/100
          </div>
        </div>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={ratingData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name="Rating" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Stats */}
      <div className="p-6 bg-gray-50">
        <h3 className="text-lg font-semibold mb-4">Key Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded shadow-sm">
            <p className="text-sm text-gray-500">Market Cap</p>
            <p className="font-medium">{market_cap || 'N/A'}</p>
          </div>
          <div className="bg-white p-4 rounded shadow-sm">
            <p className="text-sm text-gray-500">P/E Ratio</p>
            <p className="font-medium">{formatPERatio(pe_ratio)}</p>
          </div>
          <div className="bg-white p-4 rounded shadow-sm">
            <p className="text-sm text-gray-500">ROCE</p>
            <p className="font-medium">{roce || 'N/A'}</p>
          </div>
          <div className="bg-white p-4 rounded shadow-sm">
            <p className="text-sm text-gray-500">Debt/Equity</p>
            <p className="font-medium">{debt_equity || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Shareholding Pattern */}
      <div className="p-6 border-t border-gray-200">
        <div className="flex items-center mb-4">
          <FaUsers className="text-indigo-600 mr-2" />
          <h3 className="text-lg font-semibold">Shareholding Pattern</h3>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={shareholdingData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {shareholdingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-gray-500 mt-2">{shareholding_pattern?.holding_changes || 'No recent changes'}</p>
      </div>

      {/* Technical Indicators */}
      <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-green-50 to-teal-50">
        <div className="flex items-center mb-4">
          <FaChartLine className="text-green-600 mr-2" />
          <h3 className="text-lg font-semibold">Technical Indicators</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded shadow-sm">
            <p className="text-sm text-gray-500">RSI</p>
            <p className="font-medium">{technical_indicators?.rsi || 'N/A'}</p>
          </div>
          <div className="bg-white p-4 rounded shadow-sm">
            <p className="text-sm text-gray-500">50-Day MA</p>
            <p className="font-medium">{technical_indicators?.moving_avg_50 || 'N/A'}</p>
          </div>
          <div className="bg-white p-4 rounded shadow-sm">
            <p className="text-sm text-gray-500">200-Day MA</p>
            <p className="font-medium">{technical_indicators?.moving_avg_200 || 'N/A'}</p>
          </div>
          <div className="bg-white p-4 rounded shadow-sm">
            <p className="text-sm text-gray-500">Volume Trend</p>
            <p className="font-medium">{technical_indicators?.volume_trend || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="p-6 border-t border-gray-200">
        <div className="flex items-center mb-4">
          <FaShieldAlt className="text-red-600 mr-2" />
          <h3 className="text-lg font-semibold">Risk Assessment</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded shadow-sm">
            <p className="text-sm font-medium text-gray-700">Company Risks</p>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {risk_assessment?.company_risks?.map((risk, index) => (
                <li key={index}>{risk}</li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-4 rounded shadow-sm">
            <p className="text-sm font-medium text-gray-700">Industry Risks</p>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {risk_assessment?.industry_risks?.map((risk, index) => (
                <li key={index}>{risk}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* AI Analysis */}
      <div className="p-6 border-t border-gray-200">
        <div className="flex items-center mb-4">
          <FaInfoCircle className="text-indigo-600 mr-2" />
          <h3 className="text-lg font-semibold">AI Analysis</h3>
        </div>
        <p className="text-gray-700 mb-6 whitespace-pre-line">{analysis || 'No analysis available.'}</p>
        
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Recommendation</h3>
          <div className={`inline-block px-6 py-3 rounded-full font-medium text-lg ${getRecommendationClass()}`}>
            {recommendation || 'No recommendation available'}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-gray-50 text-xs text-gray-500 border-t border-gray-200">
        <p>This analysis is generated by AI and should not be considered as financial advice. Always conduct your own research and consult financial advisors before making investment decisions. Stock data is from Indian markets (NSE/BSE).</p>
      </div>
    </div>
  );
}

export default StockInfo;