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

function isInScan(cube: ThreeD, scan: ThreeD[]) {
  return scan.some((block) => block.every((s, i) => s === cube[i]));
}

function part1(input: string) {
  return parse(input.trim()).reduce(
    (sum, cube, _, scan) =>
      sum + adjacent(cube).filter((side) => !isInScan(side, scan)).length,
    0
  );
}

function isObsidianOrPocket(
  cube: ThreeD,
  scan: ThreeD[],
  visited: ThreeD[] = []
): boolean {
  if (isInScan(cube, scan)) {
    return true;
  }
  if (isInScan(cube, visited)) {
    return true;
  }
  if (allAir(cube, scan)) {
    return false;
  }
  const isOOP = adjacent(cube)
    .filter((c) => !isInScan(c, visited))
    .every((side) =>
      isObsidianOrPocket(side, scan, [...pockets, ...visited, cube])
    );
  if (isOOP) {
    pockets.push(cube);
  }
  return isOOP;
}

function allAir(cube: ThreeD, scan: ThreeD[]) {
  return !(
    scan.some(
      (block) =>
        block[0] === cube[0] && block[1] === cube[1] && block[2] > cube[2]
    ) &&
    scan.some(
      (block) =>
        block[0] === cube[0] && block[1] === cube[1] && block[2] < cube[2]
    ) &&
    scan.some(
      (block) =>
        block[0] === cube[0] && block[1] > cube[1] && block[2] === cube[2]
    ) &&
    scan.some(
      (block) =>
        block[0] === cube[0] && block[1] < cube[1] && block[2] === cube[2]
    ) &&
    scan.some(
      (block) =>
        block[0] > cube[0] && block[1] === cube[1] && block[2] === cube[2]
    ) &&
    scan.some(
      (block) =>
        block[0] < cube[0] && block[1] === cube[1] && block[2] === cube[2]
    )
  );
}

const pockets = [] as ThreeD[];

function part2(input: string) {
  return parse(input.trim()).reduce((sum, cube, _, scan) => {
    const surface = adjacent(cube).filter((side) => {
      const foo = isObsidianOrPocket(side, scan, pockets);

      return !foo;
    }).length;

    return sum + surface;
  }, 0);
}

if (import.meta.main) {
  runPart(2022, 18, 1, part1);
  runPart(2022, 18, 2, part2);
}
