from flask import Flask, request, jsonify
from flask_cors import CORS
import openai

# Initialize Flask App
app = Flask(__name__)
CORS(app)  # Enable CORS

# OpenAI API Key (Replace with your actual key)
openai.api_key = "your_actual_api_key"

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message", "").strip()  # Trim whitespace

    if not user_message:
        return jsonify({"response": "Please enter a message."}), 400

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # Use "gpt-4" if available
            messages=[
                {"role": "system", "content": "You are a helpful AI chef assisting hotels and vendors."},
                {"role": "user", "content": user_message}
            ]
        )
        bot_reply = response["choices"][0]["message"]["content"]
        return jsonify({"response": bot_reply})
    except openai.error.OpenAIError as e:
        return jsonify({"response": "OpenAI API error.", "error": str(e)}), 500
    except Exception as e:
        return jsonify({"response": "An unexpected error occurred.", "error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
