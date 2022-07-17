import os
import sqlite3

import pandas as pd
from flask import Flask, jsonify, redirect, render_template, request, url_for
from flask_cors import CORS

from helper import pack_employees

app = Flask(__name__)

app.config["DEBUG"] = True
SAVED_DIR = os.path.join(os.getcwd(), 'static', 'files')
CORS(app)


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

@app.route('/users')
def get_users():
    """    
    Get users
    /users?minSalary=0&maxSalary=4000&offset=0&limit=30&sort=+name
    http://127.0.0.1:5000/users?minSalary=1111&maxSalary=5555&offset=0&limit=12&sort=+id
    """

    try:
        min_salary = float(request.args.get('minSalary'))
    except: # pylint: disable=bare-except
        return jsonify('Request param minSalary does not have a valid format'), 400
    try:
        max_salary = float(request.args.get('maxSalary'))
    except: # pylint: disable=bare-except
        return jsonify('Request param maxSalary does not have a valid format'), 400
    try:
        offset = int(request.args.get('offset'))
    except: # pylint: disable=bare-except
        return jsonify('Request param offset does not have a valid format'), 400
    try:
        limit = int(request.args.get('limit'))
        if limit > 30:
            return jsonify('Request param limit is more than 30'), 400
    except: # pylint: disable=bare-except
        return jsonify('Request param limit does not have a valid format'), 400
    try:
        sort_column = request.args.get('sort')[1:]
        descending = request.args['sort'][0] == '-'
    except: # pylint: disable=bare-except
        return jsonify('Request param sort does not have a valid format'), 400

    conn = get_db_connection()
    db_employee = conn.execute(
        'SELECT id, login, name, salary FROM employee WHERE salary BETWEEN ? and ?',
        (min_salary, max_salary)).fetchall()
    conn.close()

    # db_employee is non serializable
    packed_employees = {'results': pack_employees(
        db_employee, offset, limit, sort_column, descending)}

    return jsonify(packed_employees), 200

@app.route('/deleteAll', methods=['DELETE'])
def delete_all():
    conn = get_db_connection()
    conn.execute('DELETE FROM employee')
    conn.commit()
    conn.close()
    return jsonify("Deleted database"), 200


@app.route('/delete', methods=['POST'])
def delete_employee():
    conn = get_db_connection()
    conn.execute('DELETE FROM employee WHERE id = ?', request.form['id'])
    conn.commit()
    conn.close()
    return redirect(url_for('show_entries'))



def parse_CSV(filePath):
    col_names = ['id', 'login', 'name', 'salary']
    csvData = pd.read_csv(filePath, names=col_names, header=None)

    conn = get_db_connection()

    for i, row in csvData.iterrows():
        if i == 0 or row['id'][0] == '#':
            continue

        if len(row) != 4:
            return ('Parameter not correct, error after: ' + row[i - 1])
        try:
            row['salary'] = float(row['salary'])
            if row['salary'] < 0:
                return ('Salary for '+ row[i] + ' is less than 0')
        except ValueError:
            return ('Salary for ' + row[i + ' is not a number'])


        conn.execute('INSERT OR IGNORE INTO employee (id, login, name, salary) VALUES (?, ?, ?, ?)',
            (row['id'], row['login'], row['name'], row['salary']))

        conn.execute('UPDATE employee SET  login=?, name=?, salary=? WHERE id =?',
            (row['login'], row['name'], row['salary'], row['id']))

    conn.commit()
    conn.close()



if (__name__ == "__main__"):
    app.run(port=5000)
