import { spawn } from "child_process";

const BASE = "http://localhost:3000";
const suites = [
  { name: "Phase 3 API Handlers", file: "test-api.mjs" },
  { name: "End-to-End Storefront & SSR", file: "test-e2e.mjs" },
  { name: "Phase 4 Security & Admin Auth", file: "test-phase4.mjs" },
  { name: "Phase 5 Cloudinary & Image Management", file: "test-phase5.mjs" },
];

async function isServerRunning() {
  try {
    const res = await fetch(`${BASE}/api/health`, { signal: AbortSignal.timeout(2000) });
    return res.status === 200;
  } catch {
    return false;
  }
}

async function waitForServer(timeoutMs = 45000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await isServerRunning()) return true;
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

async function runSuite(suite) {
  return new Promise((resolve) => {
    console.log(`\n========================================================`);
    console.log(`>>> RUNNING: ${suite.name} (${suite.file})`);
    console.log(`========================================================\n`);

    const child = spawn("node", [suite.file], { stdio: "inherit" });
    child.on("close", (code) => {
      resolve({ name: suite.name, code, passed: code === 0 });
    });
  });
}

async function main() {
  console.log("========================================================");
  console.log("  ARABIAN CHICK, N — COMPREHENSIVE PHASE 1-5 TEST SUITE ");
  console.log("========================================================");

  let spawnedServer = null;
  const running = await isServerRunning();
  if (!running) {
    console.log("Next.js server not running on http://localhost:3000.");
    console.log("Auto-starting dev server for test execution...");
    const cmd = process.platform === "win32" ? "npx.cmd" : "npx";
    spawnedServer = spawn(cmd, ["next", "dev"], {
      stdio: "ignore",
      shell: true,
    });

    const ready = await waitForServer(45000);
    if (!ready) {
      console.error("Timed out waiting for Next.js dev server to start on port 3000.");
      if (spawnedServer) {
        if (process.platform === "win32") {
          spawn("taskkill", ["/pid", String(spawnedServer.pid), "/f", "/t"], { shell: true });
        } else {
          spawnedServer.kill();
        }
      }
      process.exit(1);
    }
    console.log("Next.js dev server is ready! Commencing test suites...\n");
  } else {
    console.log("Connected to existing Next.js server on http://localhost:3000.\n");
  }

  const results = [];
  try {
    for (const s of suites) {
      const res = await runSuite(s);
      results.push(res);
    }
  } finally {
    if (spawnedServer) {
      console.log("\nStopping auto-started test server...");
      if (process.platform === "win32") {
        spawn("taskkill", ["/pid", String(spawnedServer.pid), "/f", "/t"], { shell: true });
      } else {
        spawnedServer.kill();
      }
    }
  }

  console.log("\n========================================================");
  console.log("                    TEST RUN SUMMARY                    ");
  console.log("========================================================");
  let allPassed = true;
  for (const r of results) {
    console.log(`${r.passed ? "[PASS]" : "[FAIL]"} ${r.name}`);
    if (!r.passed) allPassed = false;
  }
  console.log("========================================================\n");

  if (!allPassed) {
    console.error("One or more test suites failed.");
    process.exit(1);
  } else {
    console.log("ALL SUITES (PHASES 1 TO 5) PASSED SUCCESSFULLY!");
    process.exit(0);
  }
}

main();
