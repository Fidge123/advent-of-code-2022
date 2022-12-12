import { runPart } from "https://deno.land/x/aocd/mod.ts";

function findSmallest(
  distanceMap: number[][],
  visited: string[][]
): [number, number] {
  const smallestRows = distanceMap.map((row, x) =>
    Math.min(...row.filter((_, y) => !visited[x][y]))
  );
  const smallestTile = Math.min(...smallestRows);
  const x = smallestRows.indexOf(smallestTile);

  return [
    x,
    distanceMap[x].findIndex(
      (tile, y) => !visited[x][y] && smallestTile === tile
    ),
  ];
}

function check(
  x: number,
  y: number,
  modX: number,
  modY: number,
  visited: string[][],
  heightMap: number[][],
  distanceMap: number[][]
) {
  if (
    x + modX >= 0 &&
    x + modX < distanceMap.length &&
    y + modY >= 0 &&
    y + modY < distanceMap[x + modX].length &&
    !visited[x + modX][y + modY] &&
    heightMap[x + modX][y + modY] - heightMap[x][y] <= 1
  ) {
    distanceMap[x + modX][y + modY] = Math.min(
      distanceMap[x][y] + 1,
      distanceMap[x + modX][y + modY]
    );
  }
}

function findTile(map: string[][], tile: string) {
  const x = map.findIndex((row) => row.includes(tile));
  return [x, map[x].indexOf(tile)];
}

function dijsktra(
  map: string[][],
  toHeight: (tile: string) => number,
  startTile: string,
  endTile: string
) {
  let [currentX, currentY] = findTile(map, startTile);

  const distanceMap = map.map((row) => row.map(() => Infinity));
  distanceMap[currentX][currentY] = 0;

  const heightMap = map.map((row) => row.map((tile) => toHeight(tile)));
  const visited: string[][] = map.map(() => []);

  while (!visited.some((row) => row.some((tile) => tile === endTile))) {
    check(currentX, currentY, 0, 1, visited, heightMap, distanceMap);
    check(currentX, currentY, 0, -1, visited, heightMap, distanceMap);
    check(currentX, currentY, 1, 0, visited, heightMap, distanceMap);
    check(currentX, currentY, -1, 0, visited, heightMap, distanceMap);
    visited[currentX][currentY] = map[currentX][currentY];
    [currentX, currentY] = findSmallest(distanceMap, visited);
  }
  return distanceMap[currentX][currentY];
}

function part1(input: string) {
  return dijsktra(
    input.split("\n").map((row) => row.split("")),
    (tile) =>
      "SE".includes(tile)
        ? tile === "S"
          ? 0
          : 25
        : tile.charCodeAt(0) - "a".charCodeAt(0),
    "S",
    "E"
  );
}

function part2(input: string) {
  return dijsktra(
    input.split("\n").map((row) => row.replace("S", "a").split("")),
    (tile) =>
      tile === "E" ? 0 : Math.abs(tile.charCodeAt(0) - "z".charCodeAt(0)),
    "E",
    "a"
  );
}

if (import.meta.main) {
  runPart(2022, 12, 1, part1);
  runPart(2022, 12, 2, part2);
}
