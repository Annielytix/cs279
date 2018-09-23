import uuid
from flask import Flask
from flask import render_template
from flask import request
from flask import make_response
from flask import jsonify
from flask_pymongo import PyMongo

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/hw2"
mongo = PyMongo(app)

@app.route("/")
def experiment():
    hw2uuid = request.cookies.get('hw2uuid')
    response = make_response(render_template('index.html'))
    
    if not hw2uuid:
        response.set_cookie('hw2uuid', unicode(uuid.uuid4()))

    return response

@app.route("/demographics", methods=["POST"])
def demographics():
    print request.form
    return jsonify(dict(message="OK", form=request.form))
    
if __name__ == "__main__":
    app.run(host='0.0.0.0')