import { runPart } from "https://deno.land/x/aocd/mod.ts";

type ThreeD = [number, number, number];

function parse(input: string): ThreeD[] {
  return input
    .split("\n")
    .map((line) => line.split(",").map((x) => parseInt(x))) as [
    number,
    number,
    number
  ][];
}

function adjacent([x, y, z]: ThreeD): ThreeD[] {
  return [
    [x - 1, y, z],
    [x + 1, y, z],
    [x, y - 1, z],
    [x, y + 1, z],
    [x, y, z - 1],
    [x, y, z + 1],
  ];
}

function part1(input: string) {
  return parse(input.trim()).reduce(
    (sum, cube, _, arr) =>
      sum +
      adjacent(cube).filter(
        (side) => !arr.some((block) => block.every((s, i) => s === side[i]))
      ).length,
    0
  );
}

if (import.meta.main) {
  runPart(2022, 18, 1, part1);
  // runPart(2022, 18, 2, part2);
}
