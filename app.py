import math
import os
import sqlite3

import pandas as pd
from flask import Flask, jsonify, request
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



# Get the uploaded files
@app.route("/users/upload", methods=['POST'])
def upload_files():
    # get the uploaded file
    uploaded_file = request.files['file']
    if uploaded_file.filename == '':
        return jsonify("Error fetching CSV file"), 400

    try:
        file_path = os.path.join(SAVED_DIR, uploaded_file.filename)
        uploaded_file.save(file_path)
        parse_CSV(file_path)
    except Exception as err:
        return jsonify("Error parsing CSV ", repr(err)), 400

    return jsonify("CSV Uploaded successfully"), 200

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
    return jsonify("Deleted employee"), 200



def parse_CSV(filePath):
    col_names = ['id', 'login', 'name', 'salary']
    try:
        csvData = pd.read_csv(filePath, names=col_names, header=None)
    except:
        raise Exception("Error in CSV format")

    if len(csvData) <= 0:
        raise Exception("Empty file")

    conn = get_db_connection()

    for i, row in csvData.iterrows():
        if i == 0 or row['id'][0] == '#':
            continue

        if not row[0] or not row[1] or not row[2] or not row[3]:
            conn.close()
            raise Exception('Parameter not correct, error after: ' + row[i])

        salary_is_float = is_float(row['salary'])
        salary = float(row['salary'])

        if not salary_is_float :
            conn.close()
            raise ValueError('Salary for row ' + str(i + 1) + ' is not a number')

        if salary < 0:
            conn.close()
            raise ValueError('Salary for row ' + str(i + 1) + ' is less than 0')

        conn.execute('INSERT OR IGNORE INTO employee (id, login, name, salary) VALUES (?, ?, ?, ?)',
            (row['id'], row['login'], row['name'], salary))

        conn.execute('UPDATE employee SET  login=?, name=?, salary=? WHERE id =?',
            (row['login'], row['name'], salary, row['id']))

    conn.commit()
    conn.close()


def is_float(s):
    try:
        temp = float(s)
        if math.isnan(temp):
            return False
        return True
    except ValueError:
        return False


if (__name__ == "__main__"):
    app.run(port=5000)
