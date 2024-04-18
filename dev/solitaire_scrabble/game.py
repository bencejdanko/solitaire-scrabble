import string
import json

from flask import (
    Blueprint, render_template, redirect, url_for, request, jsonify, session, g
    )

from solitaire_scrabble.db import get_db

from .generation import generate_board, generate_random_letters

bp = Blueprint('game', __name__, url_prefix='/game')


@bp.route('/new_game/<int:user_id>', methods=['POST'])
def create_new_game(user_id):
    """
    Creates a new game for the given user_id.
    """

    if (session.get('user_id') != user_id) and (session.get('user_id') != 'Guest'):
        return jsonify({'error': 'Unauthorized access'}), 403

    sequence = generate_random_letters()
    board = generate_board()

    if not user_id:
        user_id = "Guest"

    db = get_db()
    db.execute(
        'INSERT INTO sequences (sequence) VALUES (?)', (json.dumps(sequence),)
    )

    sequence_id = db.execute('SELECT last_insert_rowid()').fetchone()[0]

    db.execute(
        'INSERT INTO boards (board) VALUES (?)', (json.dumps(board),)
    )

    board_id = db.execute('SELECT last_insert_rowid()').fetchone()[0]

    db.commit(
        'INSERT INTO game (user_id, sequence_id, board_id, score) VALUES (?, ?, ?, ?)',
        (user_id,sequence_id,board_id, 0)
    )

@bp.route('/games/<int:user_id>', methods=['GET'])
def get_games(user_id):

    if (session.get('user_id') != user_id) and (session.get('user_id') != 'Guest'):
        return jsonify({'error': 'Unauthorized access'}), 403

    db = get_db()
    games = db.execute(
        'SELECT id, score, complete FROM game WHERE user_id = ?', (user_id,)
    ).fetchall()

    return jsonify({'games': [{'id': game['id'], 'score': game['score'], 'complete': game['complete']} for game in games]})

@bp.route('/')
def index():
    return render_template('game/index.html')

@bp.route('/game/<int:game_id>', methods=['POST'])
def set_game_session(game_id):
    db = get_db()
    game = db.execute(
        'SELECT user_id FROM game WHERE id = ?', (game_id,)
    ).fetchone()

    if game['user_id'] != session.get('user_id') and game['user_id'] != 'Guest':
        return jsonify({'error': 'Unauthorized access'}), 403

    session['game_id'] = game_id

    return redirect(url_for('game.index'))

@bp.route('/users', methods=['GET'])
def get_users():
    db = get_db()
    users = db.execute(
        'SELECT username, score FROM user'
    ).fetchall()

    return jsonify({'users': [{'username': user['username'], 'score': user['score']} for user in users]})

@bp.route('/restart/<int:game_id>', methods=['GET'])
def clear(game_id):
    db = get_db()
    game = db.execute(
        'SELECT user_id FROM game WHERE id = ?', (game_id,)
    ).fetchone()

    return redirect(url_for('game.index'))

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



@bp.route('.<int:game_id>/complete', methods=['GET'])
def complete(game_id):
    db = get_db()
    game = db.execute(
        'SELECT user_id, score FROM game WHERE id = ?',
        (game_id,)
    ).fetchone()

    if game['user_id'] != session.get('user_id') and game['user_id'] != 'Guest':
        return jsonify({'error': 'Unauthorized access'}), 403

    return jsonify({'score': game['score']})