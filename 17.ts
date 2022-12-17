import { runPart } from "https://deno.land/x/aocd/mod.ts";

function nextPiece(id: number): string[] {
  switch (id % 5) {
    case 0:
      return buffer(["..@@@@."]);
    case 1:
      return buffer(["...@...", "..@@@..", "...@..."]);
    case 2:
      return buffer(["....@..", "....@..", "..@@@.."]);
    case 3:
      return buffer(["..@....", "..@....", "..@....", "..@...."]);
    case 4:
    default:
      return buffer(["..@@...", "..@@..."]);
  }
}

function buffer(piece: string[]) {
  return piece.concat([".......", ".......", "......."]);
}

function checkLeft(chamber: string[]) {
  let pieceStarted = false;
  for (let i = 0; i < chamber.length; i++) {
    if (chamber[i].includes("@")) {
      pieceStarted = true;
      if (chamber[i][chamber[i].indexOf("@") - 1] !== ".") {
        return false;
      }
    }
    if (pieceStarted && !chamber[i].includes("@")) {
      return true;
    }
  }
  return true;
}

function left(chamber: string[]) {
  let pieceStarted = false;
  if (checkLeft(chamber)) {
    for (let i = 0; i < chamber.length; i++) {
      if (chamber[i].includes("@")) {
        pieceStarted = true;
        const temp = chamber[i].split("@");
        temp[0] = temp[0].slice(0, -1);
        temp[temp.length - 1] = "." + temp[temp.length - 1];
        chamber[i] = temp.join("@");
      }
      if (pieceStarted && !chamber[i].includes("@")) {
        return chamber;
      }
    }
  }
  return chamber;
}

function checkRight(chamber: string[]) {
  let pieceStarted = false;

  for (let i = 0; i < chamber.length; i++) {
    if (chamber[i].includes("@")) {
      pieceStarted = true;
      if (chamber[i][chamber[i].lastIndexOf("@") + 1] !== ".") {
        return false;
      }
    }
    if (pieceStarted && !chamber[i].includes("@")) {
      return true;
    }
  }
  return true;
}

function right(chamber: string[]) {
  let pieceStarted = false;

  if (checkRight(chamber)) {
    for (let i = 0; i < chamber.length; i++) {
      if (chamber[i].includes("@")) {
        pieceStarted = true;
        const temp = chamber[i].split("@");
        temp[0] = temp[0] + ".";
        temp[temp.length - 1] = temp[temp.length - 1].slice(1);
        chamber[i] = temp.join("@");
      }
      if (pieceStarted && !chamber[i].includes("@")) {
        return chamber;
      }
    }
  }
  return chamber;
}

function checkDown(chamber: string[]) {
  let pieceStarted = false;
  for (let i = 1; i < chamber.length; i++) {
    for (let col = 0; col < chamber[i - 1].length; col++) {
      if (chamber[i - 1][col] === "@") {
        pieceStarted = true;
        if (chamber[i][col] !== "." && chamber[i][col] !== "@") {
          return false;
        }
      }
    }
    if (pieceStarted && !chamber[i].includes("@")) {
      return true;
    }
  }
  return false;
}

function down(chamber: string[]): [boolean, string[]] {
  let pieceStarted = false;
  if (checkDown(chamber)) {
    for (let i = chamber.length - 1; i > 0; --i) {
      for (let col = 0; col < chamber[i - 1].length; col++) {
        if (chamber[i - 1][col] === "@") {
          pieceStarted = true;
          chamber[i] =
            chamber[i].slice(0, col) + "@" + chamber[i].slice(col + 1);
          chamber[i - 1] =
            chamber[i - 1].slice(0, col) + "." + chamber[i - 1].slice(col + 1);
        }
      }
      if (pieceStarted && !chamber[i].includes("@")) {
        return [false, chamber];
      }
      if (i === 1 && chamber[0] === ".......") {
        return [false, chamber.slice(i)];
      }
    }
    return [false, chamber];
  }
  return [true, chamber.map((line) => line.replaceAll("@", "#"))];
}

function part1(input: string) {
  const leftRight = input.trim().split("");
  let chamber = [] as string[];
  let j = 0;

  for (let i = 0; i < 1000000000000; i++) {
    if (i % 1000000 === 0) {
      console.log(i);
    }

    chamber.unshift(...nextPiece(i));

    let stopped = false;
    while (!stopped) {
      if (leftRight[j % leftRight.length] === "<") {
        chamber = left(chamber);
      } else {
        chamber = right(chamber);
      }
      [stopped, chamber] = down(chamber);
      j += 1;
    }
  }
  console.log();
  console.log([...chamber].join("\n"));
  return chamber.length;
}

if (import.meta.main) {
  runPart(2022, 17, 1, part1);
  // runPart(2022, 17, 2, part2);
}
