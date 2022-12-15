import { runPart } from "https://deno.land/x/aocd/mod.ts";

function parse(input: string) {
  return [
    ...input.matchAll(
      /.*?x=(?<sensorX>-?\d+), y=(?<sensorY>-?\d+).*?x=(?<beaconX>-?\d+), y=(?<beaconY>-?\d+)/gm
    ),
  ]
    .map((match) =>
      Object.fromEntries(
        Object.entries(match.groups!).map(([key, value]) => [
          key,
          parseInt(value),
        ])
      )
    )
    .map(({ sensorX, sensorY, beaconX, beaconY }) => ({
      sensorX,
      sensorY,
      beaconX,
      beaconY,
      distance: manhattan(sensorX, sensorY, beaconX, beaconY),
    }))
    .sort((a, b) => b.distance - a.distance);
}

function manhattan(
  sensorX: number,
  sensorY: number,
  beaconX: number,
  beaconY: number
) {
  return Math.abs(sensorX - beaconX) + Math.abs(sensorY - beaconY);
}

function getBlocked(sensorData: Record<string, number>[], line: number) {
  const blocked = new Set();

  for (const { sensorX, sensorY, distance } of sensorData) {
    const blockDistance = distance - Math.abs(line - sensorY);

    for (let i = 0; i <= blockDistance; i++) {
      blocked.add(sensorX + i);
      blocked.add(sensorX - i);
    }
  }
  return blocked;
}

function part1(input: string) {
  const sensorData = parse(input);
  const blocked = getBlocked(sensorData, 2_000_000);
  for (const { beaconX, beaconY } of sensorData) {
    if (beaconY === 2_000_000) {
      blocked.delete(beaconX);
    }
  }
  return blocked.size;
}

function part2(input: string) {
  const sensorData = parse(input);
  const area = [...Array(4_000_000)].map(() =>
    [...Array(4_000_000)].map(() => true)
  );
}

if (import.meta.main) {
  runPart(2022, 15, 1, part1);
  // runPart(2022, 15, 2, part2);
}
