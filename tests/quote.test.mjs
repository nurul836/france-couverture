import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { transform } from "esbuild";
const { code } = await transform(readFileSync("src/quote.ts", "utf8"), {
  loader: "ts",
  format: "esm",
});
const { sendQuote, validQuoteEndpoint } = await import(
  "data:text/javascript;base64," + Buffer.from(code).toString("base64")
);

test("unconfigured or insecure endpoints cannot receive personal data", async () => {
  for (const endpoint of [
    "",
    "not-a-url",
    "http://receiver.test/quote",
    "javascript:alert(1)",
  ]) {
    assert.equal(validQuoteEndpoint(endpoint), false);
    await assert.rejects(sendQuote(endpoint, new FormData()));
  }
});
test("only an explicit positive acknowledgement allows success", async () => {
  const original = globalThis.fetch;
  try {
    for (const [status, payload] of [
      [200, {}],
      [200, { success: true }],
      [400, { accepted: true }],
      [500, { accepted: false }],
    ]) {
      globalThis.fetch = async () => Response.json(payload, { status });
      await assert.rejects(
        sendQuote("https://receiver.test/quote", new FormData()),
      );
    }
    globalThis.fetch = async () =>
      new Response("<html>OK</html>", { status: 200 });
    await assert.rejects(
      sendQuote("https://receiver.test/quote", new FormData()),
    );
    globalThis.fetch = async () => {
      throw new TypeError("Network failure");
    };
    await assert.rejects(
      sendQuote("https://receiver.test/quote", new FormData()),
    );
    const data = new FormData();
    data.set("nom", "Test");
    globalThis.fetch = async (url, options) => {
      assert.equal(options.method, "POST");
      assert.equal(options.body, data);
      assert.equal(options.redirect, "error");
      assert.equal(options.credentials, "omit");
      return Response.json({ accepted: true });
    };
    await assert.doesNotReject(sendQuote("https://receiver.test/quote", data));
  } finally {
    globalThis.fetch = original;
  }
});
