import random
import itertools
from typing import List, Dict
import random

from ..defaults import default_bag

def generate_board(length: int = 20, bonus_types: List = [2, 3], prob_none: int = 0.75):
    """"
    Generate a random board with the given length and bonus types.
    
    length is the length of the board.
    bonus_types is a list of bonus types.
    prob_none is the probability of a cell being empty.

    Example output would be: 
    [None, 2, None, 3, None, None, 2, 3, None, None, 2, None, 3, None, None, 2, 3, None, None, 2, 3]
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