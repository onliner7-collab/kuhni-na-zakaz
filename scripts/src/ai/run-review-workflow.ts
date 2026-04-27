import fs from "node:fs";
import path from "node:path";
import {
  applyApprovedReviewWorkflow,
  approveReviewWorkflow,
  ensureReviewWorkflowDirectories,
  prepareReviewWorkflow,
  rejectReviewWorkflow,
} from "./review-workflow.js";
import { getProjectRoot } from "./shared/paths.js";
import type {
  EntityDraftWriterRequest,
  ReviewWorkflowApprovalRequest,
  ReviewWorkflowApplyRequest,
  ReviewWorkflowRejectionRequest,
} from "./shared/types.js";

function parseArgs(argv: string[]): { command: "prepare" | "approve" | "reject" | "apply"; inputPath: string | null } {
  const command = argv[0];
  if (!command || !["prepare", "approve", "reject", "apply"].includes(command)) {
    throw new Error('Usage: pnpm --filter @workspace/scripts run ai:review-workflow -- <prepare|approve|reject|apply> --input <file.json>');
  }

  let inputPath: string | null = null;
  for (let index = 1; index < argv.length; index += 1) {
    if (argv[index] === "--input") inputPath = argv[index + 1] ?? null;
  }

  return { command: command as "prepare" | "approve" | "reject" | "apply", inputPath };
}

function resolveInputPath(candidate: string): string {
  const cwdResolved = path.resolve(process.cwd(), candidate);
  if (fs.existsSync(cwdResolved)) return cwdResolved;
  return path.resolve(getProjectRoot(), candidate);
}

function main(): void {
  ensureReviewWorkflowDirectories();
  const { command, inputPath } = parseArgs(process.argv.slice(2));
  if (!inputPath) throw new Error("Missing --input <file.json>");

  const resolvedInput = resolveInputPath(inputPath);
  const payload = JSON.parse(fs.readFileSync(resolvedInput, "utf8")) as
    | EntityDraftWriterRequest
    | ReviewWorkflowApprovalRequest
    | ReviewWorkflowRejectionRequest
    | ReviewWorkflowApplyRequest;

  if (command === "prepare") {
    const packet = prepareReviewWorkflow(payload as EntityDraftWriterRequest);
    console.log(`task=${packet.task.taskId}`);
    console.log(`state=${packet.reviewState}`);
    console.log(`reviewPacket=${packet.artifacts.reviewPacketPath}`);
    console.log(`summary=${packet.artifacts.markdownSummaryPath}`);
    return;
  }

  if (command === "approve") {
    const artifact = approveReviewWorkflow(payload as ReviewWorkflowApprovalRequest);
    console.log(`task=${artifact.taskId}`);
    console.log(`state=${artifact.reviewState}`);
    console.log(`approvalMarker=${artifact.approvalMarker}`);
    console.log(`safeApplyEligible=${artifact.safeApplyEligible}`);
    return;
  }

  if (command === "reject") {
    const artifact = rejectReviewWorkflow(payload as ReviewWorkflowRejectionRequest);
    console.log(`task=${artifact.taskId}`);
    console.log(`state=${artifact.reviewState}`);
    console.log(`reason=${artifact.reason}`);
    return;
  }

  const result = applyApprovedReviewWorkflow(payload as ReviewWorkflowApplyRequest);
  console.log(`task=${result.taskId}`);
  console.log(`status=${result.status}`);
  console.log(`artifact=${result.artifactPath ?? "null"}`);
  console.log(`reviewPacket=${result.reviewPacketPath ?? "null"}`);
}

main();
