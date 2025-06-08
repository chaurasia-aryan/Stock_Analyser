import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} StockAI Dashboard
            </p>
          </div>
          <div className="text-sm text-gray-400">
            <p>Powered by Google Gemini AI</p>
            <p className="mt-1">Not financial advice - use responsibly</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;