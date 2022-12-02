from aocd import get_data, submit

round = [round.split(' ') for round in get_data(day=2, year=2022).splitlines()]

def result_to_score(opp: str, shape: str) -> int:
    shape_score = shape_to_score(opp)
    if shape == 'X':
        return 0 + (shape_score - 1 if shape_score > 1 else 3)
    elif shape == 'Y':
        return 3 + shape_score
    return 6 + (shape_score + 1 if shape_score < 3 else 1)

def shape_to_score(shape: str) -> int:
    if shape == 'A':
        return 1
    elif shape == 'B':
        return 2
    return 3

score = 0

for opp, result in round:
    score += result_to_score(opp, result)

submit(score)
