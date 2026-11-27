#!/usr/bin/env node
/* Repeatable secret scan for the app's tracked source.
   It prints the file and line of a possible credential, never the value. */
import { readFileSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";

const SKIP = /(^|\/)(node_modules|dist|\.git|\.wrangler)\//;
const PATTERNS = [
  { name: "private key block", pattern: /-----BEGIN (?:RSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/ },
  { name: "AWS access key id", pattern: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: "Stripe secret key", pattern: /\bsk_(?:live|test)_[0-9A-Za-z]{16,}/ },
  { name: "GitHub token", pattern: /\bgh[pousr]_[0-9A-Za-z]{30,}/ },
  { name: "Google API key", pattern: /\bAIza[0-9A-Za-z_-]{35}\b/ },
  { name: "Slack token", pattern: /\bxox[abprs]-[0-9A-Za-z-]{10,}/ },
  { name: "service role key", pattern: /(?:service_role|SERVICE_ROLE)[^\n]{0,20}[:=]\s*["']?[A-Za-z0-9._-]{20,}/ },
  { name: "assigned secret", pattern: /(?:api[_-]?key|secret|password|token)[^\n]{0,12}[:=]\s*["'][^"'\s]{16,}["']/i },
];

function trackedFiles() {
  try {
    return execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" })
      .split("\0")
      .filter(Boolean);
  } catch {
    return [];
  }
}

const files = trackedFiles().filter((file) => !SKIP.test(file) && /\.(?:js|jsx|ts|tsx|json|jsonc|md|ya?ml|toml|html|css)$/.test(file));
const findings = [];

for (const file of files) {
  let text;
  try {
    if (statSync(file).size > 2 * 1024 * 1024) continue;
    text = readFileSync(file, "utf8");
  } catch {
    continue;
  }
  text.split("\n").forEach((line, index) => {
    PATTERNS.forEach(({ name, pattern }) => {
      if (pattern.test(line)) findings.push(`${file}:${index + 1} — possible ${name}`);
    });
  });
}

if (findings.length === 0) {
  console.log(`No credential patterns found in ${files.length} tracked files.`);
  process.exit(0);
}

console.log(`Possible credentials found (values hidden):\n${findings.join("\n")}`);
console.log("\nRemove the value from the code, rotate the credential, then scan again.");
process.exit(1);