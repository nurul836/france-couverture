# France Couverture — audit et refonte

## Défauts identifiés dans le code et les visuels sources

- Trois photographies utilisées dans la plupart des composants, dont le hero, les services, la présentation et la galerie.
- Absence de symbole de marque et de favicon ; simple mot-symbole typographique.
- Services constitués d’une grille uniforme ; manque de variation entre les sections.
- Hero fondé sur une photographie verticale, peu adaptée à une composition panoramique.
- Menu mobile et galerie sans gestion complète du focus clavier.
- Téléphone validé essentiellement par la longueur et les caractères, sans contrôle du nombre de chiffres.
- Risque de débordement des filtres avec l’ajout d’une quatrième catégorie ; correction par retour à la ligne et espacement réduit.

## Modifications

- 18 photographies distinctes avec source, auteur et licence, intégrées localement en WebP et variantes de 640 px. Aucune photographie répétée dans une même page ; les mêmes services et la même galerie conservent leurs images sémantiques entre les routes.
- Hero réservé à une photographie française de toiture, recadrage immersif, contraste renforcé, hiérarchie éditoriale et parallax discret.
- Logo SVG géométrique : versions marine et blanche, favicon assorti.
- Header unique, navigation centrée sur grand écran, CTA et menu plein écran sur tablette/mobile.
- Introduction illustrée, services en alternance, détail des matériaux, section du geste, galerie asymétrique et CTA plus sobre.
- Révélations, transitions de masques, progression de timeline, transitions du menu et indicateur de changement de page ; préférence de mouvement réduit respectée.
- Piégeage du focus et fermeture Échap dans les panneaux modaux ; restauration du focus à leur fermeture.
- Validation supplémentaire du téléphone, remise à zéro du message lors de la modification du formulaire, absence d’envoi clairement expliquée.
- Informations, coordonnées, routes et fonctionnalités conservées.

## Vérifications effectuées

- Compilation TypeScript et Vite de production.
- Vérification DOM des sept routes : un header, un titre h1, un footer, liens internes connus, présence des fichiers image, texte alternatif et absence de photographie répétée dans chaque page.
- Tests DOM des services, FAQ, filtres, ouverture et fermeture Échap de la galerie.
- Scénarios DOM à 320, 375, 430 et 768 px : ouverture du menu, navigation vers Contact, fermeture du menu, formulaire vide invalide, formulaire rempli valide et message explicitant l’absence d’envoi.
- Contrôle des fichiers WebP, des sources responsives, de l’absence de doublons binaires et des points d’entrée directs de chaque route.

## Limites

L’outil navigateur `cua_repl.js` n’est pas proposé dans cette session. Conformément au workflow Sites de l’environnement géré, aucun serveur de prévisualisation ni navigateur alternatif n’a été lancé. Les tests DOM ne mesurent pas le rendu, les débordements réels, les recadrages CSS, les contrastes visuels ou la fluidité à l’écran. Une validation visuelle dans un navigateur reste donc nécessaire aux quatre largeurs demandées. La galerie montre des illustrations, pas des chantiers de l’entreprise. Le formulaire n’a pas de backend.

## À obtenir auprès de l’entreprise

- Validation des prestations et du périmètre d’intervention.
- Photographies autorisées des vrais chantiers, de l’équipe et de l’entreprise.
- Identité juridique complète et mentions légales.
- Conditions et modalités de devis et d’intervention.
- Destination des demandes, prestataire d’envoi sécurisé et politique de conservation avant connexion du formulaire.
- Validation de la nouvelle identité graphique.

## Publication de cette refonte

La version précédente reste en ligne. La refonte n’a pas été publiée : l’accès Git délivré pendant le travail a expiré, et son renouvellement est refusé par Sites avec `sites_git_client_upgrade_required` / « Sites Git is not yet enabled for this client ». Un push avec l’accès précédent a confirmé son expiration (HTTP 403). Aucun appel de déploiement n’a été effectué avec des sources non synchronisées. La vérification HTTP des nouvelles images sur le site déployé n’a donc pas pu être effectuée.
