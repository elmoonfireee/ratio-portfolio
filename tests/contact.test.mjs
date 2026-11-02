import test from "node:test";
import assert from "node:assert/strict";
import net from "node:net";
import { failCreation, failDelivery, messages, resetMail } from "./support/mail-stub.mjs";

const smtp = {
  SMTP_HOST: "smtp.example.test",
  SMTP_PORT: "465",
  SMTP_USER: "sender@example.test",
  SMTP_PASS: "synthetic-password"
};

const valid = {
  locale: "pl",
  name: "Żaneta Kowalska",
  email: "client@example.test",
  phone: "",
  serviceType: "Instalacja",
  message: "Proszę o kontakt.",
  privacy: true,
  company: ""
};

let moduleNumber = 0;

async function setup(t) {
  Object.assign(process.env, smtp);
  process.env.NODE_ENV = "test";
  resetMail();
  t.mock.method(console, "error", () => {});
  t.mock.method(net.Socket.prototype, "connect", () => {
    throw new Error("Network connections are disabled in contact tests");
  });
  const handler = await import(`../src/app/api/contact/route.js?test=${moduleNumber++}`);
  return handler.POST;
}

function request(data, ip = "192.0.2.1") {
  const headers = { "content-type": "application/json" };
  if (ip !== null) headers["x-forwarded-for"] = ip;
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers,
    body: typeof data === "string" ? data : JSON.stringify(data)
  });
}

test("valid request sends one email and returns a success response", async (t) => {
  const post = await setup(t);
  const response = await post(request(valid));
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(body, { ok: true, message: "Dziękujemy. Wiadomość została wysłana." });
  assert.equal(messages.length, 1);
  assert.match(messages[0].replyTo, /client@example\.test/);
  assert.match(messages[0].text, /Żaneta Kowalska/);
  assert.match(messages[0].text, /Proszę o kontakt/);
});

for (const [name, payload, expectedFields] of [
  ["missing fields", {}, ["name", "email", "serviceType", "message", "privacy"]],
  ["empty required text", { ...valid, name: "", email: "", serviceType: "", message: "" }, ["name", "email", "serviceType", "message"]],
  ["whitespace-only text", { ...valid, name: "  ", email: " \t ", serviceType: " ", message: "\n" }, ["name", "email", "serviceType", "message"]],
  ["invalid email", { ...valid, email: "invalid-address" }, ["email"]],
  ["incorrect field types", { ...valid, name: 3, email: [], serviceType: {}, message: null, privacy: "true" }, ["name", "email", "serviceType", "message", "privacy"]],
  ["missing privacy confirmation", { ...valid, privacy: false }, ["privacy"]]
]) {
  test(`validation rejects ${name}`, async (t) => {
    const post = await setup(t);
    const response = await post(request(payload));
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.ok, false);
    assert.equal(body.message, "Sprawdź poprawność danych w formularzu.");
    assert.deepEqual(Object.keys(body.errors).sort(), expectedFields.sort());
    assert.equal(messages.length, 0);
  });
}

test("malformed JSON is rejected with field errors and no email", async (t) => {
  const post = await setup(t);
  const response = await post(request("{"));
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.ok, false);
  assert.ok(body.errors.name);
  assert.ok(body.errors.email);
  assert.equal(messages.length, 0);
});

test("input is trimmed, Unicode is retained and HTML is escaped in the email", async (t) => {
  const post = await setup(t);
  const response = await post(request({
    ...valid,
    name: "  Żaneta <b>  ",
    message: "  Cześć <script>alert('x')</script> & więcej\nDruga linia  ",
    ignoredField: "not included in the message"
  }));

  assert.equal(response.status, 200);
  assert.equal(messages.length, 1);
  assert.match(messages[0].html, /Żaneta &lt;b&gt;/);
  assert.match(messages[0].html, /&lt;script&gt;alert\(&#039;x&#039;\)&lt;\/script&gt; &amp; więcej<br \/>Druga linia/);
  assert.doesNotMatch(messages[0].html, /<script>/);
  assert.doesNotMatch(messages[0].text, /not included in the message/);
});

test("honeypot returns accepted without sending a message", async (t) => {
  const post = await setup(t);
  const response = await post(request({ ...valid, company: "spam" }));

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, message: "Dziękujemy. Formularz został przyjęty." });
  assert.equal(messages.length, 0);
});

test("honeypot accepts invalid fields without exposing validation errors", async (t) => {
  const post = await setup(t);
  const response = await post(request({ company: "spam" }));

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, message: "Dziękujemy. Formularz został przyjęty." });
  assert.equal(messages.length, 0);
});

test("missing SMTP configuration returns a safe 503 response", async (t) => {
  const post = await setup(t);
  delete process.env.SMTP_PASS;
  const response = await post(request(valid));
  const body = await response.json();

  assert.equal(response.status, 503);
  assert.equal(body.ok, false);
  assert.match(body.message, /nie została jeszcze skonfigurowana/);
  assert.doesNotMatch(JSON.stringify(body), /synthetic-password|SMTP_PASS/);
  assert.equal(messages.length, 0);
});

for (const port of ["0", "-1", "invalid", "3.5", "65536"]) {
  test(`invalid SMTP port ${port} returns 503`, async (t) => {
    const post = await setup(t);
    process.env.SMTP_PORT = port;
    const response = await post(request(valid));
    const body = await response.json();

    assert.equal(response.status, 503);
    assert.equal(body.ok, false);
    assert.match(body.message, /port SMTP/);
    assert.equal(messages.length, 0);
  });
}

test("SMTP delivery failure returns a generic 500 without the underlying error", async (t) => {
  const post = await setup(t);
  failDelivery(new Error("synthetic SMTP internal detail"));
  const response = await post(request(valid));
  const body = await response.json();

  assert.equal(response.status, 500);
  assert.deepEqual(body, { ok: false, message: "Nie udało się wysłać wiadomości. Spróbuj ponownie później lub skorzystaj z danych kontaktowych." });
  assert.doesNotMatch(JSON.stringify(body), /synthetic SMTP internal detail|synthetic-password/);
  assert.equal(messages.length, 1);
});

test("English requests receive English validation messages", async (t) => {
  const post = await setup(t);
  const response = await post(request({ ...valid, locale: "en", email: "bad" }));
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.errors.email, "Enter a valid email address.");
  assert.equal(messages.length, 0);
});

test("unknown locale falls back to Polish", async (t) => {
  const post = await setup(t);
  const response = await post(request({ ...valid, locale: "xx", email: "bad" }));
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.errors.email, "Podaj poprawny adres e-mail.");
});

test("the sixth request from one IP is limited and the window expires", async (t) => {
  let now = 1_800_000_000_000;
  t.mock.method(Date, "now", () => now);
  const post = await setup(t);

  for (let i = 0; i < 5; i++) {
    const response = await post(request({}));
    assert.equal(response.status, 400);
  }
  const limited = await post(request({}));
  assert.equal(limited.status, 429);
  assert.equal((await limited.json()).ok, false);
  now += 59_999;
  assert.equal((await post(request({}))).status, 429);
  now += 1;
  assert.equal((await post(request({}))).status, 400);
  assert.equal(messages.length, 0);
});

test("different forwarded IP values cannot bypass the shared limit", async (t) => {
  const post = await setup(t);
  for (let i = 0; i < 5; i++) await post(request({}, "192.0.2.1"));

  assert.equal((await post(request({}, "192.0.2.1"))).status, 429);
  assert.equal((await post(request({}, "192.0.2.2"))).status, 429);
});

test("requests without an IP share the unknown bucket", async (t) => {
  const post = await setup(t);
  for (let i = 0; i < 5; i++) await post(request({}, null));

  assert.equal((await post(request({}, null))).status, 429);
});

test("simultaneous requests from one IP cannot all pass the in-process limit", async (t) => {
  const post = await setup(t);
  const responses = await Promise.all(Array.from({ length: 8 }, () => post(request({}))));

  assert.equal(responses.filter((response) => response.status === 400).length, 5);
  assert.equal(responses.filter((response) => response.status === 429).length, 3);
});

test("transport creation errors return a safe 500 without sending", async (t) => {
  const post = await setup(t);
  failCreation(new Error("synthetic transport creation failure"));
  const response = await post(request(valid));
  const body = await response.json();

  assert.equal(response.status, 500);
  assert.deepEqual(body, { ok: false, message: "Nie udało się wysłać wiadomości. Spróbuj ponownie później lub skorzystaj z danych kontaktowych." });
  assert.doesNotMatch(JSON.stringify(body), /synthetic transport creation failure|synthetic-password/);
  assert.equal(messages.length, 0);
});

test("spoofed forwarded headers do not create new rate-limit buckets", async (t) => {
  const post = await setup(t);
  for (let i = 0; i < 5; i++) {
    assert.equal((await post(request({}, `192.0.2.${i + 1}`))).status, 400);
  }
  const response = await post(request({}, "203.0.113.7, 192.0.2.1"));
  assert.equal(response.status, 429);
  assert.equal(messages.length, 0);
});

test("expired requests are removed before accepting a fresh shared window", async (t) => {
  let now = 1_800_000_000_000;
  t.mock.method(Date, "now", () => now);
  const post = await setup(t);
  for (let i = 0; i < 5; i++) await post(request({}, `192.0.2.${i + 1}`));
  now += 60_000;

  for (let i = 0; i < 5; i++) {
    assert.equal((await post(request({}, `203.0.113.${i + 1}`))).status, 400);
  }
  assert.equal((await post(request({}, "203.0.113.20"))).status, 429);
});

function paddedPayload(size) {
  const empty = JSON.stringify({ ...valid, message: "" });
  return JSON.stringify({ ...valid, message: "a".repeat(size - Buffer.byteLength(empty)) });
}

test("a valid JSON body at the byte limit is accepted", async (t) => {
  const post = await setup(t);
  const json = paddedPayload(16 * 1024);
  assert.equal(Buffer.byteLength(json), 16 * 1024);

  const response = await post(request(json));
  assert.equal(response.status, 200);
  assert.equal(messages.length, 1);
});

test("the body limit counts UTF-8 bytes instead of characters", async (t) => {
  const post = await setup(t);
  const json = JSON.stringify({ ...valid, message: "ł".repeat(8192) });
  assert.ok(json.length < 16 * 1024);
  assert.ok(Buffer.byteLength(json) > 16 * 1024);

  const response = await post(request(json));
  assert.equal(response.status, 413);
  assert.equal(messages.length, 0);
});

for (const contentLength of [null, "5", "invalid"]) {
  test(`oversized streamed JSON is rejected with content-length ${contentLength ?? "absent"}`, async (t) => {
    const post = await setup(t);
    const bytes = new TextEncoder().encode(paddedPayload(16 * 1024 + 1));
    const body = new ReadableStream({
      start(controller) {
        controller.enqueue(bytes.subarray(0, 9000));
        controller.enqueue(bytes.subarray(9000));
        controller.close();
      }
    });
    const headers = { "content-type": "application/json" };
    if (contentLength !== null) headers["content-length"] = contentLength;
    const response = await post(new Request("http://localhost/api/contact", {
      method: "POST", headers, body, duplex: "half"
    }));

    assert.equal(response.status, 413);
    assert.equal((await response.json()).ok, false);
    assert.equal(messages.length, 0);
  });
}

test("oversized declared content-length is rejected without reading the stream", async (t) => {
  const post = await setup(t);
  let reads = 0;
  const body = new ReadableStream({ pull() { reads++; } }, { highWaterMark: 0 });
  const response = await post(new Request("http://localhost/api/contact", {
    method: "POST", headers: { "content-length": "16385" }, body, duplex: "half"
  }));

  assert.equal(response.status, 413);
  assert.equal(reads, 0);
  assert.equal(messages.length, 0);
});

test("reading stops and the stream is cancelled once the limit is exceeded", async (t) => {
  const post = await setup(t);
  let pulls = 0;
  let cancelled = false;
  const body = new ReadableStream({
    pull(controller) {
      pulls++;
      controller.enqueue(new Uint8Array(9000));
    },
    cancel() { cancelled = true; }
  }, { highWaterMark: 0 });
  const response = await post(new Request("http://localhost/api/contact", {
    method: "POST", body, duplex: "half"
  }));

  assert.equal(response.status, 413);
  assert.equal(pulls, 2);
  assert.equal(cancelled, true);
  assert.equal(messages.length, 0);
});

test("UTF-8 characters split across stream chunks are decoded correctly", async (t) => {
  const post = await setup(t);
  const bytes = new TextEncoder().encode(JSON.stringify(valid));
  const split = bytes.indexOf(0xc5) + 1;
  const body = new ReadableStream({
    start(controller) {
      controller.enqueue(bytes.subarray(0, split));
      controller.enqueue(bytes.subarray(split));
      controller.close();
    }
  });
  const response = await post(new Request("http://localhost/api/contact", {
    method: "POST", body, duplex: "half"
  }));

  assert.equal(response.status, 200);
  assert.match(messages[0].text, /Żaneta/);
});
