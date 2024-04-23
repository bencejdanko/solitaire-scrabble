import string
import json

from flask import (
    Blueprint, render_template, redirect, url_for, request, jsonify, session, g
    )

from solitaire_scrabble.db import get_db

from .generation import generate_board, generate_random_letters
from .compute import draw_hand, calculate_word_score, hand_from_word, max_scoring_word, max_score
from .defaults import scrabble_scores, default_bag, all_words

import jwt
key = 'verysecretkey'

def encode(base_sequence, base_board, sequence, board, score, played_words, complete, hand):
    try:
        encode = jwt.encode({
        'base_sequence': base_sequence,
        'base_board': base_board,
        'sequence': sequence,
        'board': board,
        'score': score,
        'played_words': played_words,
        'complete': complete,
        'hand': hand
        }, key, algorithm='HS256')

        return encode, None
        
    except Exception as e:
        return None, e
    

def decode(game):
    decoded_jwt = {}
    try: 
        decoded_jwt = jwt.decode(game, key, algorithms=['HS256'])
        decoded_jwt = json.loads(json.dumps(decoded_jwt))
    except Exception as e:
        return None, e
    expected_attributes = ['base_sequence', 'base_board', 'sequence', 'board', 'score', 'played_words', 'complete', 'hand']
    for attr in expected_attributes:
        if attr not in decoded_jwt:
            return None, Exception(f"Missing attribute {attr}")
    return decoded_jwt, None

bp = Blueprint('game', __name__, url_prefix='/game')

@bp.route('/letter_scores', methods=['GET'])
def letter_scores():
    return jsonify(scrabble_scores), 200

@bp.route('/new_game', methods=['GET'])
def create_new_game():
    """
    JWT-store base game state
    """
    hand = []

    base_sequence = generate_random_letters()
    base_board = generate_board()
    board = base_board.copy()
    score = 0
    played_words = []
    complete = False
    sequence, hand = draw_hand(base_sequence, hand)

    encoded, err = encode(base_sequence, base_board, sequence, board, score, played_words, complete, hand)
    if err:
        return jsonify({'message': str(err)}), 400

    response = jsonify({'game': encoded})
    return response, 200

@bp.route('/hint', methods=['POST'])
def hint():
    """
    a simple hint: returns the highest scoring word you can play.
    """
    
    data = request.json
    game = data.get('game')
    if not game:
        return jsonify({'message': 'No game provided'}), 400
    
    decoded, err = decode(game)
    if err:
        return jsonify({'message': str(err)}), 400

    sequence = decoded['sequence']
    board = decoded['board']
    score = decoded['score']
    played_words = decoded['played_words']
    complete = decoded['complete']
    hand = decoded['hand']

    if complete:
        return jsonify({'message': 'Game is already complete'}), 400

    best_word, score = max_scoring_word(sequence, hand, board)
    if not best_word:
        return jsonify({'message': 'No possible words'}), 400
    
    return jsonify({'word': best_word, 'score': score }), 200

@bp.route('/complex_hint', methods=['POST'])
def complex_hint():
    """
    Returns the highest theoretical score you can get on the board
    """

    data = request.json
    game = data.get('game')
    if not game:
        return jsonify({'message': 'No game provided'}), 400
    
    decoded, err = decode(game)
    if err:
        return jsonify({'message': str(err)}), 400

    sequence = decoded['sequence']
    board = decoded['board']
    complete = decoded['complete']
    hand = decoded['hand']

    if complete:
        return jsonify({'message': 'Game is already complete'}), 400

    max_result, max_words = max_score(sequence, board, hand)

    return jsonify({'max_result': max_result, 'max_words': max_words}), 200

@bp.route('/restart', methods=['POST'])
def restart():
    """
    Returns the game state to the original state
    """

    print('restarting')

    data = request.json
    game = data.get('game')
    if not game:
        return jsonify({'message': 'No game provided'}), 400
    
    decoded, err = decode(game)
    if err:
        return jsonify({'message': str(err)}), 400


    base_sequence = decoded['base_sequence']
    base_board = decoded['base_board']

    print(decoded)
    print(base_sequence)
    print(base_board)

    board = base_board.copy()
    score = 0
    played_words = []
    complete = False
    sequence, hand = draw_hand(base_sequence)

    encoded, err = encode(base_sequence, base_board, sequence, board, score, played_words, complete, hand)

    response = jsonify({'game': encoded})
    return response, 200

@bp.route('/finish' , methods=['POST'])
def finish_game():
    """
    Finish the game
    """

    data = request.json
    game = data.get('game')
    if not game:
        return jsonify({'message': 'No game provided'}), 400
    
    user_id = data.get('user_id')
    if not user_id:
        return jsonify({'message': 'No user_id provided'}), 400
    
    decoded, err = decode(game)
    if err:
        return jsonify({'message': str(err)}), 400

    sequence = decoded['sequence']
    board = decoded['board']
    score = decoded['score']
    played_words = decoded['played_words']
    complete = True
    hand = decoded['hand']

    encoded, err = encode(decoded['base_sequence'], decoded['base_board'], sequence, board, score, played_words, complete, hand)

    db = get_db()

    current_score = db.execute(
        'SELECT score FROM user WHERE id = ?', (user_id,)
    ).fetchone()['score']

    score += current_score
    
    db.execute(
        'UPDATE user SET score = ? WHERE id = ?', (score, user_id)
    )

    db.commit()

    response = jsonify({'game': encoded})
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
        return jsonify({'message': 'No game provided'}), 400
    if not word:
        return jsonify({'message': 'No word provided'}), 400

    decoded_jwt, err = decode(game)
    if err:
        return jsonify({'message': str(err)}), 400

    sequence = decoded_jwt['sequence']
    board = decoded_jwt['board']
    score = decoded_jwt['score']
    played_words = decoded_jwt['played_words']
    complete = decoded_jwt['complete']
    hand = decoded_jwt['hand']

    if complete:
        return jsonify({'message': 'Game is already complete'}), 400
    
    if word not in all_words:
        return jsonify({'message': 'Word not in dictionary'}), 400
    
    hand, err = hand_from_word(hand, word)
    if err:
        return jsonify({'message': str(err)}), 400

    score += calculate_word_score(word, board)

    board = board[len(word):]
    sequence, hand = draw_hand(sequence, hand)
    
    played_words.append(word)

    encoded_jwt, err = encode(decoded_jwt['base_sequence'], decoded_jwt['base_board'], sequence, board, score, played_words, complete, hand)

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