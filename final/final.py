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
app.config["MONGO_URI"] = "mongodb://localhost:27017/cs279CSCW"
mongo = PyMongo(app)

@app.route("/")
def experiment():
    finaluuid = request.cookies.get('finaluuid')
    response = make_response(render_template('index.html', random=randint(0, 100000)))
    
    if not finaluuid:
        response.set_cookie('finaluuid', str(uuid.uuid4()))

    return response

@app.route("/demographics", methods=["POST"])
def demographics():
    print(" ---> Submitting demographics: %s" % request.form)

    if mongo.db.demographics.find({"uuid": request.cookies.get('finaluuid')}).count() > 0:
        print(" ***> Already submitted demographics: %s" % request.form)
        return jsonify(dict(message="IGNORED REPEAT", form=request.form))
        
    mongo.db.demographics.insert({
        "uuid": request.cookies.get('finaluuid'),
        "gender": request.form.get("gender"),
        "age": request.form.get("age"),
        "zipcode": request.form.get("zipcode"),
        "education": request.form.get("education"),
        "awareness": request.form.get("awareness"),
        "savviness": request.form.get("savviness"),
        "trust": request.form.get("trust"),
        "interest": request.form.get("interest"),
        "newssource": request.form.get("newssource"),
    })
    return jsonify(dict(message="OK", form=request.form))

@app.route("/feedback", methods=["POST"])
def feedback():
    print(" ---> Submitting feedback: %s" % request.form)
    
    if mongo.db.feedback.find({"uuid": request.cookies.get('finaluuid')}).count() > 0:
        print(" ***> Already submitted demographics: %s" % request.form)
        return jsonify(dict(message="IGNORED REPEAT", form=request.form))
    
    mongo.db.feedback.insert({
        "uuid": request.cookies.get('finaluuid'),
        "political": request.form.get("political"),
        "confident_answers": request.form.get("confident_answers"),
        "confident_distinguish": request.form.get("confident_distinguish"),
        "helpful": request.form.get("helpful"),
        "comments": request.form.get("comments"),
    })
    return jsonify(dict(message="OK", form=request.form))

@app.route("/taskdata", methods=["POST"])
def taskdata():
    result = request.get_json()
    print(" ---> Submitting task data: %s" % result)

    if mongo.db.taskdata.find({"uuid": request.cookies.get('finaluuid')}).count() > 0:
        print(" ***> Already submitted demographics: %s" % request.form)
        return jsonify(dict(message="IGNORED REPEAT", form=request.form))
    
    mongo.db.taskdata.insert({
        "uuid": request.cookies.get('finaluuid'),
        "results": result,
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
    feedback.write(row, col, "Political", bold)
    feedback.set_column(col, col, 15); col += 1
    feedback.write(row, col, "Confident in Answers", bold)
    feedback.set_column(col, col, 15); col += 1
    feedback.write(row, col, "Confidence Distinguishing", bold)
    feedback.set_column(col, col, 15); col += 1
    feedback.write(row, col, "Helpful", bold)
    feedback.set_column(col, col, 15); col += 1
    feedback.write(row, col, "Comments", bold)
    feedback.set_column(col, col, 100); col += 1
    
    for f in db_feedback:
        if not f.get('political', None): continue
        print(f)
        row += 1
        col = 0
        date = generate_date(f)
        feedback.write(row, col, f['uuid']); col += 1;
        feedback.write_datetime(row, col, date, date_format); col += 1;
        feedback.write(row, col, f['political']); col += 1;
        feedback.write(row, col, f['confident_answers']); col += 1;
        feedback.write(row, col, f['confident_distinguish']); col += 1;
        feedback.write(row, col, f['helpful']); col += 1;
        feedback.write(row, col, f['comments']); col += 1;
    
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
    demographics.write(row, col, "Gender", bold)
    demographics.set_column(col, col, 15); col += 1
    demographics.write(row, col, "Zipcode", bold)
    demographics.set_column(col, col, 15); col += 1
    demographics.write(row, col, "Awareness", bold)
    demographics.set_column(col, col, 15); col += 1
    demographics.write(row, col, "Savviness", bold)
    demographics.set_column(col, col, 15); col += 1
    demographics.write(row, col, "Trust", bold)
    demographics.set_column(col, col, 15); col += 1
    demographics.write(row, col, "Interest", bold)
    demographics.set_column(col, col, 15); col += 1
    demographics.write(row, col, "News Source", bold)
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
        demographics.write(row, col, d.get('gender', '')); col += 1;
        demographics.write(row, col, d.get('zipcode', '')); col += 1;
        demographics.write(row, col, d.get('awareness', '')); col += 1;
        demographics.write(row, col, d.get('savviness', '')); col += 1;
        demographics.write(row, col, d.get('trust', '')); col += 1;
        demographics.write(row, col, d.get('interest', '')); col += 1;
        demographics.write(row, col, d.get('newssource', '')); col += 1;
    
    row = 0
    col = 0
    data.write(row, col, "UUID", bold)
    data.set_column(col, col, 15); col += 1
    data.write(row, col, "Date", bold)
    data.set_column(col, col, 20); col += 1
    data.write(row, col, "Statement", bold)
    data.set_column(col, col, 15); col += 1
    data.write(row, col, "Time (s)", bold)
    data.set_column(col, col, 15); col += 1
    data.write(row, col, "Round", bold)
    data.set_column(col, col, 15); col += 1
    data.write(row, col, "Question #", bold)
    data.set_column(col, col, 15); col += 1
    data.write(row, col, "Adverse?", bold)
    data.set_column(col, col, 15); col += 1
    data.write(row, col, "Correct", bold)
    data.set_column(col, col, 15); col += 1
    
    # Task data
    for d in db_data:
        for t, trial in enumerate(d['results']):
            print(d)
            row += 1
            col = 0
            date = generate_date(d)
            data.write(row, col, d['uuid']); col += 1;
            data.write_datetime(row, col, date, date_format); col += 1;
            data.write(row, col, trial[0]); col += 1;
            data.write(row, col, trial[1]); col += 1;
            data.write(row, col, trial[2]); col += 1;
            data.write(row, col, trial[3]+1); col += 1;
            data.write(row, col, trial[4]); col += 1;
            data.write(row, col, trial[5]); col += 1;
    
    workbook.close()
    
    return send_file(xlsx_path,
              attachment_filename=xlsx_path,
              as_attachment=True)
    
    
if __name__ == "__main__":
    app.run(host='0.0.0.0')