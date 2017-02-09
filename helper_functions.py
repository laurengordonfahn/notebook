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

##### For log out #######
def clear_old_session():
    """ clear current user session """
    if 'current_user' in session:
        del session['current_user']

###### facebook sign in helper functions #####
def facebook_app_id():
    app_id=os.environ["APP_ID"]
    return app_id

####### GET '/notes' helper functions ########
def gather_all_notes_from_db(user_id):
    
    note = Note.query.filter_by(user_id=user_id).order_by(desc(Note.created_at)).all()

    if not note:
        return None
    return note
    

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
        new_user = User(facebook_id=facebook_id, name=profile['name'], email=profile['email'])
        db.session.add(new_user)
        db.session.commit()
    user = User.query.filter_by(facebook_id=facebook_id).first()
    session['current_user'] = user.user_id
    session['access_token'] = access_token
    return 

def commit_note_to_db(user_id, note_title, new_note):
    """ Take in note title and note and add to DB 
        Return database info on new submission
    """
    print "COMMITING NEW NOTE "
    note = Note(user_id=user_id, title=note_title, content=new_note)
    print Note, "NOTE NOTE NOTE NOTE NOTE"
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

    #TODO CORRECT THIS KNOW THAT HAVE SIGNIN
    note = get_or_abort(Note, note_id)
    note.user_id = user_id
    note.title = note_title
    note.content = note_content
    db.session.commit()

    return note

#### '/delete_note' helper functions #####
def delete_note_from_db(user_id, note_id):
    """ Take in note_id and remove from the DB
        Return None
    """

    Note.query.filter_by(user_id=user_id, id=note_id).delete()
    db.session.commit()

##### Used in many routes #######
def format_note(note):
    return {
        "content": note.content ,
        "title": note.title,
        "id": note.id, 
        "created_at": note.created_at 
    }


