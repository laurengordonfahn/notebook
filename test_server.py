from server import app

from model import connect_to_db, db, example_user_data

import unittest

class TestCase(unittest.TestCase)

    def setUp(self):
        """ Runs the set-up method """
        self.dbSetUp()
        self.test_empty_db()
        self.dbCreation()

    def dbSetUp(self):
        """ Do before every test. """

        #Get the Flask test client
        self.client = app.test_client()
        app.config['TESTING'] = True

        #Connect to test database
        connect_to_db(app, url='postgresql:///notbook_test')

        db.drop_all()

    def test_empty_db(self):
        """ Run this test before the creation of the fake database to see what appears before the creation of the database."""
        result = self.client.get('/')
        self.assertIn("You do not have any notes at this time!", result.data)


    def dbCreation(self):
        """ Create the fake data in the db """

        db.drop_all()
        #Create tables and add sample database
        db.create_all()

        example_note_data(app)

    def tearDown(self):
        """ Do at the end of every test. """

        db.session.close()
        db.drop_all()

class OpeningToFilledDB(TestCaseBase):
    """ Flask test for opening up to the message board with the DB feed """
    def test_messages_present(self):
        result = self.client.get('/')
        self.assertIn("This is note, to remember that life is never simple but it is simpley life", result.data)
        #######

class AddingMessage(TestCaseBase):
    """ Flask test for adding a message """
    def add_note(self, title, note):
        """ Method takes in a note title and a note  """
        result = self.client.post('/', data=dict(title=title, note=note), follow_redirects=True)

    def test_add_note(self):
        result = self.add_note("Test Suite Note", "This is a new note added by the test suite")
        self.assertIn("This is a new note added by the test suite", result.data)

        ### may not run due to assert b which is flaskr i think http://flask.pocoo.org/docs/0.12/testing/
        result = self.add_note("Test Suite Note", "This is a new note added by the test suite")
        assert b'You do not have any notes at this time!' not in result.data




if __name__ == "__main__":
    unittest.main()