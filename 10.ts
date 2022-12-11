import { runPart } from "https://deno.land/x/aocd/mod.ts";

function part1(input: string) {
  let x = 1;
  let counter = 1;
  const cycles = [20, 60, 100, 140, 180, 220];

  return input.split("\n").reduce((sum, command) => {
    counter += 1;
    if (cycles.includes(counter)) {
      sum += x * counter;
    }
    if (command !== "noop") {
      x += parseInt(command.split(" ")[1]);
      counter += 1;
      if (cycles.includes(counter)) {
        sum += x * counter;
      }
    }
    return sum;
  }, 0);
}

function drawPixel(x: number, counter: number): "#" | "." {
  return Math.abs((counter % 40) - x) <= 1 ? "#" : ".";
}

function part2(input: string) {
  let x = 1;
  let counter = 0;

  return input.split("\n").reduce((sum, command) => {
    counter += 1;
    sum += drawPixel(x, counter);
    if (counter % 40 == 39) {
      console.log(sum);
      sum = "";
    }
    if (command !== "noop") {
      x += parseInt(command.split(" ")[1]);
      counter += 1;
      sum += drawPixel(x, counter);
      if (counter % 40 == 39) {
        console.log(sum);
        sum = "";
      }
    }
    return sum;
  }, drawPixel(x, counter));
}

if (import.meta.main) {
  runPart(2022, 10, 1, part1);
  runPart(2022, 10, 2, part2);
}
