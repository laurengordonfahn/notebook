from server import app

from test_model import connect_to_db, db, example_note_data

import unittest

class TestswithoutDB(unittest.TestCase):
    """ Tests that don't require the db. """

    #Get the Flask test client and data set up
    def setUp(self):
        app.config['TESTING'] = True
        app.secrete_key= "rainy tuesday"
        self.client = app.test_client()

     def test_empty_db(self):
        """ Run this test before the creation of the fake database to see what appears before the creation of the database."""
        result = self.client.get('/')
        self.assertIn("You do not have any notes at this time!", result.data)


class TestCase(unittest.TestCase):

    def setUp(self):
        """ Do before every test. """

        #Get the Flask test client
        app.config['TESTING'] = True
        app.secrete_key= "rainy tuesday"
        self.client = app.test_client()

        #Connect to test database
        connect_to_db(app, url='postgresql:///notebooktest')

        db.drop_all()

        db.create_all()

        example_note_data(app)

    def tearDown(self):
        """ Do at the end of every test. """

        db.session.close()
        db.drop_all()

class OpeningToFilledDB(TestCase):
    """ Flask test for opening up to the message board with the DB feed """
    def test_messages_present(self):
        result = self.client.get('/')
        self.assertIn("This is note, to remember that life is never simple but it is simpley life", result.data)

class AddingMessage(TestCase):
    """ Flask test for adding a message """
    def add_note(self, title, note):
        """ Method takes in a note title and a note  """
        result = self.client.post('/', data={'title': 'An other Note', note='A note that does not have an apostrophy but does have a \"quote in it\" that I escaped but I should handle that in the code!'}, follow_redirects=True)

    def test_add_note(self):
        result = self.add_note("Test Suite Note", "This is a new note added by the test suite")
        self.assertIn("This is a new note added by the test suite", result.data)

        result = self.add_note("Test Suite Note", "This is a new note added by the test suite")
        self.assertNotIn('You do not have any notes at this time!', result.data)




if __name__ == "__main__":
    
    unittest.main()