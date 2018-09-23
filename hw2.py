from random import randint
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
    response = make_response(render_template('index.html', random=randint(0, 100000)))
    
    if not hw2uuid:
        response.set_cookie('hw2uuid', str(uuid.uuid4()))

    return response

@app.route("/demographics", methods=["POST"])
def demographics():
    print(" ---> Submitting form: %s" % request.form)
    mongo.db.demographics.insert({
        "uuid": request.cookies.get('hw2uuid'),
        "name": request.form.get("name"),
    })
    return jsonify(dict(message="OK", form=request.form))
    
if __name__ == "__main__":
    app.run(host='0.0.0.0')