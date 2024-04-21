import string
import json

from flask import (
    Blueprint, render_template, redirect, url_for, request, jsonify, session, g
    )

from solitaire_scrabble.db import get_db

from .generation import generate_board, generate_random_letters
from .compute import draw_hand

import jwt
key = 'verysecretkey'

bp = Blueprint('game', __name__, url_prefix='/game')


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
    
@bp.route('/board/<int:board_id>', methods=['GET'])
def get_board(board_id):

    db = get_db()
    board = db.execute(
        'SELECT board FROM boards WHERE id = ?',
        (board_id,)
    ).fetchone()

    return jsonify({'board': json.loads(board['board'])})

@bp.route('/<int:game_id>/hand', methods=['GET'])
def get_hand(game_id):
    db = get_db()
    game = db.execute(
        'SELECT user_id, played_words, board_id FROM game WHERE id = ?',
        (game_id,)
    ).fetchone()

    if game['user_id'] != session.get('user_id') and game['user_id'] != 'Guest':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    board = db.execute(
        'SELECT board FROM boards WHERE id = ?',
        (game['board_id'],)
    ).fetchone()
    board = json.loads(board['board'])
    #keep drawing from sequence until current hand


    return jsonify({'hand': json.loads(game['hand'])})

@bp.route('/<int:game_id>/played_words', methods=['GET'])
def get_played_words(game_id):
    db = get_db()
    game = db.execute(
        'SELECT user_id, played_words FROM game WHERE id = ?',
        (game_id,)
    ).fetchone()

    if game['user_id'] != session.get('user_id') and game['user_id'] != 'Guest':
        return jsonify({'error': 'Unauthorized access'}), 403

    return jsonify({'played_words': json.loads(game['played_words'])})

@bp.route('/<int:game_id>/score', methods=['GET'])
def get_score(game_id):
    db = get_db()
    game = db.execute(
        'SELECT user_id, score FROM game WHERE id = ?',
        (game_id,)
    ).fetchone()

    if game['user_id'] != session.get('user_id') and game['user_id'] != 'Guest':
        return jsonify({'error': 'Unauthorized access'}), 403

    return jsonify({'score': game['score']})

@bp.route('<int:game_id>/complete', methods=['GET'])
def complete(game_id):
    db = get_db()
    game = db.execute(
        'SELECT user_id, score FROM game WHERE id = ?',
        (game_id,)
    ).fetchone()

    if game['user_id'] != session.get('user_id') and game['user_id'] != 'Guest':
        return jsonify({'error': 'Unauthorized access'}), 403

    return jsonify({'score': game['score']})