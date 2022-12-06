import { runPart } from "https://deno.land/x/aocd/mod.ts";

function uniqueSubstring(length: number) {
  return (input: string) =>
    input
      .split("")
      .findIndex(
        (_, i, array) =>
          [...new Set(array.slice(i - length, i))].length === length
      );
}

if (import.meta.main) {
  runPart(2022, 6, 1, uniqueSubstring(4));
  runPart(2022, 6, 2, uniqueSubstring(14));
}
