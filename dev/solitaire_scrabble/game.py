import random
import string
import itertools

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
            multiplier = int(board[i][:-1])
            score += base_score * multiplier
        else: 
            score += base_score
    return score

def draw_tiles(tile_sequence, hand, num_to_draw):
    for _ in range(num_to_draw):
        if tile_sequence:
            new_tile = tile_sequence.pop(0)
            hand.append(new_tile)

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
    board = generate_board()
    print(board)
    return render_template('game/index.html', 
        users=users, 
        hand=["a", "b", "c", "d", "e", "f", "g"], 
        tile_scores = scrabble_scores,
        sequence = ["h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x"],
        board = board,
        users_serialized = [{'username': user['username'], 'score': user['score']} for user in users]
    )

@bp.route('/submit', methods=['POST'])
def submit():
    played_board = request.form['played_board']
    word = ''
    for word in played_board:
        if word != 'None':
            word += word
        else: break
    if word in all_words:
        db = get_db()
        db.execute(
            "UPDATE user SET score = score + ? WHERE username = ?",
            (calculate_word_score(word, played_board), 'test')
        )
        db.commit()
        return redirect(url_for('game.index'))
    else: return "Invalid word. Please try again."