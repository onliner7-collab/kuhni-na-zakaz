import fs from "node:fs";
import path from "node:path";
import { runLocationPageSeoOperatorLoop } from "./locationpage-seo-operator-loop.js";
import { getProjectRoot } from "./shared/paths.js";

function parseArgs(argv: string[]): { inputPath: string | null } {
  let inputPath: string | null = null;

  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--input") {
      inputPath = argv[index + 1] ?? null;
    }
  }

  return { inputPath };
}

function resolveInputPath(candidate: string): string {
  const cwdResolved = path.resolve(process.cwd(), candidate);
  if (fs.existsSync(cwdResolved)) return cwdResolved;
  return path.resolve(getProjectRoot(), candidate);
}

function main(): void {
  const { inputPath } = parseArgs(process.argv.slice(2));
  if (!inputPath) {
    throw new Error("Usage: pnpm --filter @workspace/scripts run ai:locationpage-seo-loop -- --input <file.json>");
  }

  const payload = JSON.parse(fs.readFileSync(resolveInputPath(inputPath), "utf8"));
  const result = runLocationPageSeoOperatorLoop(payload);

  console.log(`task=${result.task.taskId}`);
  console.log(`entity=${result.task.entity}`);
  console.log(`identifier=${result.task.identifier}`);
  console.log(`reviewState=${result.review.reviewState}`);
  console.log(`qaVerdict=${result.review.qaVerdict}`);
  console.log(`machineReport=${result.outputs.machineReportPath}`);
  console.log(`humanSummary=${result.outputs.humanSummaryPath}`);
  console.log(`reviewPacket=${result.selectedArtifacts.reviewPacketPath}`);
}

main();
