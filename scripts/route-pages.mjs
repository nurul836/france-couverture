import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
const html = readFileSync("dist/index.html", "utf8");
const pages = {
  services: [
    "Nos services",
    "Rénovation, réparation, tuiles et ardoises : découvrez les catégories de travaux proposées par France Couverture, à confirmer avec l’entreprise.",
  ],
  "a-propos": [
    "À propos",
    "France Couverture, entreprise de couverture située au 3 Avenue Jean Jaurès à Joinville-le-Pont, 94340.",
  ],
  realisations: [
    "Galerie d’inspiration",
    "Des photographies illustratives de toitures françaises, en attendant les photos de réalisations de France Couverture.",
  ],
  zones: [
    "Zones d’intervention",
    "Contactez France Couverture à Joinville-le-Pont pour confirmer la possibilité d’intervention à votre adresse dans le Val-de-Marne.",
  ],
  contact: [
    "Contact et devis",
    "Contactez France Couverture au 07 56 87 91 10. Coordonnées et demande de devis pour votre projet de toiture.",
  ],
  informations: [
    "Informations et confidentialité",
    "Coordonnées, confidentialité et crédits des photographies.",
  ],
};
for (const [path, [title, description]] of Object.entries(pages)) {
  mkdirSync("dist/" + path, { recursive: true });
  writeFileSync(
    "dist/" + path + "/index.html",
    html
      .replace(
        /<title>.*?<\/title>/,
        "<title>" + title + " | France Couverture</title>",
      )
      .replace(
        /name="description" content="[^"]*"/,
        'name="description" content="' + description + '"',
      ),
  );
}
writeFileSync("dist/robots.txt", "User-agent: *\nDisallow: /\n");
