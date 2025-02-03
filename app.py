
# openai.api_key = "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"
# os.getenv("OPENAI_API_KEY")  # Store key in environment

from flask import Flask, request, jsonify, render_template
import os
from dotenv import load_dotenv  # Import the load_dotenv function
import requests
load_dotenv()   # Replace openai with requests

app = Flask(__name__)
GROQ_API_KEY = os.getenv("GROQ_API_KEY") 
# "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"
#   # Set GROQ_API_KEY in environment

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/generate-poem', methods=['POST'])
def generate_poem():
    data = request.json
    names = data['names']
    emotion = data['emotion']
    
    prompt = f"""
Create a bilingual poem with these requirements:
1. Include these names: {', '.join(names)}
2. Primary emotion: {emotion}
3. Format:
   - Hindi poem first using Devanagari script
   - Separator line with exactly "---"
   - English translation second
4. Use simple language with 4-6 line stanzas

Example:
[काव्य पंक्तियाँ यहाँ...]
---
[English poem lines here...]
"""
    
    try:
        # Groq API call
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama3-70b-8192",  # Use correct model name
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.7
            }
        )
        
        if response.status_code != 200:
            return jsonify({"error": f"Groq API error: {response.text}"}), 500
            
        poem = response.json()['choices'][0]['message']['content']
        return jsonify({"poem": poem})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)