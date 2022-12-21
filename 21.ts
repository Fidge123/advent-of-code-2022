import { runPart } from "https://deno.land/x/aocd/mod.ts";
import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";

interface Monkey {
  id: string;
  value: () => number;
}

function parse(input: string) {
  const monkeys = [] as Monkey[];
  for (const { id, value } of input
    .split("\n")
    .map((line) => line.split(": "))
    .map(([id, value]) => ({ id, value }))) {
    const number = parseInt(value);
    if (!isNaN(number)) {
      monkeys.push({
        id,
        value: () => number,
      });
    } else {
      const [first, op, second] = value.split(" ");
      monkeys.push({
        id,
        value: () => {
          switch (op) {
            case "+":
              return (
                monkeys.find((m) => m.id === first)!.value() +
                monkeys.find((m) => m.id === second)!.value()
              );
            case "=":
              return (
                monkeys.find((m) => m.id === first)!.value() -
                monkeys.find((m) => m.id === second)!.value()
              );
            case "-":
              return (
                monkeys.find((m) => m.id === first)!.value() -
                monkeys.find((m) => m.id === second)!.value()
              );
            case "*":
              return (
                monkeys.find((m) => m.id === first)!.value() *
                monkeys.find((m) => m.id === second)!.value()
              );
            case "/":
            default:
              return (
                monkeys.find((m) => m.id === first)!.value() /
                monkeys.find((m) => m.id === second)!.value()
              );
          }
        },
      });
    }
  }
  return monkeys;
}

function part1(input: string) {
  return parse(input.trim())
    .find((m) => m.id === "root")
    ?.value();
}

function part2(input: string) {
  let x = 0;
  const monkeys = parse(
    input
      .trim()
      .replace(
        /root: ([a-z]+).*?([a-z]+)/,
        (_, p1, p2) => `root: ${p1} = ${p2}`
      )
  );
  monkeys.find((m) => m.id === "humn")!.value = () => ++x;
  let result;
  let fastForward = 10;
  while (result !== 0) {
    if (result && result > 1_000_000) {
      if (fastForward < 0.0001) {
        x += 100000;
      } else {
        x *= 1 + fastForward;
      }
    }
    if (result && result < 1_000_000 && result > 10_000) {
      x += 1000;
    }
    if (result && x > 1000 && result < 0) {
      if (fastForward < 0.0001) {
        x = Math.trunc(x - 100000);
      } else {
        x = Math.trunc(x / (1 + fastForward)) + 1;
        fastForward /= 2;
      }
    }

    result = monkeys.find((m) => m.id === "root")?.value();
  }
  return x;
}

if (import.meta.main) {
  runPart(2022, 21, 1, part1);
  runPart(2022, 21, 2, part2);
}
