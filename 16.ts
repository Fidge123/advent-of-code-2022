import { runPart } from "https://deno.land/x/aocd/mod.ts";

interface Valve {
  name: string;
  flow: number;
  open: boolean;
  to: Valve[];
}

interface RawValve {
  name: string;
  flow: number;
  open: boolean;
  to: any[];
}

interface Option {
  name: string;
  flow: number;
  remaining: number;
  path: string[];
}

type Options = (Option | Options)[];

function parse(input: string): RawValve[] {
  return [
    ...input.matchAll(
      /^Valve (?<name>\w+) .*rate=(?<flow>\d+);.*valves? (?<to>[A-Z, ]+)$/gm
    ),
  ].map(
    ({ groups }): RawValve => ({
      name: groups!.name,
      flow: parseInt(groups!.flow),
      open: false,
      to: groups!.to.split(", "),
    })
  );
}

function toGraph(list: RawValve[]): Valve[] {
  return list.map((valve, _, valves): Valve => {
    valve.to = valve.to.map((to: string) => valves.find((v) => v.name === to)!);
    return valve;
  });
}

function getOptions(
  location: Valve,
  remaining: number,
  opened: string[],
  visited: string[] = []
): Option[] {
  const potential = [] as Option[];

  if (!visited.includes(location.name) && !opened.includes(location.name)) {
    potential.push({
      name: location.name,
      flow: location.flow * (remaining - 1),
      remaining: remaining - 1,
      path: visited,
    });
  }

  for (const loc of location.to) {
    if (!visited.includes(loc.name) && remaining > 1) {
      potential.push(
        ...getOptions(loc, remaining - 1, opened, [...visited, location.name])
      );
    }
  }

  return potential.filter((p) => p.flow > 0).sort((a, b) => b.flow - a.flow);
}

function calcFlowPotential(
  pressure: number,
  options: Option[],
  graph: Valve[],
  opened: string[] = []
): Options {
  return options.map(({ name, flow, remaining }) => {
    const open = [...opened, name];

    const nextSteps = calcFlowPotential(
      pressure + flow,
      getOptions(graph.find((v) => v.name == name)!, remaining, open),
      graph,
      open
    );

    return nextSteps.length
      ? nextSteps
      : ({ name, flow: pressure + flow, remaining: 0, path: open } as Option);
  });
}

function part1(input: string) {
  const graph = toGraph(parse(input));
  const options = calcFlowPotential(
    0,
    getOptions(graph.find((v) => v.name == "AA")!, 30, []),
    graph
  ) as any;
  const solutions: Option[] = options.flat(Infinity);

  let max = 0;
  console.log(solutions.length);
  for (let i = 0; i < solutions.length; i++) {
    if (max < solutions[i].flow) {
      max = solutions[i].flow;
    }
  }

  return max;
}

function part2(input: string) {
  const graph = toGraph(parse(input));
  const options = calcFlowPotential(
    0,
    getOptions(graph.find((v) => v.name == "AA")!, 26, []),
    graph
  ) as any;
  const solutions: Option[] = options.flat(Infinity);

  let max = 0;
  for (let i = 0; i < solutions.length; i++) {
    if (i % 100 === 0) {
      console.log(i, "/", solutions.length);
    }
    for (let j = i + 1; j < solutions.length; j++) {
      if (
        !solutions[i].path.some((valve) => solutions[j].path.includes(valve)) &&
        max < solutions[i].flow + solutions[j].flow
      ) {
        max = solutions[i].flow + solutions[j].flow;
        console.log(solutions[i].path, solutions[j].path, max);
      }
    }
  }
  return max;
}

if (import.meta.main) {
  // runPart(2022, 16, 1, part1); // 1638
  runPart(2022, 16, 2, part2);
}
