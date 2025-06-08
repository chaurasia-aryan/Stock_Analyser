#This is a test file to check if your \ Gemini API is working
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("Error: Missing Gemini API key in environment or .env file")
else:
    try:
        # Show last 4 chars for key verification
        print(f"Setting up Gemini API with key: ...{api_key[-4:]}")
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Quick test to verify API works
        prompt = "Tell me a fun fact about the Roman Empire."
        print(f"\nTesting with prompt: '{prompt}'")
        response = model.generate_content(prompt)
        #you should get a paragraph of text as a response
        print("\nGemini API Test Successful!")
        print("Response:")
        print(response.text)
        
    except Exception as e:
        print("\nGemini API Test Failed!")
        print(f"Error: {e}")
