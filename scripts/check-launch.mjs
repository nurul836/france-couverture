import { readFileSync } from "node:fs";
import { transform } from "esbuild";
const { code } = await transform(readFileSync("src/site-config.ts", "utf8"), {
  loader: "ts",
  format: "esm",
});
const { siteConfig } = await import(
  "data:text/javascript;base64," + Buffer.from(code).toString("base64")
);
const missing = Object.entries(siteConfig.legal)
  .filter(([, value]) => !value.trim())
  .map(([key]) => "legal." + key);
try {
  if (new URL(siteConfig.quoteEndpoint).protocol !== "https:")
    missing.push("quoteEndpoint HTTPS");
} catch {
  missing.push("quoteEndpoint");
}
if (missing.length) {
  console.error(
    "Lancement public bloqué : renseignements vérifiés ou service manquants :\n" +
      missing.join("\n"),
  );
  process.exit(1);
}
console.log(
  "Paramètres présents. Valider la réception réelle d’une demande et le contenu juridique avant le lancement public.",
);
