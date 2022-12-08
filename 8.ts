import { runPart } from "https://deno.land/x/aocd/mod.ts";

function isVisible(arr: number[][], x: number, y: number): boolean {
  if (x === 0 || y === 0 || x === arr.length - 1 || y === arr[0].length - 1) {
    return true;
  }

  const north = Math.max(...arr.slice(0, x).map((e) => e[y]));
  const south = Math.max(...arr.slice(x + 1).map((e) => e[y]));
  const west = Math.max(...arr[x].slice(0, y));
  const east = Math.max(...arr[x].slice(y + 1));
  return arr[x][y] > Math.min(north, south, west, east);
}

function parse(input: string): number[][] {
  return input
    .trim()
    .split("\n")
    .map((row) => row.split("").map((tree) => parseInt(tree)));
}

function part1(input: string): number {
  return parse(input).reduce(
    (sum, row, x, arr) =>
      sum +
      row.reduce(
        (vis, _, y) => (isVisible(arr, x, y) ? vis : vis - 1),
        row.length
      ),
    0
  );
}

function alt(value: number, all: number) {
  return value !== -1 ? value : all;
}

function score(arr: number[][], x: number, y: number): number {
  if (x === 0 || y === 0 || x === arr.length - 1 || y === arr[0].length - 1) {
    return 0;
  }
  const heightLimit = arr[x][y];

  const north = arr.slice(0, x).map((e) => e[y]);
  const northScore =
    x -
    alt(
      north.findLastIndex((tree) => tree >= heightLimit),
      0
    );
  const south = arr.slice(x + 1).map((e) => e[y]);
  const southScore =
    alt(
      south.findIndex((tree) => tree >= heightLimit),
      south.length - 1
    ) + 1;
  const west = arr[x].slice(0, y);
  const westScore =
    y -
    alt(
      west.findLastIndex((tree) => tree >= heightLimit),
      0
    );
  const east = arr[x].slice(y + 1);
  const eastScore =
    alt(
      east.findIndex((tree) => tree >= heightLimit),
      east.length - 1
    ) + 1;

  return northScore * southScore * westScore * eastScore;
}

function part2(input: string): number {
  return parse(input).reduce(
    (high, row, x, matrix) =>
      Math.max(
        high,
        row.reduce((high, _, y) => Math.max(high, score(matrix, x, y)), 0)
      ),
    0
  );
}

if (import.meta.main) {
  runPart(2022, 8, 1, part1);
  runPart(2022, 8, 2, part2);
}
