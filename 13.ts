import { runPart } from "https://deno.land/x/aocd/mod.ts";

function parse(input: string) {
  return input.split("\n\n").map((pair) =>
    pair
      .split("\n")
      .filter((list) => list)
      .map((list) => JSON.parse(list))
  );
}

function parse2(input: string) {
  return input
    .split("\n")
    .filter((list) => list)
    .map((list) => JSON.parse(list));
}

function wrap(numberOrList: any) {
  return typeof numberOrList === "object" ? numberOrList : [numberOrList];
}

function checkOrder(left: any[], right: any[]): boolean | undefined {
  for (let i = 0; i < Math.min(left.length, right.length); i++) {
    if (JSON.stringify(left[i]) === JSON.stringify(right[i])) {
      continue;
    }
    if (typeof left[i] === "number" && typeof right[i] === "number") {
      return left[i] < right[i];
    }
    const result = checkOrder(wrap(left[i]), wrap(right[i]));
    if (typeof result === "boolean") {
      return result;
    }
  }
  if (left.length === right.length) {
    return;
  }
  return left.length < right.length;
}

function part1(input: string): number {
  return parse(input).reduce(
    (sum, [left, right], i) => (checkOrder(left, right) ? sum + i + 1 : sum),
    0
  );
}

function part2(input: string): number {
  const sorted = parse2(input)
    .concat([[[2]], [[6]]])
    .sort((a, b) => (checkOrder(a, b) ? -1 : 1))
    .map((l) => JSON.stringify(l));
  return (sorted.indexOf("[[2]]") + 1) * (sorted.indexOf("[[6]]") + 1);
}

if (import.meta.main) {
  runPart(2022, 13, 1, part1);
  runPart(2022, 13, 2, part2);
}
