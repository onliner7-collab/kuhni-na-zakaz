import fs from "node:fs";
import path from "node:path";
import { executeSkillTask, loadSkillRegistry, routeSkillTask, type SkillTaskEnvelope } from "./skill-runtime.js";
import { getProjectRoot } from "./shared/paths.js";

function parseArgs(argv: string[]): { command: "route" | "execute"; inputPath: string | null } {
  const command = argv[0] === "route" ? "route" : argv[0] === "execute" ? "execute" : null;
  let inputPath: string | null = null;

  for (let index = 1; index < argv.length; index += 1) {
    if (argv[index] === "--input") {
      inputPath = argv[index + 1] ?? null;
    }
  }

  if (!command) {
    throw new Error('Usage: pnpm --filter @workspace/scripts run ai:skill-runtime -- <route|execute> --input <task.json>');
  }

  return { command, inputPath };
}

function resolveInputPath(candidate: string): string {
  const cwdResolved = path.resolve(process.cwd(), candidate);
  if (fs.existsSync(cwdResolved)) return cwdResolved;
  return path.resolve(getProjectRoot(), candidate);
}

function main(): void {
  const { command, inputPath } = parseArgs(process.argv.slice(2));
  if (!inputPath) {
    throw new Error("Missing --input <task.json>");
  }

  const resolvedInput = resolveInputPath(inputPath);
  const task = JSON.parse(fs.readFileSync(resolvedInput, "utf8")) as SkillTaskEnvelope;
  const registry = loadSkillRegistry();

  if (command === "route") {
    const decision = routeSkillTask(task, registry);
    console.log(`task=${decision.taskId}`);
    console.log(`skill=${decision.selectedSkill}`);
    console.log(`mode=${decision.mode}`);
    console.log(`entity=${decision.entity ?? "null"}`);
    console.log(`rule=${decision.matchedRuleId ?? "explicit"}`);
    console.log(`reasons=${decision.reasons.join(",")}`);
    return;
  }

  const result = executeSkillTask(task, registry);
  console.log(`task=${result.taskId}`);
  console.log(`skill=${result.skill}`);
  console.log(`mode=${result.mode}`);
  console.log(`entity=${result.entity ?? "null"}`);
  console.log(`status=${result.status}`);
  console.log(`artifact=ai/reports/skill-executions/${result.taskId.replace(/[^a-zA-Z0-9_-]+/g, "-")}.json`);
}

main();
