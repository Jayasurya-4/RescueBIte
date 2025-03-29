from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import openai

app = Flask(__name__)
CORS(app)  # Allow frontend to access backend

# OpenAI API Key (replace with your actual key)
openai.api_key = "your_openai_api_key"

db = mysql.connector.connect(
    host="localhost",
    user="Admin",
    password="protectmyacnt",
    database="RescueBiteDB"  # Change this to your actual database name
)


cursor = db.cursor()

# AI Chatbot API (Updated for OpenAI v1)
@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        if not data or "message" not in data:
            return jsonify({"error": "Invalid request. 'message' field is required."}), 400

        user_message = data["message"]

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an AI chef assisting hotels and vendors with recipes."},
                {"role": "user", "content": user_message}
            ]
        )
        
        bot_reply = response.choices[0].message.content  # Updated Syntax
        return jsonify({"response": bot_reply})

    except openai.OpenAIError as e:  # Corrected Exception Handling
        return jsonify({"error": str(e)}), 500

    except Exception as e:
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500

# Run Flask App
if __name__ == "__main__":
    app.run(debug=True)
