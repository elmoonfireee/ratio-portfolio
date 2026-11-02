import test from "node:test";
import assert from "node:assert/strict";
import { middleware } from "../src/middleware.js";

function route(path) {
  const url = `http://localhost:3000${path}`;
  return middleware({ url, nextUrl: new URL(url) });
}

test("root redirects to the default locale", () => {
  const response = route("/");
  assert.equal(response.status, 307);
  assert.equal(response.headers.get("location"), "http://localhost:3000/pl");
});

for (const path of ["/pl", "/en", "/pl/realizacje", "/other"]) {
  test(`${path} continues through middleware`, () => {
    const response = route(path);
    assert.equal(response.headers.get("x-middleware-next"), "1");
    assert.equal(response.headers.get("location"), null);
  });
}
