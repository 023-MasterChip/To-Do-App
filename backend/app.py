from flask import Flask, jsonify, redirect, render_template, request
from datetime import datetime
import sqlite3

app = Flask(__name__)

db = 'tasks.db'

def get_db_connection():
    conn = sqlite3.connect(db)
    conn.row_factory = sqlite3.Row 
    return conn

@app.route('/')
def create_table():
    conn = get_db_connection()
    c = conn.cursor()

    c.execute('''
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                task TEXT NOT NULL,
                desc TEXT NOT NULL,
                created_at DATE NOT NULL,
                completed_at DATE,
                status BOOLEAN NOT NULL
            )
        ''')
    
    conn.commit()
    conn.close()
    return "Table created sucessfully"


@app.route('/tasks', methods=['POST', 'GET'])
def get_all_tasks():

    conn = get_db_connection()
    c = conn.cursor()

    if request.method == 'GET':
        c.execute("SELECT * FROM tasks")
        tasks = c.fetchall()
        column_names = [description[0] for description in c.description]
        
        tasks_dict = [dict(zip(column_names, task)) for task in tasks]
        conn.close()
        return jsonify(tasks_dict)
        # return render_template('home.html', tasks = tasks_dict)
    else:
        data = request.get_json()

        task = data.get('task')
        desc = data.get('description')
        date = datetime.now()

        c.execute("INSERT INTO tasks (task,desc,created_at,status) VALUES (?,?,?,?)",(task,desc,date,0))

        conn.commit()   
        return "task created successfully"
    
@app.route('/<int:status>/tasks', methods=['GET'])
def fetch_tasks(status):
    conn = get_db_connection()
    c = conn.cursor()

    if status == 0 or status == 1:
        c.execute("SELECT * FROM tasks WHERE status = ?",(status,))
        tasks = c.fetchall()
        column_names = [description[0] for description in c.description]
        tasks_dict = [dict(zip(column_names, task)) for task in tasks]
        conn.close()
        return jsonify(tasks_dict)
    else:
        conn.close()
        return "Invalid status"
    
@app.route('/tasks/<int:task_id>', methods=['GET', 'DELETE', 'PUT'])
def find_task(task_id):
    conn = get_db_connection()
    c = conn.cursor()

    if request.method == 'GET':
        c.execute("SELECT * FROM tasks WHERE id = ?",(task_id,))
        task = c.fetchone()
        if task is None:
            return "The task is not found"
        else:
            conn.close()
            return jsonify(dict(task))
    
    elif request.method == 'DELETE':
        c.execute("DELETE FROM tasks WHERE id = ?",(task_id,))
        conn.commit()
        conn.close()
        return "task deleted successfully"
    
    elif request.method == 'PUT':
        c.execute("SELECT * FROM tasks WHERE id = ?",(task_id,))
        task = c.fetchone()
        if task is None:
            return "The task is not found"
        else:
            task_dict = dict(task)
            task = task_dict['task']
            desc = task_dict['desc']
            date = datetime.now()

            data = request.get_json()

            if 'task' in data:
                task = data.get('task')
            if 'description' in data:
                desc = data.get('description')
            
            c.execute("UPDATE tasks SET task = ?, desc = ?, created_at = ? WHERE id = ?",(task,desc,date,task_id))
            conn.commit()
            conn.close()
            return "task updated successfully"


@app.route('/tasks/<int:task_id>/<int:status>', methods = ['PUT'])
def update_task_status(task_id,status):
    conn = get_db_connection()
    c = conn.cursor()
    if status == 1 or status == 0:
        date = datetime.now()
        c.execute("UPDATE tasks SET status = ?, completed_at = ? WHERE id = ?",(status,date,task_id))
        conn.commit()
        conn.close()
        return "task status updated successfully"
    else:
        return "invalid status"


if __name__ == '__main__':
    app.run(debug=True)
