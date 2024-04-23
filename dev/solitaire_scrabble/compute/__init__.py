from typing import Dict, List, Tuple

import itertools
from ..defaults import scrabble_scores, all_words

def hand_from_word(letters: List[str], word: str) -> Tuple[List[str], Exception]:
    """
    Check if a list of letters can make a word, and if they can, remove their letters from the hand and return it.

    letters is a list of letters.
    word is the word to check.

    Example output would be:
    hand_from_word(['a', 'b', 'c'], 'cab')
    ['a', 'b'], None
    """

    letters = letters.copy()
    for letter in word:
        if letter not in letters:
            return None, Exception(f"Letter {letter} not in hand.")
        letters.remove(letter)
    return letters, None

def calculate_word_score(word: str, board: List[str], scrabble_scores: Dict[str, int] = scrabble_scores) -> int:
    """
    Calculate the score of a word given a board and a dictionary of scrabble scores.

    word is the word to calculate the score of.
    board is the board to calculate the score on.
    scrabble_scores is a dictionary of scrabble scores.

    Example output would be:
    calculate_word_score('hello', [2, None, 3, None, None], scrabble_scores)
    (4*2) + (1) + (1*3) + (1) + (1) = 14
    """
    score: int = 0
    for i, letter in enumerate(word):
        base_score: int = scrabble_scores[letter]
        if board[i]: 
            multiplier: int = board[i]
            score += base_score * multiplier
        else: 
            score += base_score
    return score

def draw_hand(tile_sequence: List[str], current_hand: List[str] = [], hand_size: int = 7) -> Tuple[List[str], List[str]]:
    """
    Given a sequence of tiles and a current hand, draw a new hand and return the new hand and the new sequence.

    tile_sequence is a sequence of tiles.
    current_hand is the current hand.
    hand_size is the size of the hand.

    Example output would be:
    draw_hand(['a', 'b', 'c', 'd', 'e', 'f', 'g'], ['a', 'b'], 7)
    (['f', 'g'], ['a', 'b', 'a', 'b', 'c', 'd', 'e'])
    """
    new_hand: List[str] = current_hand.copy()
    new_sequence: List[str] = tile_sequence.copy()

    while len(new_hand) < hand_size:
        # handle if the sequence is empty
        if not new_sequence:
            break
        new_hand.append(new_sequence.pop(0))
    return new_sequence, new_hand

def max_scoring_word(tile_sequence: List[str], current_hand: List[str], board: List[str]) -> Tuple[str, int]:
    """
    Given a current hand and a board, return the word with the maximum score and the score.

    current_hand is the current hand.
    board is the board to calculate the score on.

    Example output would be:
    MaxScore(['a', 'b', 'c', 'd', 'e', 'f', 'g'], ['2x', None, '3x', None, None])
    ('bad', 14)
    """
    words = possible_words(current_hand)
    if len(words) == 0:
        return None, 0

    best_word = max(words, key=lambda word: calculate_word_score(word, board))
    return best_word, calculate_word_score(best_word, board)

mem = {}
def max_score(tile_sequence: List[str], board: List[str], hand: List[str], iterations: int = 2) -> Tuple[int, List[str]]:
    """
    Look for the highest scoring word placements, iterations moves ahead.
    """

    hand_words = possible_words(hand.copy())

    if iterations == 0:
        return 0, hand_words

    if len(hand_words) == 0:
        return 0, hand_words

    if len(tile_sequence) == 0:
        return 0, hand_words
    
    max_combo = (0, '')

    for word in hand_words:
        word_score = calculate_word_score(word, board)
        new_hand, _ = hand_from_word(hand, word)
        new_sequence, hand_drawn = draw_hand(tile_sequence, new_hand)
        new_board = board[len(word):]

        new_hand_words = possible_words(hand_drawn)
        for new_word in new_hand_words:
            new_word_score = calculate_word_score(new_word, new_board)
            if new_word_score + word_score > max_combo[0]:
                max_combo = (new_word_score + word_score, word + ' ' + new_word)
    
    return max_combo

def possible_words(letters: List[str]) -> set[str]:
    """
    Find all possible words given a list of letters and a set of all possible words.

    letters is a list of letters.
    all_words is a set of all possible words.
    """
    possible_words: set[str] = set()
    for length in range(1, len(letters) + 1):
        for perm in itertools.permutations(letters, length):
            word = ''.join(perm)
            if word in all_words:
                possible_words.add(word)
    return list(possible_words)