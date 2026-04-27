import fs from "node:fs";
import path from "node:path";
import { applyDraftSafePatch } from "./draft-safe-writer.js";
import { getProjectRoot } from "./shared/paths.js";
import type { DraftSafeWriteRequest } from "./shared/types.js";

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
  console.error('Usage: pnpm --filter @workspace/scripts run ai:draft-write -- --input <path-to-request.json>');
  process.exit(1);
}

const cwdResolvedInput = path.resolve(process.cwd(), inputPath);
const resolvedInput = fs.existsSync(cwdResolvedInput)
  ? cwdResolvedInput
  : path.resolve(getProjectRoot(), inputPath);
const request = JSON.parse(fs.readFileSync(resolvedInput, "utf8")) as DraftSafeWriteRequest;
const result = applyDraftSafePatch(request);

console.log(`draft-safe-write: ${result.entity}:${result.identifier}`);
console.log(`result=${result.result}`);
console.log(`applied=[${result.appliedFields.join(", ")}]`);
console.log(`reviewRequired=[${result.reviewRequiredFields.join(", ")}]`);
console.log(`blocked=[${result.blockedFields.join(", ")}]`);
console.log(`reviewPacket=${result.reviewPacketPath}`);
