from server import app

from model import connect_to_db, db, example_user_data

import unittest

class TestCase(unittest.TestCase)

    def setUp(self):
        """ Runs the set-up method """
        self.doSetUp()

    def doSetUp(self):
        """ Do before every test. """

        #Get the Flask test client
        self.client = app.test_client()
        app.config['TESTING'] = True

        #Connect to test database
        connect_to_db(app, url='postgresql:///notbook_test')

        db.drop_all()

        #Create tables and add sample database
        db.create_all()

        example_note_data(app)