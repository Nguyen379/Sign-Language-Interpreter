from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv
import base64
from PIL import Image
import io

app = Flask(__name__, static_folder='static')
CORS(app)

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))
model = genai.GenerativeModel('gemini-pro-vision')

@app.route('/')
def home():
    return send_from_directory('static', 'index.html')

@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

@app.route('/interpret', methods=['POST'])
def interpret_sign():
    try:
        # Get image data from request
        image_data = request.json['image'].split(',')[1]
        image_bytes = base64.b64decode(image_data)
        
        # Convert to PIL Image
        image = Image.open(io.BytesIO(image_bytes))
        
        # Generate interpretation
        prompt = """
        Analyze this image and interpret the sign language gesture shown.
        If you can identify a specific sign language gesture, provide:
        1. The meaning of the sign
        2. Which sign language system it's from (ASL, BSL, etc.)
        If no clear gesture is detected, please indicate that.
        """
        
        response = model.generate_content([prompt, image])
        interpretation = response.text
        
        return jsonify({"interpretation": interpretation})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)