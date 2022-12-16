import { runPart } from "https://deno.land/x/aocd/mod.ts";

interface Range {
  start: number;
  end: number;
  gaps?: Range[];
}

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
    }));
}

function manhattan(
  sensorX: number,
  sensorY: number,
  beaconX: number,
  beaconY: number
) {
  return Math.abs(sensorX - beaconX) + Math.abs(sensorY - beaconY);
}

function getBlocked(sensorData: Record<string, number>[], line: number): Range {
  return sensorData
    .map(({ sensorX, sensorY, distance }): Range | undefined => {
      const d = distance - Math.abs(line - sensorY);
      if (d > 0) {
        return {
          start: sensorX - d,
          end: sensorX + d,
        };
      }
    })
    .filter((range): range is Range => typeof range !== "undefined")
    .sort((a, b) => a.start - b.start)
    .reduce((prev, curr) => {
      if (curr.start - prev.end > 1) {
        prev.gaps = [
          ...(prev.gaps ?? []),
          { start: prev.end + 1, end: curr.start - 1 },
        ];
      }
      prev.end = Math.max(prev.end, curr.end);
      return prev;
    });
}

function calc(range: Range): number {
  return (
    1 +
    range.end -
    range.start -
    (range.gaps?.reduce((sum, gap) => sum + gap.end - gap.start, 0) ?? 0)
  );
}

function part1(input: string) {
  const sensorData = parse(input);
  return (
    calc(getBlocked(sensorData, 2_000_000)) -
    new Set(
      sensorData
        .filter(({ beaconY }) => beaconY === 2_000_000)
        .map(({ beaconX }) => beaconX)
    ).size
  );
}

function part2(input: string) {
  const sensorData = parse(input);
  for (let y = 0; y <= 4_000_000; y++) {
    const b = getBlocked(sensorData, y);
    if (b.gaps?.length || b.start > 0 || b.end < 4_000_000) {
      return b.gaps![0].start * 4_000_000 + y;
    }
  }
  return -1;
}

if (import.meta.main) {
  runPart(2022, 15, 1, part1);
  runPart(2022, 15, 2, part2);
}
