from flask_sqlalchemy import SQLAlchemy
#python World Time Zone
import pytz 
#for onupdate
import datetime

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

class User(db.Model):
    __tablename__ = "users"

    user_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), nullable=False)
    facebook_id = db.Column(db.String(30), nullable=False, unique=True)

class Note(db.Model):
    __tablename__ = "notes"

    id = db.Column(db.Integer, primary_key = True, 
                               autoincrement = True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(AwareDateTime, default=db.func.now(), nullable=False, onupdate=datetime.datetime.now)



if __name__ == "__main__":
    from server import app
    connect_to_db(app)
    db.create_all()