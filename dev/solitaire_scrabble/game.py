import random
import string
import itertools
import json
from flask import (
    jsonify, session, g
)

scrabble_scores = {
    'a': 1, 'b': 3, 'c': 3, 'd': 2, 'e': 1,
    'f': 4, 'g': 2, 'h': 4, 'i': 1, 'j': 8,
    'k': 5, 'l': 1, 'm': 3, 'n': 1, 'o': 1,
    'p': 3, 'q': 10, 'r': 1, 's': 1, 't': 1,
    'u': 1, 'v': 4, 'w': 4, 'x': 8, 'y': 4,
    'z': 10
}

def generate_board(length=20, bonus_types=['2x', '3x'], prob_none=0.75):
    sequence = []
    for _ in range(length):
        if random.random() < prob_none:
            sequence.append(None)
        else: sequence.append(random.choice(bonus_types))
    return sequence

def generate_random_letters(count=20):
    letters = string.ascii_lowercase
    return random.choices(letters, k=count)

def generate_possible_words(letters):
    
    possible_words = []
    for length in range(1, len(letters) + 1):
        for perm in itertools.permutations(letters, length):
            word = ''.join(perm)
            if word in all_words:
                possible_words.append(word)

    return possible_words

def calculate_word_score(word, board):
    score = 0
    for i, letter in enumerate(word):
        base_score = scrabble_scores[letter]
        if board[i]:
            multiplier = int(board[i][-1])
            score += base_score * multiplier
        else: 
            score += base_score
    return score

def draw_tiles(tile_sequence, hand, num_to_draw):
    new_hand = hand
    new_tile_sequence = tile_sequence

    for _ in range(num_to_draw):
        if new_tile_sequence:
            new_tile = new_tile_sequence.pop(0)
            new_hand.append(new_tile)
    return (new_tile_sequence, new_hand)

def MaxScore(tile_sequence, board, hand=[]):
    if not tile_sequence or len(hand) == 7:
        return 0

    best_score = 0
    for word in generate_possible_swords(hand):
        if word in all_words:
            new_hand = hand.copy()
            word_score = calculate_word_score(word, board)
            draw_tiles(tile_sequence, new_hand, 7- len(new_hand))
            for letter in word:
                new_hand.remove(letter)
            best_score = max(best_score, word_score + MaxScore(tile_sequence, board, new_hand))
    return best_score

all_words = set()
with open("dictionary.txt") as word_file:
    for word in word_file:
        entry = word.strip().lower()
        all_words.add(entry.lower())
word_file.close()

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
        users = [{'username': user['username'], 'score': user['score']} for user in users]
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
    data = request.get_json()
    played_board = json.loads(data['played_board'])

    db = get_db()
    game = db.execute(
        'SELECT * FROM game WHERE id = ?', (game_id,)
    ).fetchone()

    user = game['user_id']

    if user != session.get('user_id') and user != 'Guest':
        return jsonify({'error': 'Unauthorized access'}), 403

    board = json.loads(game['board'])
    hand = json.loads(game['hand'])

    word = ''
    for letter in played_board:
        if letter is not None:
            word += letter
        else: break
    
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

    else: return jsonify({'error': 'Invalid word. Please try again.'}), 400
