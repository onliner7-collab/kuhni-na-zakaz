import { spawn } from "node:child_process";
import path from "node:path";

const command = process.argv[2];

if (!command || !["dev", "start"].includes(command)) {
  console.error('Usage: node ./scripts/run-next.mjs <dev|start>');
  process.exit(1);
}

const port = process.env.PORT || "3001";
const host = process.env.HOST || "0.0.0.0";
const nextBin = path.resolve("node_modules", ".bin", "next");
const windowsNextBin = `${nextBin}.cmd`;
const args = [command, "-p", port, "--hostname", host];

const child =
  process.platform === "win32"
    ? spawn("cmd.exe", ["/d", "/s", "/c", windowsNextBin, ...args], {
        stdio: "inherit",
        env: process.env,
      })
    : spawn(nextBin, args, {
        stdio: "inherit",
        env: process.env,
      });

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});
