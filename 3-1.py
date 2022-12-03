from aocd import get_data, submit

def split_compartments(bag: str) -> tuple[str, str]:
    pivot = int(len(bag)/2)
    return (bag[:pivot], bag[pivot:])

bags = [split_compartments(bag) for bag in get_data(day=3, year=2022).splitlines()]

priority = 0

def find_duplicate(compartment1: str, compartment2: str) -> int:
    for item in compartment1:
        if compartment2.find(item) != -1:
            return ord(item) - (38 if item.isupper() else 96)
    return 0


for compartment1, compartment2 in bags:
    priority += find_duplicate(compartment1, compartment2)

submit(priority)
