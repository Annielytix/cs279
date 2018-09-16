from flask import Flask
app = Flask(__name__)

@app.route("/")
def experiment():
    return app.send_static_file('templates/index.html')

if __name__ == "__main__":
    app.run(host='0.0.0.0')