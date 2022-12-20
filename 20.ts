import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { runPart } from "https://deno.land/x/aocd/mod.ts";

interface Element {
  id: number;
  value: number;
}

function parse(input: string): Element[] {
  return input.split("\n").map((num, id) => ({ id, value: parseInt(num) }));
}

function mix(id: number, list: Element[]): Element[] {
  const index = list.findIndex((el) => el.id === id)!;
  const element = list.splice(index, 1)[0];
  const newIndex = (index + element.value) % list.length;

  list.splice(newIndex, 0, element);

  return list;
}

function part1(input: string) {
  const initialList = parse(input.trim());
  let result = [...initialList];
  for (let i = 0; i < initialList.length; i++) {
    result = mix(i, result);
  }
  const startIndex = result.findIndex((el) => el.value === 0)!;
  return (
    result[(startIndex + 1000) % result.length].value +
    result[(startIndex + 2000) % result.length].value +
    result[(startIndex + 3000) % result.length].value
  );
}

function part2(input: string) {
  const initialList = parse(input.trim()).map(({ id, value }) => ({
    id,
    value: value * 811589153,
  }));
  let result = [...initialList];
  for (let j = 0; j < 10; j++) {
    for (let i = 0; i < initialList.length; i++) {
      result = mix(i, result);
    }
  }
  const startIndex = result.findIndex((el) => el.value === 0)!;
  return (
    result[(startIndex + 1000) % result.length].value +
    result[(startIndex + 2000) % result.length].value +
    result[(startIndex + 3000) % result.length].value
  );
}

assert(
  part1(`1
2
-3
3
-2
0
4
`) === 3
);

assert(
  part2(`1
2
-3
3
-2
0
4
`) === 1623178306
);

if (import.meta.main) {
  runPart(2022, 20, 1, part1);
  runPart(2022, 20, 2, part2);
}
