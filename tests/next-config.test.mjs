import test from "node:test";
import assert from "node:assert/strict";
import nextConfig from "../next.config.mjs";

async function contentSecurityPolicy() {
  const headers = await nextConfig.headers();
  return headers.find((rule) => rule.source === "/:path*").headers
    .find((header) => header.key === "Content-Security-Policy").value;
}

test("development CSP permits the evaluation required by Next.js refresh", async () => {
  process.env.NODE_ENV = "development";
  assert.match(await contentSecurityPolicy(), /script-src[^;]*'unsafe-eval'/);
});

test("production CSP does not allow unsafe evaluation", async () => {
  process.env.NODE_ENV = "production";
  assert.doesNotMatch(await contentSecurityPolicy(), /script-src[^;]*'unsafe-eval'/);
});
