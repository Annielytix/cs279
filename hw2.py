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
    print(" ---> Submitting demographics: %s" % request.form)
    mongo.db.demographics.insert({
        "uuid": request.cookies.get('hw2uuid'),
        "gender": request.form.get("gender"),
        "age": request.form.get("age"),
        "education": request.form.get("education"),
        "pointer": request.form.get("pointer"),
        "handedness": request.form.get("handedness"),
        "language": request.form.get("language"),
        "experience": request.form.get("experience"),
    })
    return jsonify(dict(message="OK", form=request.form))

@app.route("/feedback", methods=["POST"])
def feedback():
    print(" ---> Submitting feedback: %s" % request.form)
    mongo.db.feedback.insert({
        "uuid": request.cookies.get('hw2uuid'),
        "difficulty": request.form.get("difficulty"),
        "satisfaction": request.form.get("satisfaction"),
        "frustration": request.form.get("frustration"),
        "efficiency": request.form.get("efficiency"),
    })
    return jsonify(dict(message="OK", form=request.form))

@app.route("/taskdata", methods=["POST"])
def taskdata():
    result = request.get_json()
    print(" ---> Submitting task data: %s" % result)
    mongo.db.taskdata.insert({
        "uuid": request.cookies.get('hw2uuid'),
        "condition": result.get('condition'),
        "permutation": result.get("permutation"),
        "selection": result.get("selection"),
        "trials": result.get("trials")
    })
    return jsonify(dict(message="OK", form=request.form))

if __name__ == "__main__":
    app.run(host='0.0.0.0')