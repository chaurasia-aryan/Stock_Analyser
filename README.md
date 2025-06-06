# Stock Analysis Dashboard
This is a personal project I built to get AI-driven support for my stock market decisions. It’s a web-based dashboard that analyzes stocks listed on NSE and BSE, providing real-time insights, key financial metrics, market trends, and AI-generated recommendations to help inform smarter investment choices.

## Features

- Real-time stock analysis 
- AI-powered insights and recommendations
- Comprehensive financial metrics (P/E ratio, market cap in Cr/L, dividend yield)
- Beautiful and responsive UI with Tailwind CSS


## Tech Stack

- Frontend:
  - React.js
  - Tailwind CSS
  - React Icons

- Backend:
  - Flask (Python)
  - Google Gemini AI API
  - Flask-CORS

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv env
   source env/bin/activate  # For Unix/macOS
   .\env\Scripts\activate  # For Windows
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

5. Run the backend server:
   ```bash
   python main.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## Usage

1. Enter a stock symbol (e.g., "TATAMOTORS.NS" for NSE or "TATAMOTORS.BO" for BSE)
2. View comprehensive analysis including:
   - Current price and changes
   - Market capitalization in Crores/Lakhs
   - P/E ratio and dividend yield
   - 52-week range
   - AI-generated analysis and recommendations

## Note

This application uses AI-generated analysis. Always conduct your own research and consult financial advisors before making investment decisions.

## License

MIT