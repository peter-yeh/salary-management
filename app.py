import os
import sqlite3

import pandas as pd
from flask import Flask, redirect, render_template, request, url_for

# from os.path import dirname, join, realpath


app = Flask(__name__)

app.config["DEBUG"] = True
SAVED_DIR = os.path.join(os.getcwd(), 'static', 'files')


def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn


# Root URL
@app.route('/')
def index():
    # Set The upload HTML template '\templates\index.html'
    return render_template('index.html')


# Get the uploaded files
@app.route("/", methods=['POST'])
def upload_files():
    # get the uploaded file
    uploaded_file = request.files['file']
    if uploaded_file.filename != '':
        file_path = os.path.join(SAVED_DIR, uploaded_file.filename)
        uploaded_file.save(file_path)
        parse_CSV(file_path)

    return redirect(url_for('index'))


def parse_CSV(filePath):
    col_names = ['id', 'login', 'name', 'salary']
    csvData = pd.read_csv(filePath, names=col_names, header=None)

    for i, row in csvData.iterrows():
        print(i, row['id'], row['login'], row['name'], row['salary'])


if (__name__ == "__main__"):
    app.run(port=5000)
