from flask_sqlalchemy import SQLAlchemy
#python World Time Zone
import pytz 

db = SQLAlchemy()

def connect_to_db(app, url = 'postgresql:///notebooktest'):
    """ Connect the database to our Flask app. """
    app.config['SQLALCHEMY_DATABASE_URI'] = url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.app = app
    db.init_app(app)
    app.config['SQLALCHEMY_ECHO'] = True

class AwareDateTime(db.TypeDecorator):
    """ Results returned as aware datetimes, not naive ones.
    sourced from: 
    http://stackoverflow.com/questions/23316083/sqlalchemy-how-to-load-dates-with-timezone-utc-dates-stored-without-timezone
    """
    impl = db.DateTime
    def process_result_value(self, value, dialect):
        return value.replace(tzinfo=pytz.utc)

class Note(db.Model):
    __tablename__ = "notes"

    id = db.Column(db.Integer, primary_key = True, 
                               autoincrement = True)
    title = db.Column(db.String(200), nullable=False)
    note = db.Column(db.Text, nullable=False)
    date_at = db.Column(AwareDateTime, default=db.func.now(), nullable=False)

def example_note_data(app, purge=False):
    """ Create sample data for test suite """
    if purge:
        Note.query.delete()

    #Add these sample notes
    a = Note(title='A\'s Note' , note='This is note, to remember that life is never simple but it is simpley life')
    b = Note(title='', note='This is a note that does not have a title as that should dealt with' )
    c = Note(title='This a note that has no note!' , note='')
    d = Note(title='An other Note' , note='A note that does not have an apostrophy but does have a \"quote in it\" that I escaped but I should handle that in the code!')

    db.session.add_all([a, b, c, d])
    db.session.commit()

if __name__ == "__main__":
    from server import app
    connect_to_db(app)
    example_note_data(app)
    db.create_all()
    print "Connected to DB."