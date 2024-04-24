source venv/bin/activate
flask --app solitaire_scrabble init-db
waitress-serve --call --port=80 'solitaire_scrabble:create_app'