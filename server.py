from flask import (Flask, request, render_template, flash, session, jsonify)

from flask_debugtoolbar import DebugToolbarExtension

from model import *

from helper_functions import *

app = Flask(__name__)
app.secret_key = "rainy tuesday"


@app.route('/')
def index():
    """ Render index.html populate with notes from DB """
    notes = gather_all_notes_from_db()
    return render_template("index.html", notes=notes)

@app.route('/notes', methods=['POST'])
def add_note():
    """ Add note to DB return note info to Javascript to update Dom """
    
    note_title = request.form.get("note_title")
    new_note = request.form.get("new_note")

    note_db_info = commit_note_to_db(note_title, new_note)


    response = { 

        "content": note_db_info.content ,
        "title": note_db_info.title,
        "id": note_db_info.id, 
        "created_at": note_db_info.created_at 

    }


    return jsonify(response)


@app.route('/notes/<id>', methods=['DELETE'])
def delete_note(id):
    """Remove note from DB"""
    
    delete_note_from_db(id)
    
    #TODO : Do I need to return anything? 
    return jsonify({"none": "none"})


if __name__ == "__main__":

    app.debug = True

    connect_to_db(app)

    DebugToolbarExtension(app)

    app.run(host="0.0.0.0", port=5000)