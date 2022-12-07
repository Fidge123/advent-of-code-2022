import { runPart } from "https://deno.land/x/aocd/mod.ts";
import { join } from "https://deno.land/std/path/mod.ts";

function parse(input: string): number[] {
  const commands = input.split("$ ");

  const fs = [];
  let cwd = "";

  for (const command of commands) {
    if (command.startsWith("cd")) {
      cwd = join(cwd, command.slice(3).trim());
    } else if (command.startsWith("ls")) {
      fs.push({
        cwd,
        size: size(command),
      });
    }
  }

  return fs.map((dir, _, all) =>
    all.filter((e) => e.cwd.startsWith(dir.cwd)).reduce((p, c) => p + c.size, 0)
  );
}

function size(input: string): number {
  return input
    .split("\n")
    .map((l) => parseInt(l))
    .filter((s) => !isNaN(s))
    .reduce((p, c) => p + c, 0);
}

function part1(input: string): number {
  return parse(input)
    .filter((dir) => dir < 100000)
    .reduce((p, c) => p + c, 0);
}

function part2(input: string): number {
  const fs = parse(input);
  const needed = 30000000 - (70000000 - fs[0]);
  return fs.sort((a, b) => a - b).find((dir) => dir > needed)!;
}

if (import.meta.main) {
  runPart(2022, 7, 1, part1);
  runPart(2022, 7, 2, part2);
}
