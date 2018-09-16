import os
from flask import send_from_directory
from flask import Flask
app = Flask(__name__)

@app.route("/")
def experiment():
    root_dir = os.path.dirname(os.getcwd())
    print os.path.join('.', 'templates')
    return send_from_directory(os.path.join('.', 'templates'), 'index.html')

if __name__ == "__main__":
    app.run(host='0.0.0.0')