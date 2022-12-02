from aocd import get_data, submit

round = [round.split(' ') for round in get_data(day=2, year=2022).splitlines()]

def shape_to_score(shape: str) -> int:
    if shape == 'X' or shape == 'A':
        return 1
    elif shape == 'Y' or shape == 'B':
        return 2
    return 3

def result_to_score(opp: int, own: int) -> int:
    if own - opp == 1 or opp - own == 2:
        return 6
    if own == opp:
        return 3
    return 0

score = 0

for opp, own in round:
    score += shape_to_score(own)
    score += result_to_score(shape_to_score(opp), shape_to_score(own))

submit(score)
