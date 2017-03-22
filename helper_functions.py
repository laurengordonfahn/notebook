from flask import (Flask, request, render_template, flash, session, jsonify, abort)
from model import *
from sqlalchemy import desc
#for facebook environmental variable
import os
import facebook


##### session helper functions #####
def current_user():
    """ Return the user object if in session """

    if 'current_user' in session:

        return User.query.get(session['current_user'])

    else:

        return None


###### facebook sign in helper functions #####
def facebook_app_id():
    """ Retrieve app_id from local environment """

    app_id=os.environ["APP_ID"]

    return app_id

####### GET '/notes' helper functions ########
def gather_all_notes_from_db(user_id):
    """Gather all notes by user id """

    return Note.query.filter_by(user_id=user_id).order_by(desc(Note.id)).all()     

##### 'POST /notes' helper functions #####
def load_user(access_token):
    """ Use facebook access token to gather information """

    token = access_token
    graph = facebook.GraphAPI(token)
    args = {'fields': 'id, name, email'}
    profile = graph.get_object('me', **args)
    facebook_id = profile['id']

    #if profile_id in the database then sign them in if not load this information
    user = User.query.filter_by(facebook_id=facebook_id).one_or_none()

    if not user:

        user = User(facebook_id=facebook_id, name=profile['name'], email=profile['email'])
        db.session.add(user)
        db.session.commit()

    session['current_user'] = user.id
    session['access_token'] = access_token

    return 

def commit_note_to_db(user_id, note_title, new_note):
    """ Take in note title and note and add to DB 
        Return database info on new submission
    """
   
    note = Note(user_id=user_id, title=note_title, content=new_note)

    db.session.add(note)
    db.session.commit()
    
    return note

######'/notes/edit/<id>' ###### ## TODO CORRECT THIS KNOW THAT HAVE SIGNIN
def get_or_abort(model, object_id, code=404):
    """ Get an object with given id or an abort error with 404 default"""

    result = model.query.get(object_id)

    return result or abort(code)

def update_note(user_id, note_id, note_title, note_content):
    """ Update a note By Id Return Updated Note Object """

    if not note_title:

        note_title = " "

    if not note_content:

        note_content = " "

    note = get_or_abort(Note, note_id)
    note.user_id = user_id
    note.title = note_title
    note.content = note_content
    db.session.commit()

    return note

#### '/notes/reorder' ######
def format_created_at(results):
    """Takes in a marshmellow assisted array of objects Returns a reformated array of objects each with created_at formated """

    data = []

    for result in results:
        obj = {}
        obj['content'] = result['content']
        obj['created_at'] = result['created_at'].split("T")[0]
        obj['id'] = result['id']
        obj['title'] = result['title']
        data.append(obj)
        
    return data

#### '/delete_note' helper functions #####
def delete_note_from_db(user_id, note_id):
    """ Take in note_id and remove from the DB
        Return None
    """

    Note.query.filter_by(user_id=user_id, id=note_id).delete()
    db.session.commit()

##### Used in many routes #######
def format_note(note):

    date_format = str(note.created_at).split(" ")[0];

    return {
        "content": note.content ,
        "title": note.title,
        "id": note.id, 
        "created_at": date_format 
    }
