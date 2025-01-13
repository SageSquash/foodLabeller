import os
from dotenv import load_dotenv
import google.generativeai as genai

# Add debugging
# print("Current working directory:", os.getcwd())
# print("Environment variables:", os.environ.keys())

load_dotenv()

# Add more debugging
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
print("API Key found:", "Yes" if GOOGLE_API_KEY else "No")

if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY not found in environment variables")

genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash-exp')