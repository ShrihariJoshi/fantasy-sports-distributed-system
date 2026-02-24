import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

import flask
from endpoints.auth import register_handler, login_handler
from config import Config
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity

app = flask.Flask(__name__)
app.config.from_object(Config)
jwt = JWTManager(app)
app.add_url_rule('/register', view_func=register_handler,methods=['POST'])
app.add_url_rule('/login',view_func=login_handler,methods=['POST'])
if __name__=="__main__":
    app.run(debug=True)