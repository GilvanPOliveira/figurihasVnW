from flask import Flask
from config import Config
from models import db
from routes import routes
from flask_cors import CORS
import os

app = Flask(__name__)
app.config.from_object(Config)

CORS(app, supports_credentials=True)

db.init_app(app)
app.register_blueprint(routes)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
