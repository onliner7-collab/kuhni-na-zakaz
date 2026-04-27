import fs from "node:fs";
import path from "node:path";

export function ensureDirectory(dirPath: string): void {
  fs.mkdirSync(dirPath, { recursive: true });
}

export function writeJsonReport(targetPath: string, payload: unknown): void {
  ensureDirectory(path.dirname(targetPath));
  fs.writeFileSync(targetPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

export function writeTextReport(targetPath: string, payload: string): void {
  ensureDirectory(path.dirname(targetPath));
  fs.writeFileSync(targetPath, payload.endsWith("\n") ? payload : `${payload}\n`, "utf8");
}

export function readJsonFile<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

export function walkFiles(root: string): string[] {
  if (!fs.existsSync(root)) {
    return [];
  }

  const results: string[] = [];

  const visit = (current: string) => {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === "node_modules" || entry.name === ".next" || entry.name === ".git") {
        continue;
      }
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        visit(fullPath);
      } else if (entry.isFile()) {
        results.push(fullPath);
      }
    }
  };

  visit(root);
  return results;
}

export function toProjectRelative(projectRoot: string, targetPath: string): string {
  return path.relative(projectRoot, targetPath).replaceAll("\\", "/");
}

export function safeReadText(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}
