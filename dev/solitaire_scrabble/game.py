import string
import json

from flask import (
    Blueprint, render_template, redirect, url_for, request, jsonify, session, g
    )

from solitaire_scrabble.db import get_db

from .generation import generate_board, generate_random_letters
from .compute import draw_hand
from .defaults import scrabble_scores, default_bag, all_words

import jwt
key = 'verysecretkey'

bp = Blueprint('game', __name__, url_prefix='/game')


@bp.route('/letter_scores', methods=['GET'])
def letter_scores():
    return jsonify(scrabble_scores), 200

@bp.route('/new_game', methods=['GET'])
def create_new_game():
    """
    JWT-store base game state
    """
    
    base_sequence = generate_random_letters()
    base_board = generate_board()
    board = base_board.copy()
    score = 0
    played_words = []
    complete = False
    sequence, hand = draw_hand(base_sequence)

    encoded_jwt = jwt.encode({
        'base_sequence': base_sequence,
        'base_board': base_board,
        'sequence': sequence,
        'board': board,
        'score': score,
        'played_words': played_words,
        'complete': complete,
        'hand': hand
    }, key, algorithm='HS256')

    response = jsonify({'game': encoded_jwt})
    return response, 200

@bp.route('/clear', methods=['POST'])
def clear():
    """
    Returns the game state to the original state
    """

    data = request.json
    game = data.get('game')
    if not game:
        return jsonify({'message': 'No game provided'}), 400

    decoded_jwt = jwt.decode(game, key, algorithms=['HS256'])

    base_sequence = decoded_jwt['base_sequence']
    base_board = decoded_jwt['base_board']
    board = base_board.copy()
    score = 0
    played_words = []
    complete = False
    sequence, hand = draw_hand(base_sequence)

    encoded_jwt = jwt.encode({
        'base_sequence': base_sequence,
        'base_board': base_board,
        'sequence': sequence,
        'board': board,
        'score': score,
        'played_words': played_words,
        'complete': complete,
        'hand': hand
    }, key, algorithm='HS256')

    response = jsonify({'game': encoded_jwt})
    return response, 200

@bp.route('/play', methods=['POST'])
def play_word():
    """
    Play a word on the board
    """

    data = request.json
    game = data.get('game')
    word = data.get('word')
    if not game:
        print("No game provided")
        return jsonify({'message': 'No game provided'}), 400
    if not word:
        print("No word provided")
        return jsonify({'message': 'No word provided'}), 400

    decoded_jwt = jwt.decode(game, key, algorithms=['HS256'])

    sequence = decoded_jwt['sequence']
    board = decoded_jwt['board']
    score = decoded_jwt['score']
    played_words = decoded_jwt['played_words']
    complete = decoded_jwt['complete']
    hand = decoded_jwt['hand']

    if complete:
        return jsonify({'message': 'Game is complete'}), 400
    
    if word not in all_words:
        print("Word not in dictionary")
        return jsonify({'message': 'Word not in dictionary'}), 400
    
    score = 0
    for i, letter in enumerate(word):
        if word in hand:
            hand.remove(letter)
            if board[i] is not None:
                score +=  scrabble_scores[letter] * board[i]
            else:
                score +=  scrabble_scores[letter]
        else:
            return jsonify({'message': 'Word could not be formed from hand'}), 400
    
    played_words.append(word)

    sequence, hand = draw_hand(sequence, hand)

    print(decoded_jwt['base_sequence'])
    print(decoded_jwt['base_board'])
    print(sequence)
    print(board)
    print(score)
    print(played_words)
    print(complete)
    print(hand)

    encoded_jwt = jwt.encode({
        'base_sequence': decoded_jwt['base_sequence'],
        'base_board': decoded_jwt['base_board'],
        'sequence': sequence,
        'board': board,
        'score': score,
        'played_words': played_words,
        'complete': complete,
        'hand': hand
    }, key, algorithm='HS256')

    return jsonify({'game': encoded_jwt}), 200

    

@bp.route('/games/<int:user_id>', methods=['GET'])
def get_games(user_id):
    return None

@bp.route('/')
def index():
    return render_template('game/index.html')

@bp.route('/users', methods=['GET'])
def get_users():
    db = get_db()
    users = db.execute(
        'SELECT username, score FROM user'
    ).fetchall()
    return jsonify({'users': [{'username': user['username'], 'score': user['score']} for user in users]})