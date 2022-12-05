import { runPart } from "https://deno.land/x/aocd/mod.ts";

function parseContainers(input: string): string[][] {
  const lines = input.split("\n");
  return lines
    .pop()!
    .split("   ")
    .map((_, index) =>
      lines.map((line) => line[index * 4 + 1]).filter((c) => c !== " ")
    );
}

function parse(input: string): {
  containers: string[][];
  instructions: { move: number; from: number; to: number }[];
} {
  const [containers, instructions] = input.trimEnd().split("\n\n");
  return {
    containers: parseContainers(containers),
    instructions: instructions.split("\n").map((instruction) => {
      const [, move, , from, , to] = instruction.split(" ");
      return {
        move: parseInt(move),
        from: parseInt(from) - 1,
        to: parseInt(to) - 1,
      };
    }),
  };
}

function part1(input: string) {
  const { containers, instructions } = parse(input);
  for (const { to, from, move } of instructions) {
    for (let i = 0; i < move; i++) {
      containers[to].unshift(containers[from].shift()!);
    }
  }
  return containers.map((c) => c[0]).join("");
}

function part2(input: string) {
  const { containers, instructions } = parse(input);
  for (const { to, from, move } of instructions) {
    containers[to].unshift(...containers[from].splice(0, move));
  }
  return containers.map((c) => c[0]).join("");
}

if (import.meta.main) {
  runPart(2022, 5, 1, part1);
  runPart(2022, 5, 2, part2);
}
