import { runPart } from "https://deno.land/x/aocd/mod.ts";

class Monkey {
  count = 0;

  constructor(
    public id: number,
    public items: bigint[],
    private operation: (old: bigint) => bigint,
    private test: (item: bigint) => number
  ) {}

  inspect(monkeys: Monkey[], manageWorryLevel: (item: bigint) => bigint) {
    while (this.items.length > 0) {
      const item = manageWorryLevel(this.operation(this.items.shift()!));
      this.count++;
      monkeys.find((m) => m.id === this.test(item))!.items.push(item);
    }
  }
}

function createOp(op: string, val: string) {
  if (val === "old") {
    return (old: bigint) => (op === "+" ? old + old : old * old);
  }
  return (old: bigint) => (op === "+" ? old + BigInt(val) : old * BigInt(val));
}

function parse(input: string): Monkey[] {
  const instructions = [
    ...input.matchAll(
      /Monkey (?<id>\d+):\n.*Starting items: (?<items>.*)\n.*Operation: new = old (?<op>[\+\*]) (?<val>\d+|old)\n.*Test: [^\d]*(?<divBy>\d+)\n.*(?<true>\d+)\n.*(?<false>\d+)/gm
    ),
  ];

  return instructions.map(
    ({ groups }) =>
      new Monkey(
        parseInt(groups!.id),
        groups!.items.split(", ").map((i) => BigInt(i)),
        createOp(groups!.op, groups!.val),
        (item: bigint) =>
          item % BigInt(groups!.divBy) === 0n
            ? parseInt(groups!.true)
            : parseInt(groups!.false)
      )
  );
}

function getModulus(input: string): bigint {
  const instructions = [
    ...input.matchAll(
      /Monkey (?<id>\d+):\n.*Starting items: (?<items>.*)\n.*Operation: new = old (?<op>[\+\*]) (?<val>\d+|old)\n.*Test: [^\d]*(?<divBy>\d+)\n.*(?<true>\d+)\n.*(?<false>\d+)/gm
    ),
  ];

  return instructions.reduce(
    (divBy, { groups }) => divBy * BigInt(groups!.divBy),
    1n
  );
}

function part1(input: string): number {
  const monkeys = parse(input);

  for (let i = 0; i < 20; i++) {
    for (const monkey of monkeys) {
      monkey.inspect(monkeys, (item) => item / 3n);
    }
  }

  const sorted = monkeys.sort((first, second) => second.count - first.count);
  return sorted[0].count * sorted[1].count;
}

function part2(input: string): number {
  const monkeys = parse(input);

  const modolus = getModulus(input);

  for (let i = 0; i < 10000; i++) {
    for (const monkey of monkeys) {
      monkey.inspect(monkeys, (item) => item % modolus);
    }
  }

  const sorted = monkeys.sort((first, second) => second.count - first.count);
  return sorted[0].count * sorted[1].count;
}

if (import.meta.main) {
  runPart(2022, 11, 1, part1);
  runPart(2022, 11, 2, part2);
}
