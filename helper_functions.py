from flask import (Flask, request, render_template, flash, session, jsonify, abort)
from model import *
from sqlalchemy import desc


##### '/' helper functions #####
def gather_all_notes_from_db():

    return Note.query.order_by(desc(Note.created_at)).all()

##### '/add_note' helper functions #####
def commit_note_to_db(note_title, new_note):
    """ Take in note title and note and add to DB 
        Return database info on new submission
    """
    note = Note(title=note_title, content=new_note)
    db.session.add(note)
    db.session.commit()
    
    return note

######'/notes/edit/<id>' ######
def get_or_abort(model, object_id, code=404):
    """ Get an object with given id or an abort error with 404 default"""
    result = model.query.get(object_id)
    return result or abort(code)

def update_note(note_id, note_title, note_content):
    """ Update a note By Id Return Updated Note Object """

    if not note_title:
        note_title = " "
    if not note_content:
        note_content = " "

    note = get_or_abort(Note, note_id)
    note.title = note_title
    note.content = note_content
    db.session.commit()

    return note

#### '/delete_note' helper functions #####
def delete_note_from_db(note_id):
    """ Take in note_id and remove from the DB
        Return None
    """

    Note.query.filter_by(id=note_id).delete()
    db.session.commit()


