from aocd import get_data, submit

def sum_calories(elf: str) -> int:
    return sum(int(cal) for cal in elf.split('\n'))

def top3(cal: list[int]) -> int:
    return sum(sorted(cal)[-3:])

submit(top3([sum_calories(elf) for elf in get_data(day=1, year=2022).split('\n\n')]))
