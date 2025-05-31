import React from 'react';
import { FaChartLine } from 'react-icons/fa';

function Header() {
  return (
    <header className="bg-indigo-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FaChartLine className="text-2xl" />
          <span className="text-xl font-bold">StockAI</span>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <a href="#" className="hover:text-indigo-200 transition-colors">
                Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-indigo-200 transition-colors">
                About
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;