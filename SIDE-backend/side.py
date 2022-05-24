from flask import Flask, request, Response, send_file, jsonify
import json
import pymongo
from bson.objectid import ObjectId
from bson import json_util
from datetime import datetime
from flask_cors import CORS , cross_origin
import tabula
import pandas as pd
from werkzeug.utils import secure_filename
from excel import read_excel
import os
import subprocess
import requests

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
CORS(app, support_credentials=True)

ALLOWED_EXTENSIONS = set(['xls', 'csv', 'pdf', 'txt', 'jpg', 'png', 'jpeg'])

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# try:
#     mongo = pymongo.MongoClient(
#         host="localhost",
#         port=27017,
#         serverSelectionTimeoutMS = 1000
#     )
#     db = mongo.sideDB
#     mongo.server_info()
# except:
#     print("ERROR: Could not connect to the database!")


@app.route('/returnFile', methods = ['GET'])
@cross_origin(support_credentials=True)
def get_stored_csvs():
    directory = 'output'
    all_csv_file_names = {}
    for filename in os.listdir(directory):
        f = os.path.join(directory, filename)
        if os.path.isfile(f):
            print(f)
            all_csv_file_names[filename] = f
    return jsonify(all_csv_file_names)

def read_csv(file):
    df = pd.read_csv(file)
    df.dropna(axis=1, how='all', inplace=True)
    df.dropna(axis=0, how='all', inplace=True)
    return df


def sideBar(filename):
    r = requests.post("http://127.0.0.1:5000/sideBar", data={"filename": filename})


def table_from_pdf(filename):
    # file_path = '/input-data/table-pdf.pdf'
    df = tabula.read_pdf(filename, pages='all')
    i = 0
    for table in df:
        df.to_csv(f'output/{i}.csv')
        i += 1
    print(df[0])


@app.route("/")
@cross_origin(support_credentials=True)
def hello_world():
    # table_from_pdf()

    return Response(
        response="Hello World!",
        status=200
    )


# Analyse file
@app.route('/submitFile', methods = ['GET', 'POST'])
@cross_origin(support_credentials=True)
def submitFiles():
    print('Inside function')
    # check if the post request has the file part
    if request.method == 'POST':
        print('Inside function 2')
        file = request.files['file']
        filename = file.filename
        print(filename)
        file.save(filename)
        if filename.endswith("xlsx"):
            read_excel(filename)
        elif filename.endswith("png"):
            print("Sidebar"+ filename)
            sideBar(filename)
        else:
            table_from_pdf(filename)
            
        
    # if file and allowed_file(filename):
    #     filename = secure_filename(file.filename)
    #     if filename.endswith("xlsx"):
        resp = jsonify({'message' : 'Table read successfully'})
        resp.status_code = 200
        return resp

            
    else:
        resp = jsonify({'message' : 'Allowed file types are txt, pdf, png, jpg, jpeg, gif'})
        resp.status_code = 400
        return resp

@app.route('/getCSVFileData', methods=['POST','GET'])
@cross_origin(support_credentials=True)
def get_csv_data():
    csv_file_path = request.form['csv_file_path']
    print(csv_file_path)
    f = open(csv_file_path, "r")
    data = f.read()
    return data

@app.route('/dtale', methods=['POST','GET'])
@cross_origin(support_credentials=True)
def trigger_dtale():
    if request.method == 'POST':
        csv_file_path = request.form['csv_file_path']
        print(csv_file_path)
        path = csv_file_path
        result = subprocess.run(['dtale', '--csv-path', path])

# @app.route("/viewAllPosts", methods=["GET"])
# def view_all_posts():
#     try:
#         data = list(db.mockFeed.find())
#         for post in data:
#             post["_id"] = str(post["_id"])
#
#         return  Response(
#             response=json.dumps(data),
#             status=200,
#             mimetype="application/json"
#         )
#
#
#     except Exception as e:
#         print(e)
#         return Response(
#             response="Failed to view posts",
#             status=500,
#             mimetype="application/json"
#         )
#
#
# @app.route("/addComment/<id>", methods=["PATCH"])
# def addComment(id):
#     try:
#         print(id)
#         comment = {
#             "user_id" : request.form["user_id"],
#             "comment" : request.form["comment"]
#         }
#
#         cursor = db.mockFeed.update_one(
#             {"_id": ObjectId(id)},
#             {"$push": {"comment" : comment }}
#         )
#
#         return Response(
#             response="Added comment",
#             status=200,
#             mimetype="application/json"
#         )
#     except Exception as ex:
#         print(ex)
#         return Response(
#             response="Failed to create comment on post",
#             status=500,
#             mimetype="application/json"
#         )
#
# @app.route("/viewComments/<id>", methods=["GET"])
# def view_comments(id):
#     try:
#         print(id)
#         post = db.mockFeed.find_one({"_id": ObjectId(id)})
#         print(post['comment'])
#
#         return Response(
#             response=json.dumps(post['comment'], default=json_util.default),
#             status=200,
#             mimetype="application/json"
#         )
#     except Exception as ex:
#         print(ex)
#         return Response(
#             response="Failed to view post",
#             status=500,
#             mimetype="application/json"
#         )
#
#
# @app.route("/createPost", methods=["POST"])
# def create_post():
#     try:
#         post = {
#             "title": request.form["title"]
#         }
#
#         cursor = db.mockFeed.insert_one(post)
#
#         return Response(
#             response="User Created Post Successfully",
#             status=200,
#             mimetype="application/json"
#         )
#     except Exception as ex:
#         print(ex)
#         return Response(
#             response="Failed to create post",
#             status=500,
#             mimetype="application/json"
#         )

if __name__ == "__main__":
    app.run(port=5001, debug=True)