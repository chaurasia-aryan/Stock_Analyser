import os
import json
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Configure Google Gemini API
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    logger.error("GEMINI_API_KEY environment variable not set")
    raise ValueError("GEMINI_API_KEY environment variable not set")

try:
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
    logger.info("Successfully configured Gemini API")
except Exception as e:
    logger.error(f"Failed to configure Gemini API: {str(e)}")
    raise

app = Flask(__name__)
# Enable CORS with additional options
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

@app.route("/")
def root():
    return jsonify({"message": "Stock Analysis API with Flask"})

@app.route("/analyze", methods=['POST', 'OPTIONS'])
def analyze_stock():
    if request.method == 'OPTIONS':
        return '', 204
        
    try:
        # Log incoming request
        logger.info("Received analyze request")
        
        # Handle both JSON and form data
        if request.is_json:
            data = request.get_json()
            ticker = data.get('ticker')
            avg_holding_price = data.get('avg_holding_price')
            logger.info(f"Received JSON request for ticker: {ticker} with avg price: {avg_holding_price}")
        else:
            ticker = request.form.get('ticker')
            avg_holding_price = request.form.get('avg_holding_price')
            if avg_holding_price:
                avg_holding_price = float(avg_holding_price)
            logger.info(f"Received form data request for ticker: {ticker} with avg price: {avg_holding_price}")
        
        if not ticker:
            logger.warning("No ticker provided in request")
            return jsonify({"error": "Ticker is required"}), 400

        logger.info(f"Analyzing ticker: {ticker}")
        
        # Add avg holding price context to prompt if provided
        avg_price_context = ""
        if avg_holding_price:
            avg_price_context = f"""
            The user has an average holding price of ₹{avg_holding_price:.2f} for this stock.
            Based on this information, provide specific recommendations:
            - If they are in profit, advise whether to:
              * Book complete profit
              * Book partial profit and hold remaining
              * Hold entire position
              * Add more to position
            - If they are in loss, advise whether to:
              * Book the loss
              * Average down by buying more
              * Hold and wait for recovery
            Consider factors like:
            - Percentage of profit/loss
            - Current market conditions
            - Stock's future prospects
            - Risk factors
            """

        # Comprehensive prompt for Gemini
        prompt = f"""
        Analyze the Indian stock {ticker} (from NSE/BSE) and provide comprehensive information in JSON format.
        {avg_price_context}
        Include:

        1. Basic Information:
           - Full company name
           - Current stock price (in INR)
           - Recent price changes
           - Trading volume
           - Exchange (NSE/BSE)

        2. Key Financial Metrics:
           - Market capitalization (in Crores/Lakhs)
           - P/E ratio
           - Dividend yield
           - 52-week price range
           - Revenue and earnings trends
           - Book value
           - ROCE (Return on Capital Employed)
           - Debt to Equity ratio

        3. Shareholding Pattern:
           - FII (Foreign Institutional Investors) holdings percentage
           - DII (Domestic Institutional Investors) holdings percentage
           - Promoter holdings percentage
           - Public holdings percentage
           - Quarter-on-quarter change in institutional holdings

        4. Technical Indicators:
           - RSI (Relative Strength Index)
           - Moving averages (50-day and 200-day)
           - Volume trend
           - Support and resistance levels
           - Technical patterns identified

        5. Industry Analysis:
           - Sector performance
           - Peer comparison
           - Market share
           - Competitive position

        6. Risk Assessment:
           - Company-specific risks
           - Industry risks
           - Economic risks
           - Regulatory risks

        7. Stock Rating:
           - Overall rating (1-100 scale)
           - Individual component scores:
             * Financial health (1-100)
             * Growth prospects (1-100)
             * Management quality (1-100)
             * Valuation (1-100)
             * Technical strength (1-100)

        Format the response as a JSON object with these fields:
        {{
            "company_name": "Full company name",
            "ticker": "{ticker}",
            "exchange": "NSE or BSE",
            "current_price": "Current price in INR",
            "day_change": "Recent price change in INR",
            "day_change_percent": "Percentage change",
            "market_cap": "Market capitalization (use Cr for Crores, L for Lakhs)",
            "pe_ratio": "Price to earnings ratio",
            "dividend_yield": "Current dividend yield with %",
            "fifty_two_week_range": "52-week low - high range in INR",
            "volume": "Trading volume",
            "book_value": "Book value per share in INR",
            "roce": "Return on Capital Employed in %",
            "debt_equity": "Debt to Equity ratio",
            "shareholding_pattern": {{
                "fii_holding": "FII holding %",
                "dii_holding": "DII holding %",
                "promoter_holding": "Promoter holding %",
                "public_holding": "Public holding %",
                "holding_changes": "Quarter-on-quarter changes"
            }},
            "technical_indicators": {{
                "rsi": "RSI value",
                "moving_avg_50": "50-day MA in INR",
                "moving_avg_200": "200-day MA in INR",
                "volume_trend": "Volume trend analysis",
                "support_levels": ["Support price levels in INR"],
                "resistance_levels": ["Resistance price levels in INR"],
                "patterns": ["Identified technical patterns"]
            }},
            "industry_analysis": {{
                "sector_performance": "Sector performance analysis",
                "peer_comparison": "Comparison with peers",
                "market_share": "Market share details",
                "competitive_position": "Competitive position analysis"
            }},
            "risk_assessment": {{
                "company_risks": ["List of company-specific risks"],
                "industry_risks": ["List of industry risks"],
                "economic_risks": ["List of economic risks"],
                "regulatory_risks": ["List of regulatory risks"]
            }},
            "stock_rating": {{
                "overall_rating": "Rating between 1-100",
                "financial_health": "Score between 1-100",
                "growth_prospects": "Score between 1-100",
                "management_quality": "Score between 1-100",
                "valuation": "Score between 1-100",
                "technical_strength": "Score between 1-100"
            }},
            "personal_position": {{
                "avg_holding_price": "User's average holding price in INR",
                "current_return": "Percentage return on investment",
                "return_amount": "Absolute return amount in INR",
                "position_advice": "Detailed advice based on current position",
                "action_items": ["List of recommended actions"]
            }},
            "analysis": "Detailed analysis including all aspects mentioned above",
            "recommendation": "Buy/Hold/Sell with brief reasoning"
        }}

        Make sure all numerical values are realistic and current. If exact values aren't available, provide reasonable estimates based on recent market data. Format numbers appropriately:
        - Market cap in crores/lakhs (e.g., "₹2,500 Cr" or "₹85 L")
        - P/E ratio as a number (e.g., "25.3")
        - Dividend yield as percentage (e.g., "2.5%")
        - 52-week range as "low - high" (e.g., "₹125.30 - ₹198.45")
        - All currency values should be in INR (₹)
        - Ratings should be integers between 1-100
        """
        
        logger.info("Sending request to Gemini API")
        response = model.generate_content(prompt)
        text = response.text
        logger.info("Received response from Gemini API")
        
        # Parse AI response
        try:
            json_start = text.find('{')
            json_end = text.rfind('}') + 1
            if json_start != -1 and json_end != 0:
                json_str = text[json_start:json_end]
                analysis_data = json.loads(json_str)
                
                # Ensure all required fields are present
                required_fields = [
                    'company_name', 'ticker', 'exchange', 'current_price', 'day_change', 
                    'day_change_percent', 'market_cap', 'pe_ratio', 
                    'dividend_yield', 'fifty_two_week_range', 'volume',
                    'book_value', 'roce', 'debt_equity', 'shareholding_pattern',
                    'technical_indicators', 'industry_analysis', 'risk_assessment',
                    'stock_rating', 'analysis', 'recommendation'
                ]
                for field in required_fields:
                    if field not in analysis_data:
                        analysis_data[field] = "N/A"
                
                # Handle analysis field if it's an object
                if isinstance(analysis_data.get('analysis'), dict):
                    analysis_sections = []
                    if 'company_overview' in analysis_data['analysis']:
                        analysis_sections.append(f"Company Overview:\n{analysis_data['analysis']['company_overview']}")
                    if 'business_model' in analysis_data['analysis']:
                        analysis_sections.append(f"Business Model:\n{analysis_data['analysis']['business_model']}")
                    if 'recent_performance' in analysis_data['analysis']:
                        analysis_sections.append(f"Recent Performance:\n{analysis_data['analysis']['recent_performance']}")
                    if 'market_trends' in analysis_data['analysis']:
                        analysis_sections.append(f"Market Trends:\n{analysis_data['analysis']['market_trends']}")
                    if 'key_strengths' in analysis_data['analysis']:
                        analysis_sections.append(f"Key Strengths:\n{analysis_data['analysis']['key_strengths']}")
                    if 'competitive_advantages' in analysis_data['analysis']:
                        analysis_sections.append(f"Competitive Advantages:\n{analysis_data['analysis']['competitive_advantages']}")
                    if 'potential_risks' in analysis_data['analysis']:
                        analysis_sections.append(f"Potential Risks:\n{analysis_data['analysis']['potential_risks']}")
                    if 'future_growth_prospects' in analysis_data['analysis']:
                        analysis_sections.append(f"Future Growth Prospects:\n{analysis_data['analysis']['future_growth_prospects']}")
                    
                    analysis_data['analysis'] = "\n\n".join(analysis_sections)
                elif not isinstance(analysis_data.get('analysis'), str):
                    analysis_data['analysis'] = "Analysis not available"

                # Convert string numbers to float where applicable
                try:
                    if isinstance(analysis_data['current_price'], str):
                        analysis_data['current_price'] = float(analysis_data['current_price'].replace('₹', '').replace(',', ''))
                except (ValueError, TypeError):
                    analysis_data['current_price'] = 0.0

                try:
                    if isinstance(analysis_data['day_change'], str):
                        analysis_data['day_change'] = float(analysis_data['day_change'].replace('₹', '').replace(',', ''))
                except (ValueError, TypeError):
                    analysis_data['day_change'] = 0.0

                try:
                    if isinstance(analysis_data['day_change_percent'], str):
                        analysis_data['day_change_percent'] = float(analysis_data['day_change_percent'].replace('%', ''))
                except (ValueError, TypeError):
                    analysis_data['day_change_percent'] = 0.0

                try:
                    if isinstance(analysis_data['pe_ratio'], str) and analysis_data['pe_ratio'] != 'N/A':
                        analysis_data['pe_ratio'] = float(analysis_data['pe_ratio'].replace(',', ''))
                except (ValueError, TypeError):
                    analysis_data['pe_ratio'] = 'N/A'

                try:
                    if isinstance(analysis_data['dividend_yield'], str) and analysis_data['dividend_yield'] != 'N/A':
                        analysis_data['dividend_yield'] = analysis_data['dividend_yield'].rstrip('%')
                except (ValueError, TypeError):
                    analysis_data['dividend_yield'] = 'N/A'

                # Ensure market_cap is properly formatted
                if isinstance(analysis_data['market_cap'], (int, float)):
                    if analysis_data['market_cap'] >= 1e12:
                        analysis_data['market_cap'] = f"₹{analysis_data['market_cap']/1e12:.2f}T"
                    elif analysis_data['market_cap'] >= 1e9:
                        analysis_data['market_cap'] = f"₹{analysis_data['market_cap']/1e9:.2f}B"
                    elif analysis_data['market_cap'] >= 1e6:
                        analysis_data['market_cap'] = f"₹{analysis_data['market_cap']/1e6:.2f}M"
                    else:
                        analysis_data['market_cap'] = f"₹{analysis_data['market_cap']:,.2f}"

                # Ensure recommendation is capitalized and clean
                if analysis_data['recommendation']:
                    analysis_data['recommendation'] = analysis_data['recommendation'].strip().capitalize()

                logger.info(f"Successfully analyzed {ticker}")
                return jsonify(analysis_data)
            else:
                raise ValueError("No JSON found in response")
                
        except Exception as e:
            logger.error(f"Error parsing Gemini response: {str(e)}")
            return jsonify({
                "error": "Failed to parse analysis",
                "detail": "Could not process the AI response"
            }), 500
            
    except Exception as e:
        logger.error(f"Error during /analyze for ticker {ticker if 'ticker' in locals() else 'unknown'}: {str(e)}")
        return jsonify({
            "error": "An internal server error occurred",
            "detail": str(e)
        }), 500

if __name__ == "__main__":
    logger.info("Starting Flask server...")
    app.run(host="0.0.0.0", port=8000, debug=True)