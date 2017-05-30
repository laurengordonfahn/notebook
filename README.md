#Simple Notebook

##Project Description:

A simple RESTful flask app that allows a user to create, view, edit, reorder by date, and delete notes. Using Facebook Oauth sign-in. One page fully dynamic. A simple building block application for future projects to be built on-top of.

##Enjoy This Project Online:

notebookonline.herokuapp.com

## Getting Started:

##Prerequisites:

1) Download the project in a directory of its own. Navigate into the new directory and type in the following command.  

    $ git clone https://github.com/laurengordonfahn/simple_notebook_project

2) Create a virtual environment using virtualenv to house the required frameworks if you are unsure you have this capacity visit https://virtualenv.pypa.io/en/stable/: 

```
$ virtualenv env
$ source env/bin/activate
```

3) Pip install will enable installation of the project requirements
If you are uncertain if you have pip install visit the website : https://pip.pypa.io/en/stable/installing/

4) Make sure you are in the first level of your newly created directory then pip install the requirements, the file will be read into the environment automatically:

```
$ pip install -r requirements.txt
```

5) For your information these are the project requirements found in the requirements.txt file

```
blinker==1.4
click==6.6
Flask==0.12
Flask-DebugToolbar==0.10.0
flask-marshmallow==0.7.0
Flask-SQLAlchemy==2.1
itsdangerous==0.24
Jinja2==2.8.1
MarkupSafe==0.23
marshmallow==2.12.2
pkg-resources==0.0.0
psycopg2==2.6.2
pytz==2016.10
six==1.10.0
SQLAlchemy==1.1.4
Werkzeug==0.11.15
```

## Installing:
1) create a database using postgres and source the database
``` 
    $ createdb notebook
    $ python model.py
```

4) To run the server file server.py :
``` 
    $ python server.py
```

## Running the tests:
1) create a database using postgres and source the database
```
    $ createdb notebooktest
    $ python test_model.py
```
2) Run the unittests, Jasmine tests are under construction at this time
```
   $ python test_server.py
```

## Built With:
* Python- Backend Language
* Flask - Python web frame work
* SqlAlchemy- Database Toolkit for python
* PostgreSQL- Object Relational Database System
* Unittest- Testing Framework
* Javascript- Front end language
* JQuery- Javascript Library
* Jasmine- Testing Framework (under construction)

## Current Features Completed/In-Progress:
* Add a new note with automatic display (complete)
* Delete a note (complete)
* Change the date order notes are displayed (complete)
* Edit and existing note (in-progress)

## Future Build-Out:
* Build-Out test suites in both Unittests and Jasmine - there are never too many good tests.
* Add Facebook sign-in
* Confirm before deletion of a note.
* Tighten endpoints 
* Enable users to be able to create different folders to organize notes
* Deploy on Heroku


## Author:
* Lauren Gordon-Fahn

## Acknowledgments:
* Adam Bozanich for being an amazing mentor who is helping me expand my understanding of industry standards to become a stronger and stronger software engineer. 
