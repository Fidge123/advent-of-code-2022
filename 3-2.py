from aocd import get_data, submit

bags = [bag for bag in get_data(day=3, year=2022).splitlines()]

priority = 0

def find_duplicate(first: str, second: str, third: str) -> int:
    for item in first:
        if second.find(item) != -1 and third.find(item) != -1:
            return ord(item) - (38 if item.isupper() else 96)
    return 0


for group in zip(*([iter(bags)] * 3)):
    priority += find_duplicate(*group)

submit(priority)
