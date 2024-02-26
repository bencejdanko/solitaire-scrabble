Clone the repository:

`git clone https://github.com/bencejdanko/solitaire-scrabble/`

Navigate to development folder:

`cd solitaire-scrabble/dev/`

Create a python enviroment and activate it:

`python3 -m venv venv`
`source venv/bin/activate`

Install project dependencies:

`pip install -r requirements.txt`

Initialize the database:

`flask --app solitaire_scrabble init_db`

Start the application:

`flask --app solitaire-scrabble run`

Open the app on http://localhost:5000.
