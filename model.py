from flask_sqlalchemy import SQLAlchemy
#python World Time Zone
import pytz 

db = SQLAlchemy()

def connect_to_db(app, url = 'postgresql:///notebook'):
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

if __name__ == "__main__":
    from server import app
    connect_to_db(app)
    db.create_all()