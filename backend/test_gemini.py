import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv() # Load environment variables from .env

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("Error: GEMINI_API_KEY environment variable not set or .env file not found.")
else:
    try:
        print(f"Attempting to configure Gemini API with key: ...{api_key[-4:]}") # Print last 4 chars for partial confirmation
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash') # Or your preferred model
        
        # Make a simple test call
        prompt = "Tell me a fun fact about the Roman Empire."
        print(f"\nSending test prompt: '{prompt}'")
        response = model.generate_content(prompt)
        
        print("\nGemini API Test Successful!")
        print("Response:")
        print(response.text)
        
    except Exception as e:
        print("\nGemini API Test Failed!")
        print(f"Error: {e}")
