import random
import itertools
from typing import List, Dict
import random

from ..defaults import default_bag

def generate_board(length: int = 20, bonus_types: List = ['2x', '3x'], prob_none: int = 0.75):
    """"
    Generate a random board with the given length and bonus types.
    
    length is the length of the board.
    bonus_types is a list of bonus types.
    prob_none is the probability of a cell being empty.

    Example output would be: 
    [None, '2x', None, '3x', None, None, '2x', '3x', None, None, '2x', None, '3x', None, None, '2x', '3x', None, None, '2x', '3x']
    """
    sequence = []
    for _ in range(length):
        if random.random() < prob_none:
            sequence.append(None)
        else: sequence.append(random.choice(bonus_types))
    return sequence

def generate_random_letters(count: int = 20, default_bag: Dict[str, int] = default_bag) -> List[str]:
    """
    Generate a list of random letters, given the ratios of letters in a given bag.

    count is the number of letters to generate.
    default_bag is the bag of letters to draw from.
    """

    letters: List[str] = []
    for _ in range(count):
        total_weight: int = sum(default_bag.values())
        random_value: int = random.randint(1, total_weight)
        cumulative_weight: int = 0
        for letter, weight in default_bag.items():
            cumulative_weight += weight
            if random_value <= cumulative_weight:
                letters.append(letter)
                break
    random.shuffle(letters)
    return letters

def generate_possible_words(letters, all_words):
    """
    Generate a list of possible words given a list of letters and a set of all possible words.

    letters is a list of letters.
    all_words is a set of all possible words.
    """
    possible_words: List[str] = []
    for length in range(1, len(letters) + 1):
        for perm in itertools.permutations(letters, length):
            word = ''.join(perm)
            if word in all_words:
                possible_words.append(word)
    return possible_words