import fs from "node:fs";
import path from "node:path";
import { runEntityDraftWriter } from "./entity-draft-writer.js";
import { getProjectRoot } from "./shared/paths.js";
import type { EntityDraftWriterRequest } from "./shared/types.js";

function parseArgs(argv: string[]): { inputPath: string | null } {
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--input") {
      return { inputPath: argv[index + 1] ?? null };
    }
  }
  return { inputPath: null };
}

const { inputPath } = parseArgs(process.argv.slice(2));

if (!inputPath) {
  console.error('Usage: pnpm --filter @workspace/scripts run ai:entity-draft-write -- --input <path-to-request.json>');
  process.exit(1);
}

const cwdResolvedInput = path.resolve(process.cwd(), inputPath);
const resolvedInput = fs.existsSync(cwdResolvedInput)
  ? cwdResolvedInput
  : path.resolve(getProjectRoot(), inputPath);
const request = JSON.parse(fs.readFileSync(resolvedInput, "utf8")) as EntityDraftWriterRequest;
const result = runEntityDraftWriter(request);

console.log(`entity-draft-write: ${result.entity}:${result.identifier}`);
console.log(`status=${result.status}`);
console.log(`mode=${result.mode}`);
console.log(`applied=[${result.appliedFields.join(", ")}]`);
console.log(`blocked=[${result.blockedFields.join(", ")}]`);
console.log(`artifact=${result.artifactPath ?? "null"}`);
console.log(`reviewPacket=${result.reviewPacketPath ?? "null"}`);
console.log(`log=${result.logPath}`);
