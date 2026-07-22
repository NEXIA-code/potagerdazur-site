# Déploiement du site Potager d'Azur

Ce dossier est un site statique complet (6 pages HTML, dossier images/, sitemap.xml, robots.txt). Aucun backend, aucune base de données : n'importe quel hébergeur statique le sert tel quel. Ce document compare trois hébergeurs gratuits et donne la procédure DNS pas à pas.

## Étape 0, avant toute mise en ligne

1. Remplacer le jeton de domaine. Les fichiers contiennent le texte `DOMAINE-A-REMPLACER` (balises canonical, og:url, og:image, sitemap.xml, robots.txt). Une fois le domaine acheté (exemple : potagerdazur.fr), lancer dans ce dossier :

   ```
   cd ~/Documents/ObsidianVault/Assets/site-client-potager
   LC_ALL=C sed -i '' 's|DOMAINE-A-REMPLACER|www.potagerdazur.fr|g' index.html catalogue.html devis.html faq.html contact.html mentions-legales.html sitemap.xml robots.txt
   ```

   Adapter `www.potagerdazur.fr` au domaine réel. Vérifier ensuite : `grep -r DOMAINE-A-REMPLACER .` doit ne rien renvoyer.

2. Compléter le médiateur de la consommation dans mentions-legales.html (mention « inscription en cours » actuelle). C'est une obligation légale avant toute vente à des particuliers : l'inscription cm2c.net doit être faite et le nom du médiateur reporté ici. Le texte exact à insérer et la liste complète des fichiers à mettre à jour en même temps sont dans `Données/checklist-propagation-mediateur-cm2c.md` (point 11 pour ce site).

3. Compléter le bloc « Hébergement » de mentions-legales.html : une fois l'hébergeur choisi, y reporter son nom, sa raison sociale, son adresse et son téléphone (ces informations figurent dans les mentions légales ou conditions d'utilisation de l'hébergeur). Le bloc actuel dit « à compléter lors de la mise en ligne ».

4. Vérifier une dernière fois le numéro de téléphone affiché (06 52 94 64 35) et le SIRET (106 710 098 00018).

## Comparatif des hébergeurs statiques gratuits

| Critère | Netlify | Cloudflare Pages | GitHub Pages |
|---|---|---|---|
| Mise en ligne sans Git | Oui, glisser-déposer le dossier sur app.netlify.com/drop | Oui, téléversement direct depuis le tableau de bord | Non, dépôt Git obligatoire |
| Domaine personnalisé | Oui, gratuit | Oui, gratuit | Oui, gratuit |
| HTTPS automatique | Oui (Let's Encrypt) | Oui | Oui |
| Limite du plan gratuit | 100 Go de trafic par mois, largement suffisant | Trafic non plafonné pour du statique | Usage raisonnable, site public |
| Contrainte principale | Compte à créer | Domaine idéalement géré chez Cloudflare pour l'apex | Les fichiers vivent dans un dépôt public |
| Mise à jour du site | Re-glisser le dossier | Re-téléverser | Commit + push |

Recommandation : **Netlify** pour démarrer. C'est la seule option où la mise en ligne complète tient en un glisser-déposer, sans Git ni ligne de commande, et la mise à jour du catalogue se fait de la même façon. Cloudflare Pages est un bon second choix si le domaine est de toute façon géré chez Cloudflare. GitHub Pages est déconseillé ici : il impose un dépôt Git public et un flux de travail plus technique pour aucun gain.

Règle de sécurité valable partout : ne téléverser QUE le contenu de ce dossier (les 6 pages, images/, sitemap.xml, robots.txt). Jamais le vault, jamais de fichier Données/, jamais de fichier interne avec prix d'achat ou marques fournisseurs, jamais d'identifiants dans un fichier du site.

## Procédure Netlify pas à pas

1. Créer un compte sur netlify.com (adresse email professionnelle).
2. Préparer un dossier de mise en ligne : copier site-client-potager vers un dossier temporaire (par exemple sur le Bureau) puis y SUPPRIMER ce fichier DEPLOIEMENT.md, qui est un document interne et ne doit jamais être publié. Le dossier téléversé contient uniquement : les 6 pages HTML, images/, sitemap.xml, robots.txt.
3. Aller sur app.netlify.com/drop et glisser ce dossier préparé. Le site est en ligne en moins d'une minute sur une adresse temporaire du type nom-aleatoire.netlify.app. Vérifier les 6 pages sur cette adresse.
4. Dans Site settings, renommer le site (exemple : potagerdazur) pour une adresse temporaire lisible.
5. Domain management, Add custom domain : saisir le domaine acheté. Netlify affiche alors les enregistrements DNS exacts à créer chez le registrar.

## Procédure DNS chez le registrar (OVH, Gandi, Ionos : mêmes principes)

1. Se connecter à l'espace client du registrar où le domaine a été acheté, ouvrir la zone DNS du domaine.
2. Supprimer les enregistrements A et CNAME préinstallés qui pointent vers la page de parking du registrar (uniquement ceux du domaine nu et de www, ne pas toucher aux enregistrements MX si une adresse email est prévue sur ce domaine).
3. Créer les deux enregistrements que Netlify indique, typiquement :
   - Type A, nom vide (domaine nu), valeur : l'adresse IP donnée par Netlify (75.2.60.5 à la date de rédaction, toujours vérifier la valeur affichée dans Domain management).
   - Type CNAME, nom www, valeur : l'adresse temporaire du site (exemple : potagerdazur.netlify.app), avec un point final si le registrar l'exige.
4. Laisser le TTL par défaut. La propagation prend de 5 minutes à 24 heures (souvent moins d'une heure chez OVH).
5. De retour dans Netlify, cliquer sur Verify puis activer le HTTPS (certificat Let's Encrypt automatique une fois le DNS propagé). Choisir la redirection du domaine nu vers www (ou l'inverse) pour n'avoir qu'une seule adresse canonique, identique à celle mise dans les balises à l'étape 0.

## Vérifications après mise en ligne

1. Ouvrir les 6 pages en HTTPS sur le domaine final, sur mobile et sur ordinateur.
2. Vérifier https://domaine/robots.txt et https://domaine/sitemap.xml.
3. Soumettre le sitemap dans Google Search Console (propriété à créer avec le domaine, validation par enregistrement DNS TXT proposé par Google).
4. Tester l'aperçu de partage (og:image) avec l'outil de débogage de partage de Facebook, utile avant de poster le lien sur Facebook ou Le Bon Coin.
5. Après chaque mise à jour du catalogue : refaire le glisser-déposer du dossier complet, puis vider le cache de partage Facebook si l'aperçu a changé.

## Ce que ce document ne contient volontairement pas

Aucun identifiant, aucun mot de passe, aucune donnée interne (prix d'achat, marques fournisseurs, marges). Les comptes créés (registrar, Netlify, Search Console) restent sous le contrôle exclusif de Romain.
