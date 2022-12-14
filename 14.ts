import { runPart } from "https://deno.land/x/aocd/mod.ts";

function parse(input: string): string[][] {
  const rockFormations = input
    .split("\n")
    .map((rock) =>
      rock
        .split(" -> ")
        .map((coordinates) =>
          coordinates.split(",").map((num) => parseInt(num))
        )
    );
  const [limitX, limitY] = rockFormations
    .flat()
    .reduce(
      ([limitX, limitY], [x, y]) => [Math.max(limitX, x), Math.max(limitY, y)],
      [0, 0]
    );
  const cave = [...Array(limitY + 1)].map(() =>
    [...Array(limitX + limitY)].map(() => ".")
  );

  for (const rock of rockFormations) {
    for (let i = 1; i < rock.length; i++) {
      const [startX, startY] = rock[i - 1];
      const [endX, endY] = rock[i];
      for (let x = Math.min(startX, endX); x <= Math.max(startX, endX); x++) {
        for (let y = Math.min(startY, endY); y <= Math.max(startY, endY); y++) {
          cave[y][x] = "#";
        }
      }
    }
  }
  return cave;
}

function addSand(cave: string[][]): [number, number] {
  let [sandX, sandY] = [500, 0];
  while (cave[sandY + 1]?.slice(sandX - 1, sandX + 2).includes(".")) {
    if (cave[sandY + 1][sandX] === ".") {
      sandY += 1;
    } else if (cave[sandY + 1][sandX - 1] === ".") {
      sandY += 1;
      sandX -= 1;
    } else if (cave[sandY + 1][sandX + 1] === ".") {
      sandY += 1;
      sandX += 1;
    }
  }
  return [sandX, sandY];
}

function part1(input: string) {
  const cave = parse(input.trim());
  while (true) {
    const [sandX, sandY] = addSand(cave);
    if (sandY + 1 === cave.length) {
      return cave.flat().filter((cell) => cell === "o").length;
    }
    cave[sandY][sandX] = "o";
  }
}

function part2(input: string) {
  const cave = parse(input.trim());
  cave.push([...Array(cave[0].length)].map(() => "."));
  cave.push([...Array(cave[0].length)].map(() => "#"));
  while (true) {
    const [sandX, sandY] = addSand(cave);
    if (sandY === 0) {
      cave[sandY][sandX] = "o";
      console.table(cave);
      return cave.flat().filter((cell) => cell === "o").length;
    }
    cave[sandY][sandX] = "o";
  }
}

if (import.meta.main) {
  runPart(2022, 14, 1, part1);
  runPart(2022, 14, 2, part2);
}
