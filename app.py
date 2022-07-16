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
@app.route('/users/upload')
def index():
    # Set The upload HTML template '\templates\index.html'
    return render_template('index.html')


# Get the uploaded files
@app.route("/users/upload", methods=['POST'])
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

    conn = get_db_connection()

    for i, row in csvData.iterrows():
        if i == 0 or row['id'][0] == '#':
            continue

        if len(row) != 4:
            return ('Error after: ' + row[i - 1]) if i > 0 else ('Error on header')

        print(i, row['id'], row['login'], row['name'], row['salary'])

        conn.execute('INSERT OR IGNORE INTO employee (id, login, name, salary) VALUES (?, ?, ?, ?)',
            (row['id'], row['login'], row['name'], row['salary']))

        conn.execute('UPDATE employee SET  login=?, name=?, salary=? WHERE id =?',
            (row['login'], row['name'], row['salary'], row['id']))

    conn.commit()
    conn.close()



if (__name__ == "__main__"):
    app.run(port=5000)
