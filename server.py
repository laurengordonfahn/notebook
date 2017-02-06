from flask import (Flask, request, render_template, redirect, flash, session, jsonify)

from flask_debugtoolbar import DebugToolbarExtension

from sqlalchemy import (asc, desc) 

from model import *

from helper_functions import *

#for searlizing sqlalchemy objects
from flask_marshmallow import Marshmallow


app = Flask(__name__)
#for marshmellow searliazer to work
ma = Marshmallow(app)

app.secret_key = "rainy tuesday"

###################### class for Marshmellow #############################
class UserSchema(ma.Schema):
    class Meta:
        # Fields to expose
        fields = ('id', 'created_at', 'title', 'content')

user_schema = UserSchema()
users_schema = UserSchema(many=True)
#####################################################

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

    note = commit_note_to_db(note_title, new_note)

    return jsonify(format_note(note))

@app.route('/notes/edit/<id>', methods=['PUT'])
def update_edited_note_in_BD(id):
    """ Replace Note in Database by ID with Edited Note and Title """
    
    note_title = request.form.get('title')
    note_content = request.form.get('content')
    
    note = update_note(id, note_title, note_content)

    return jsonify(format_note(note))


@app.route('/notes/reorder')
def descend_order():
    """ Returns notes in Descending Order """

    order_by = request.args.get("order_by") 
    
    if order_by == "most_recent":
        notes = gather_all_notes_from_db() 
        
    else:
        notes =  Note.query.order_by(asc(Note.created_at)).all()

    result = users_schema.dump(notes)
   
    return jsonify(result.data)


@app.route('/notes/<id>', methods=['DELETE'])
def delete_note(id):
    """Remove note from DB"""
    
    delete_note_from_db(id)
     
    return jsonify({"none": "none"})

def format_note(note):
    return {
        "content": note.content ,
        "title": note.title,
        "id": note.id, 
        "created_at": note.created_at 
    }

if __name__ == "__main__":

    app.debug = True

    connect_to_db(app)

    DebugToolbarExtension(app)

    app.run(host="0.0.0.0", port=5000)