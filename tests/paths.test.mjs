import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { transform } from "esbuild";

for (const base of ["/", "/france-couverture/"]) {
  test(`assets and routing respect deployment base ${base}`, async () => {
    const { code } = await transform(readFileSync("src/paths.ts", "utf8"), {
      loader: "ts",
      format: "esm",
      define: { "import.meta.env.BASE_URL": JSON.stringify(base) },
    });
    const { assetPath, routerBase } = await import(
      "data:text/javascript;base64," + Buffer.from(code).toString("base64")
    );
    assert.equal(assetPath("images/hero-exclusive.webp"), base + "images/hero-exclusive.webp");
    assert.equal(assetPath("/brand/logo-white.svg"), base + "brand/logo-white.svg");
    assert.equal(routerBase, base === "/" ? "/" : "/france-couverture");
  });
}
