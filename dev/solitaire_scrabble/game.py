import string
import json
from flask import (
    jsonify, session, g
)


from flask import (
    Blueprint, render_template, redirect, url_for, request
    )

from solitaire_scrabble.db import get_db

bp = Blueprint('game', __name__, url_prefix='/game')

@bp.route('/')
def index():
    db = get_db()
    users = db.execute(
        'SELECT username, score FROM user'
    ).fetchall()
    
    return render_template('game/index.html',
        users=[{'username': user['username'], 'score': user['score']} for user in users]
    )

@bp.route('/start', methods=['GET'])
def start():
    user_id = session.get('user_id')
    if not user_id:
        user_id = "Guest"

    starting_sequence = generate_random_letters()
    board = generate_board()
    hand = []
    sequence, hand = draw_tiles(starting_sequence, hand, 7)

    db = get_db()
    db.execute(
        'INSERT INTO game (user_id, board, starting_sequence, hand, sequence, score) VALUES (?, ?, ?, ?, ?, ?)',
        (user_id, json.dumps(board), json.dumps(starting_sequence), json.dumps(hand), json.dumps(sequence), 0)
    )
    db.commit()

    game_id = db.execute('SELECT last_insert_rowid()').fetchone()[0]
    session['game_id'] = game_id
    return jsonify({'game_id': game_id}), 201

@bp.route('/<int:game_id>', methods=['GET'])
def getData(game_id):
    db = get_db()
    game = db.execute(
        'SELECT * FROM game WHERE id = ?',
        (game_id,)
    ).fetchone()

    if game['user_id'] == session.get('user_id') or game['user_id'] == 'Guest':
        return jsonify({
            'board': json.loads(game['board']),
            'score': game['score'],
            'sequence': json.loads(game['sequence']),
            'hand': json.loads(game['hand']),
            'tile_scores': scrabble_scores,
        })
    else:
        return jsonify({'error': 'Unauthorized access'}), 403

@bp.route('/clear', methods=['GET'])
def clear():
    session.clear()
    return redirect(url_for('game.index'))

@bp.route('/<int:game_id>', methods=['POST'])
def submit(game_id):
    print('submitting word')

    data = request.get_json()
    played_board = json.loads(data['played_board'])

    print(played_board)

    db = get_db()
    game = db.execute(
        'SELECT * FROM game WHERE id = ?', (game_id,)
    ).fetchone()

    if not game:
        return jsonify({'error': 'Game not found'}), 404

    user = game['user_id']

    if user != session.get('user_id') and user != 'Guest':
        return jsonify({'error': 'Unauthorized access'}), 403

    board = json.loads(game['board'])
    print(board)

    already_played = 0
    for i, symbol in enumerate(board):
        if symbol is None:
            break
        elif symbol[-1] == '*':
            already_played += 1
    
    played_board = played_board[already_played:]
    board = board[already_played:]
    print(played_board)
    print(board)


    hand = json.loads(game['hand'])
    print(hand)

    word = ''
    for letter in played_board:
        if letter is not None:
            word += letter
        else: break
    print(f'played word: {word}')
    
    for char in word:
        if char in hand:
            hand.remove(char)
        else: return jsonify({'error': 'Invalid word. Please try again.'}), 400

    if word in all_words:
        db = get_db()
        db.execute(
            'UPDATE game SET score = score + ? WHERE id = ?',
            (calculate_word_score(word, board), game_id)
        )

        # I need to update the board, hand, sequence.


        new_sequence, new_hand = draw_tiles(json.loads(game['sequence']), hand, 7-len(word))
        for i, letter in enumerate(word):
            board[i] = letter + '*'

        db.execute(
            'UPDATE game SET board = ?, hand = ?, sequence = ? WHERE id = ?',
            (json.dumps(board), json.dumps(new_hand), json.dumps(new_sequence), game_id)
        )

        db.commit()
        return jsonify({'success': 'Word submitted successfully!'}), 201

    else: 
        print('word is invalid')
        return jsonify({'error': 'Invalid word. Please try again.'}), 200
