import { runPart } from "https://deno.land/x/aocd/mod.ts";

interface Command {
  x: number;
  y: number;
  amount: number;
}

type Coordinates = [number, number];

function translate(direction: string): number {
  return "LD".includes(direction) ? -1 : 1;
}

function parse(input: string): Command[] {
  return input
    .split("\n")
    .map((line) => line.split(" "))
    .map(([direction, amount]) => ({
      x: "LR".includes(direction) ? translate(direction) : 0,
      y: "UD".includes(direction) ? translate(direction) : 0,
      amount: parseInt(amount),
    }));
}

function direction(start: Coordinates, end: Coordinates): Coordinates {
  return [start[0] - end[0], start[1] - end[1]];
}

function moveTail(head: Coordinates, tail: Coordinates): Coordinates {
  const dir = direction(head, tail);
  if (Math.abs(dir[0]) + Math.abs(dir[1]) >= 3) {
    return [tail[0] + (dir[0] > 0 ? 1 : -1), tail[1] + (dir[1] > 0 ? 1 : -1)];
  }
  if (Math.abs(dir[0]) >= 2) {
    return [tail[0] + (dir[0] > 0 ? 1 : -1), tail[1]];
  }
  if (Math.abs(dir[1]) >= 2) {
    return [tail[0], tail[1] + (dir[1] > 0 ? 1 : -1)];
  }
  return tail;
}

function part1(input: string): number {
  const commands = parse(input);

  // x,y - x from left to right, y from down to up
  let head = [0, 0] as Coordinates;
  let tail = [0, 0] as Coordinates;
  const history = new Set();
  history.add(JSON.stringify(tail));

  for (const command of commands) {
    for (let i = 0; i < command.amount; i++) {
      head = [head[0] + command.x, head[1] + command.y];
      tail = moveTail(head, tail);
      history.add(JSON.stringify(tail));
    }
  }

  return history.size;
}

function part2(input: string): number {
  const commands = parse(input);

  // x,y - x from left to right, y from down to up
  const knots = [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ] as Coordinates[];
  const history = new Set();
  history.add(JSON.stringify(knots[9]));

  for (const command of commands) {
    for (let i = 0; i < command.amount; i++) {
      for (const [index, knot] of knots.entries()) {
        knots[index] =
          index === 0
            ? [knot[0] + command.x, knot[1] + command.y]
            : moveTail(knots[index - 1], knot);
      }
      history.add(JSON.stringify(knots[9]));
    }
  }

  return history.size;
}

if (import.meta.main) {
  runPart(2022, 9, 1, part1);
  runPart(2022, 9, 2, part2);
}
