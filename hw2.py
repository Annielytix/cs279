from random import randint
import uuid
import pytz
import xlsxwriter
from flask import Flask
from flask import render_template
from flask import request
from flask import make_response
from flask import jsonify
from flask_pymongo import PyMongo
from flask import send_file

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
        "trials": result.get("trials"),
        "fadeIns": result.get("fadeIns")
    })
    return jsonify(dict(message="OK", form=request.form))

@app.route("/xlsx")
def xlsx():    
    xlsx_path = "CS279.xlsx"
    workbook = xlsxwriter.Workbook(xlsx_path)
    bold = workbook.add_format({'bold': 1})
    date_format = workbook.add_format({'num_format': 'm/dd/yy h:mm:ss AM/PM'})
    EST = pytz.timezone('US/Eastern')
    generate_date = lambda x: x['_id'].generation_time.astimezone(EST).replace(tzinfo=None)
    
    demographics = workbook.add_worksheet("Demographics")
    feedback = workbook.add_worksheet("Feedback")
    data = workbook.add_worksheet("Data")
    
    db_demographics = mongo.db.demographics.find()
    db_feedback = mongo.db.feedback.find()
    db_data = mongo.db.taskdata.find()
    
    # Feedback
    
    row = 0
    col = 0
    feedback.write(row, col, "UUID", bold)
    feedback.set_column(col, col, 15); col += 1
    feedback.write(row, col, "Date", bold)
    feedback.set_column(col, col, 20); col += 1
    feedback.write(row, col, "Difficulty", bold)
    feedback.set_column(col, col, 15); col += 1
    feedback.write(row, col, "Efficiency", bold)
    feedback.set_column(col, col, 15); col += 1
    feedback.write(row, col, "Frustration", bold)
    feedback.set_column(col, col, 15); col += 1
    feedback.write(row, col, "Satisfaction", bold)
    feedback.set_column(col, col, 15); col += 1
    
    for f in db_feedback:
        if not f.get('difficulty', None): continue
        print(f)
        row += 1
        col = 0
        date = generate_date(f)
        feedback.write(row, col, f['uuid']); col += 1;
        feedback.write_datetime(row, col, date, date_format); col += 1;
        feedback.write(row, col, f['difficulty']); col += 1;
        feedback.write(row, col, f['efficiency']); col += 1;
        feedback.write(row, col, f['frustration']); col += 1;
        feedback.write(row, col, f['satisfaction']); col += 1;
    
    # Demographics
    
    row = 0
    col = 0
    demographics.write(row, col, "UUID", bold)
    demographics.set_column(col, col, 15); col += 1
    demographics.write(row, col, "Date", bold)
    demographics.set_column(col, col, 20); col += 1
    demographics.write(row, col, "Age", bold)
    demographics.set_column(col, col, 15); col += 1
    demographics.write(row, col, "Education", bold)
    demographics.set_column(col, col, 15); col += 1
    demographics.write(row, col, "Experience", bold)
    demographics.set_column(col, col, 15); col += 1
    demographics.write(row, col, "Gender", bold)
    demographics.set_column(col, col, 15); col += 1
    demographics.write(row, col, "Handedness", bold)
    demographics.set_column(col, col, 15); col += 1
    demographics.write(row, col, "Language", bold)
    demographics.set_column(col, col, 15); col += 1
    demographics.write(row, col, "Pointer", bold)
    demographics.set_column(col, col, 15); col += 1
    
    for d in db_demographics:
        print(d)
        row += 1
        col = 0
        date = generate_date(d)
        demographics.write(row, col, d['uuid']); col += 1;
        demographics.write_datetime(row, col, date, date_format); col += 1;
        demographics.write(row, col, d.get('age', '')); col += 1;
        demographics.write(row, col, d.get('education', '')); col += 1;
        demographics.write(row, col, d.get('experience', '')); col += 1;
        demographics.write(row, col, d.get('gender', '')); col += 1;
        demographics.write(row, col, d.get('handedness', '')); col += 1;
        demographics.write(row, col, d.get('language', '')); col += 1;
        demographics.write(row, col, d.get('pointer', '')); col += 1;
    
    row = 0
    col = 0
    data.write(row, col, "UUID", bold)
    data.set_column(col, col, 15); col += 1
    data.write(row, col, "Date", bold)
    data.set_column(col, col, 20); col += 1
    data.write(row, col, "Condition", bold)
    data.set_column(col, col, 15); col += 1
    data.write(row, col, "Fade in", bold)
    data.set_column(col, col, 15); col += 1
    data.write(row, col, "Permutation", bold)
    data.set_column(col, col, 15); col += 1
    data.write(row, col, "Selection", bold)
    data.set_column(col, col, 15); col += 1
    data.write(row, col, "Correct", bold)
    data.set_column(col, col, 15); col += 1
    data.write(row, col, "Menu Timestamp", bold)
    data.set_column(col, col, 15); col += 1
    data.write(row, col, "Menu Option Timestamp", bold)
    data.set_column(col, col, 15); col += 1
    
    # Task data
    
    for d in db_data:
        for t, trial in enumerate(d['trials']):
            print(d)
            row += 1
            col = 0
            date = generate_date(d)
            data.write(row, col, d['uuid']); col += 1;
            data.write_datetime(row, col, date, date_format); col += 1;
            data.write(row, col, d['condition']); col += 1;
            if len(d['fadeIns']) > t:
                data.write(row, col, d['fadeIns'][t]); col += 1;
            else:
                data.write(row, col, ""); col += 1;
            data.write(row, col, ', '.join([str(p) for p in d['permutation']])); col += 1;
            if len(d['selection']) > t:
                data.write(row, col, d['selection'][t]); col += 1;
            else:
                data.write(row, col, ""); col += 1;
            data.write(row, col, trial['correct']); col += 1;
            data.write(row, col, trial['events'][-1]['timestamp']); col += 1;
            data.write(row, col, trial['events'][-2]['timestamp']); col += 1;
    
    
    workbook.close()
    
    return send_file(xlsx_path,
              attachment_filename=xlsx_path,
              as_attachment=True)
    
    
if __name__ == "__main__":
    app.run(host='0.0.0.0')