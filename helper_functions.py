from flask import (Flask, request, render_template, flash, session, jsonify)
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


#### '/delete_note' helper functions #####
def delete_note_from_db(note_id):
    """ Take in note_id and remove from the DB
        Return None
    """

    Note.query.filter_by(id=note_id).delete()
    db.session.commit()


