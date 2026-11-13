# France Couverture — état de livraison

## Changements

- Routes conservées, logo SVG marine/blanc et favicon, navigation et coordonnées réelles.
- 22 photographies locales distinctes, chacune créditée, variantes responsives ; photographie réservée au hero et photographies propres aux huit catégories de services.
- Introduction centrée sur le geste, services en présentation éditoriale, matériaux illustrés, galerie de six références dans un fichier de données autonome, section locale avec photographie de Joinville-le-Pont et liens Google Maps/téléphone.
- Composition plus photographique, angles adoucis, palette marine/ivoire/orange, transitions et animations respectant les préférences de mouvement réduit.
- Polices locales sous licence OFL. Aucun chargement automatique de Google Fonts.
- Retrait des mentions de démonstration et des messages de faux envoi. Les photographies restent présentées honnêtement comme des références, jamais comme des chantiers clients.
- Formulaire avec validation et transport multipart configurable. Sans endpoint HTTPS, champs et envoi désactivés ; contact téléphonique disponible. La réussite nécessite une réponse JSON explicite `{ "accepted": true }` et un code HTTP positif. Les réponses ambiguës et erreurs réseau ne produisent pas de message de réussite.

## Vérifications

Compilation TypeScript/Vite ; tests de transport du formulaire ; tests DOM des sept routes, images, liens, header unique, FAQ, services, filtres et galerie. Scénarios de navigation DOM aux largeurs 320, 375, 430 et 768 px. Les scénarios DOM ne vérifient pas le rendu CSS.

Le navigateur `cua_repl.js` n’est pas disponible. Conformément au workflow de cet environnement, aucun navigateur alternatif n’a été lancé : contrôle visuel des recadrages, du débordement réel et de la fluidité restant à effectuer. La référence fournie a guidé la direction graphique ; elle n’a pas été réutilisée comme photographie dont la licence serait inconnue.

## Blocages du lancement public

1. Fournir la raison sociale, la forme juridique, le numéro d’immatriculation, le responsable de publication, les coordonnées légales de l’hébergeur, le contact de confidentialité et la durée de conservation, vérifiés par le propriétaire.
2. Configurer un véritable service de réception sécurisé et vérifier une réception réelle. Aucun destinataire ni secret n’a été inventé. Le site ne transmet actuellement aucune demande.
3. Valider les prestations et le périmètre d’intervention ; fournir les photographies de vrais chantiers si un portfolio d’entreprise est souhaité.
4. Effectuer la validation visuelle dans un navigateur avant le lancement public.

`npm run check:launch` identifie les paramètres manquants de `src/site-config.ts`. Une compilation réussie ne signifie pas que ces blocages sont résolus. La publication éventuelle sur Sites conserve l’accès privé du projet pour revue.

## Contrat du service de réception

`src/site-config.ts` contient uniquement des paramètres publics, jamais de secrets. Le service doit accepter un POST HTTPS multipart avec `nom`, `telephone`, `email`, `travaux`, `adresse`, `description`, `photo` facultative et `consent=accepted`. Il doit contrôler côté serveur les champs, le consentement, la taille de 10 Mo, le type réel de l’image, la limitation d’abus et l’autorisation CORS du domaine. Il doit confirmer `accepted: true` uniquement après réception durable ou prise en charge effective de l’envoi. Le champ `website` sert de piège anti-robot côté interface ; il ne remplace pas une protection serveur. La politique de confidentialité doit être validée pour le prestataire retenu avant activation.
