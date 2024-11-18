from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv
import base64
from PIL import Image
import io

app = Flask(__name__, static_folder='static')
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5000", "http://127.0.0.1:5000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})
# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))
model = genai.GenerativeModel('gemini-1.5-flash')

@app.route('/')
def home():
    return send_from_directory('static', 'index.html')

@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

@app.route('/interpret', methods=['POST'])
def interpret_sign():
    try:
        # Get request data
        data = request.json
        image_data = data['image'].split(',')[1]
        mode = data.get('mode', 'practice')
        expected_sign = data.get('expectedSign')
        
        # Convert to PIL Image
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))

        if mode == 'learning':
            prompt = f"""
            You are analyzing an ASL fingerspelling attempt for letter '{expected_sign}'.
            Provide feedback in exactly this format:

            Accuracy: [X]%

            Correct:
            - [Point 1]
            - [Point 2]

            Needs Work:
            - [Point 1]
            - [Point 2]

            Tip:
            [One specific, clear practice tip]

            Use bullet points and keep feedback concise.
            """
        else:
            prompt = """
            Analyze this sign language gesture and provide feedback in this format:

            Sign Detected: 
            [Describe what sign/number/letter you see]

            Sign Language System:
            [Specify which sign language system, e.g., ASL, BSL]

            Additional Info:
            [Any additional relevant information about the sign's usage or meaning]

            If no clear gesture is detected, please indicate that.
            """
        
        response = model.generate_content([prompt, image])
        interpretation = response.text
        
        return jsonify({
            "interpretation": interpretation,
            "mode": mode,
            "expectedSign": expected_sign if mode == 'learning' else None
        })
        
    except Exception as e:
        print(f"Error: {str(e)}")  # Server-side logging
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)