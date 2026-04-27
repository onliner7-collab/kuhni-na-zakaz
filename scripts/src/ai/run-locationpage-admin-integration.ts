import fs from "node:fs";
import path from "node:path";
import {
  analyzeLocationPageAdminIntegration,
  prepareLocationPageAdminDraftOperation,
} from "./locationpage-admin-integration.js";
import { getProjectRoot } from "./shared/paths.js";

function parseArgs(argv: string[]): { command: "analyze" | "prepare"; inputPath: string | null } {
  const command = argv[0];
  if (!command || !["analyze", "prepare"].includes(command)) {
    throw new Error('Usage: pnpm --filter @workspace/scripts run ai:locationpage-admin-integration -- <analyze|prepare> [--input file.json]');
  }

  let inputPath: string | null = null;
  for (let index = 1; index < argv.length; index += 1) {
    if (argv[index] === "--input") inputPath = argv[index + 1] ?? null;
  }

  return { command: command as "analyze" | "prepare", inputPath };
}

function resolveInputPath(candidate: string): string {
  const cwdResolved = path.resolve(process.cwd(), candidate);
  if (fs.existsSync(cwdResolved)) return cwdResolved;
  return path.resolve(getProjectRoot(), candidate);
}

function main(): void {
  const { command, inputPath } = parseArgs(process.argv.slice(2));

  if (command === "analyze") {
    const result = analyzeLocationPageAdminIntegration();
    console.log(`report=${result.reportPath}`);
    console.log(`allowedMap=${result.allowedMapPath}`);
    console.log(`blockedMap=${result.blockedMapPath}`);
    return;
  }

  if (!inputPath) throw new Error("Missing --input <file.json> for prepare");
  const payload = JSON.parse(fs.readFileSync(resolveInputPath(inputPath), "utf8"));
  const result = prepareLocationPageAdminDraftOperation(payload);
  console.log(`operation=${result.operationPath}`);
  console.log(`reviewPacket=${result.reviewPacket.artifacts.reviewPacketPath}`);
  console.log(`reviewSummary=${result.reviewPacket.artifacts.markdownSummaryPath}`);
  console.log(`state=${result.reviewPacket.reviewState}`);
}

main();
