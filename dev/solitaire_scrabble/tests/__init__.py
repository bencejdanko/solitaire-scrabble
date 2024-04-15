from generation import generate_board, generate_random_letters, generate_possible_words
from compute import calculate_word_score, draw_hand

def test_generate_board():
    board = generate_board()
    assert len(board) == 20
    assert all(cell in [None, '2x', '3x'] for cell in board)

def test_generate_random_letters():
    letters = generate_random_letters()
    assert len(letters) == 20
    assert all(letter in 'abcdefghijklmnopqrstuvwxyz' for letter in letters)

def test_generate_possible_words():
    letters = ['a', 'b', 'c', 'd']
    all_words = {'ab', 'ad', 'bad', 'cab', 'cad', 'dab'}
    possible_words = generate_possible_words(letters, all_words)
    assert possible_words == ['ab', 'ad', 'bad', 'cab', 'cad', 'dab']

def test_calculate_word_score():
    board = ['2x', None, '3x', None, None]
    assert calculate_word_score('hello', board) == 14

def test_draw_hand():
    tile_sequence = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
    current_hand = ['a', 'b']
    new_sequence, new_hand = draw_hand(tile_sequence, current_hand)
    assert new_sequence == ['f', 'g']
    assert new_hand == ['a', 'b', 'a', 'b', 'c', 'd', 'e']

    tile_sequence = ['a', 'b', 'c']
    current_hand = ['a', 'b']
    new_sequence, new_hand = draw_hand(tile_sequence, current_hand)
    assert new_sequence == []
    assert new_hand == ['a', 'b', 'a', 'b', 'c']

def run_tests():
    test_generate_board()
    test_generate_random_letters()
    test_generate_possible_words()

    test_calculate_word_score()
    test_draw_hand()