from aocd import get_data, submit

def parse_assignment(assignment: str) -> list[list[int]]:
    return [list(map(int, elf.split('-'))) for elf in assignment.split(',')]

assignments = [parse_assignment(assignment) for assignment in get_data(day=4, year=2022).splitlines()]

count = 0

for index, ((start1, end1), (start2, end2)) in enumerate(assignments):
    if (start1 <= start2 and end1 >= end2) or (start2 <= start1 and end2 >= end1):
        count += 1

print(count)
