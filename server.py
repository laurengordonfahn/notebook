from flask import (Flask, request, render_template, redirect, flash, session, jsonify)

from flask_debugtoolbar import DebugToolbarExtension

from sqlalchemy import (asc, desc) 

from model import *

from helper_functions import *

#for searlizing sqlalchemy objects
from flask_marshmallow import Marshmallow

#for facebook sign in
import facebook
#for environmental variables for facebook API
import os


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
    """Render index.html for sigin-in """

    if not current_user():
        
        return render_template("index.html", app_id=facebook_app_id(), user="no")
    
    notes = gather_all_notes_from_db(current_user().id)

    results = users_schema.dump(notes).data
        
    return render_template("index.html", app_id=facebook_app_id(), user="yes", notes=notes, results=results)


@app.route('/session')
def login():
    """ Creates User Session and New Account if needed """

    access_token = request.args.get("accessToken")

    if access_token:

        load_user(access_token)

    return redirect('/') 


@app.route('/notes', methods=['POST'])
def add_note():
    """ Add note to DB return note info to Javascript to update Dom """
    
    note_title = request.form.get("note_title")
    new_note = request.form.get("new_note")

    if len(note_title) > 200:
        msg= 'title must be less than 200 characters, your title is %s' % (len(note_title))
        return jsonify({'error_msg': msg, 'new_note': new_note, 'note_title': note_title})

    if not current_user():

        return redirect ('/')

    note = commit_note_to_db(current_user().id, note_title, new_note) 
    
    return jsonify(format_note(note))

@app.route('/notes/edit/<id>', methods=['PUT'])
def update_edited_note_in_db(id):
    """ Replace Note in Database by ID with Edited Note and Title """
    
    note_title = request.form.get('title')
    note_content = request.form.get('content')

    if not current_user():
        
        return redirect ('/')
    
    note = update_note(current_user().id, id, note_title, note_content)

    return jsonify(format_note(note))


@app.route('/notes/reorder')
def descend_order():
    """ Returns notes in Descending Order """

    if not current_user():
        
        return redirect ('/')

    order_by = request.args.get("order_by") 
    
    if order_by == "most_recent":

        notes = gather_all_notes_from_db(current_user().id) 

    else:

        notes =  Note.query.order_by(asc(Note.created_at)).all()

    results = users_schema.dump(notes).data

    data = format_created_at(results)


    return jsonify(data)
   

@app.route('/notes/<id>', methods=['DELETE'])
def delete_note(id):
    """Remove note from DB"""

    if not current_user():

        return redirect ('/')
    
    delete_note_from_db(current_user().id, id)

    num_notes= len(gather_all_notes_from_db(id))

    return jsonify({"num_notes": num_notes})

@app.route('/session', methods=['DELETE'])
def log_out():
    """ Delete 'current_user' from session and redirect homepage """

    del session['current_user']
    
    return jsonify({'none': 'none'})


if __name__ == "__main__":

    app.debug = True

    connect_to_db(app)

    DebugToolbarExtension(app)

    app.run(host="0.0.0.0", port=5000)