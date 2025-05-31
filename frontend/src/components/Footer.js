import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} StockAI Dashboard. All rights reserved.
            </p>
          </div>
          <div className="text-sm text-gray-400">
            <p>Powered by Google Gemini API</p>
            <p className="mt-1">This is not financial advice. Use at your own risk.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;