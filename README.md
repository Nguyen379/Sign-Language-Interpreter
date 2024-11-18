# Sign Language Interpreter

A real-time sign language interpretation system that uses computer vision and AI to recognize and translate American Sign Language (ASL) gestures. The application features both practice and learning modes to help users learn and improve their sign language skills.

## Features

- **Practice Mode**
  - Real-time sign language interpretation
  - Webcam-based gesture recognition
  - Instant feedback on detected signs

- **Learning Mode**
  - Structured lessons for ASL alphabet, numbers, and basic phrases
  - Interactive practice sessions
  - Visual reference guides
  - Progress tracking
  - Immediate feedback on sign accuracy

## Technologies Used

- Frontend:
  - HTML5
  - CSS3
  - JavaScript 
  - Webcam API

- Backend:
  - Python
  - Flask
  - Google Gemini AI API
  - PIL (Python Imaging Library)

## Setup and Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Sign-Language-Interpreter.git
cd Sign-Language-Interpreter
```

2. Create `.env` file. Copy from `.env.example` and fill in the Google Gemini API key

3. Set up conda environment.
```bash
conda create -n sign_language_interpreter python=3.9
conda activate sign_language_interpreter
conda install flask=3.0.3 flask-cors python-dotenv pillow
pip install google-generativeai==0.8.3 pydantic==2.9.2
```

4. Run the application
```bash
python server.py
```