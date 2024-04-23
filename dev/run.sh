source venv/bin/activate
waitress-serve --call -port=80 'solitaire_scrabble:create_app' --port=80