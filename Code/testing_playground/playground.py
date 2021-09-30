# import the flask class!
from flask import Flask

app = Flask(__name__)


# URL Triggering:
@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"
