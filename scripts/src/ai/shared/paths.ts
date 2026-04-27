import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getProjectRoot(): string {
  return path.resolve(__dirname, "../../../..");
}

export function getAiDir(): string {
  return path.join(getProjectRoot(), "ai");
}

export function getAiPoliciesDir(): string {
  return path.join(getAiDir(), "policies");
}

export function getAiReportsDir(): string {
  return path.join(getAiDir(), "reports");
}

export function getAiLogsDir(): string {
  return path.join(getAiDir(), "logs");
}

export function getAppRoot(): string {
  return path.join(getProjectRoot(), "artifacts", "kuhni-na-zakaz");
}

export function getPrismaSchemaPath(): string {
  return path.join(getAppRoot(), "prisma", "schema.prisma");
}

export function getAppDir(): string {
  return path.join(getAppRoot(), "app");
}
