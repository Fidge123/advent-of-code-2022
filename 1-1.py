from aocd import get_data, submit

current = 0
sums = []

for meal in get_data(day=1, year=2022).splitlines():
    if meal == '':
        sums.append(current)
        current = 0
    else:
        current += int(meal)

submit(max(sums))
