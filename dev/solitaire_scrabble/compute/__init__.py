from typing import Dict, List, Tuple

from ..defaults import scrabble_scores

def calculate_word_score(word: str, board: List[str], scrabble_scores: Dict[str, int] = scrabble_scores) -> int:
    """
    Calculate the score of a word given a board and a dictionary of scrabble scores.

    word is the word to calculate the score of.
    board is the board to calculate the score on.
    scrabble_scores is a dictionary of scrabble scores.

    Example output would be:
    calculate_word_score('hello', ['2x', None, '3x', None, None], scrabble_scores)
    (4*2) + (1) + (1*3) + (1) + (1) = 14
    """
    score: int = 0
    for i, letter in enumerate(word):
        base_score: int = scrabble_scores[letter]
        if board[i]: 
            multiplier: int = int(board[i][0])
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
    new_hand: List[str] = current_hand
    new_sequence: List[str] = tile_sequence
    while len(new_hand) < hand_size:
        # handle if the sequence is empty
        if not new_sequence:
            break
        new_hand.append(new_sequence.pop(0))
    return new_sequence, new_hand

def MaxScoringWord(tile_sequence: List[str], current_hand: List[str], all_words: List[str], board: List[str]) -> Tuple[str, int]:
    """
    Given a sequence of tiles, a current hand, a list of all possible words, and a board, return the word with the maximum score and the score.

    tile_sequence is a sequence of tiles.
    current_hand is the current hand.
    all_words is a list of all possible words.
    board is the board to calculate the score on.

    Example output would be:
    MaxScore(['a', 'b', 'c', 'd', 'e', 'f', 'g'], ['a', 'b'], ['ab', 'ad', 'bad', 'cab', 'cad', 'dab'], ['2x', None, '3x', None, None])
    ('bad', 14)
    """
    max_score: int = 0
    max_word: str = ''
    for word in all_words:
        new_sequence, new_hand = draw_hand(tile_sequence, current_hand)
        score: int = calculate_word_score(word, board)
        if score > max_score:
            max_score = score
            max_word = word
    return max_word, max_score

def MaxScore(tile_sequence: List[str], board: List[str], hand: List[str]) -> Tuple[str, int]:
    """
    Given a game subset (upcoming tile sequence, the board, and the hand), evaluate the maximum scoring 
    word plays, and return the value of the maximum scoring sequence, as well as the highest scoring word
    in that sequence.
    """
    return None, 0
