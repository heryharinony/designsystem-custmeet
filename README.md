# Design system CUSTMEET

Site de documentation statique en français, construit avec Astro. Le fichier `index.html` à la racine contient le document d’origine. Le site Astro est généré à partir de `src/`.

## Développement

Avec Node.js 22.12 ou une version ultérieure, depuis ce dossier.

```sh
npm ci
npm run dev
```

Pour vérifier la version finale avec la recherche Pagefind.

```sh
npm run build
npm run preview
```

La commande `build` génère le document, les redirections et l’index de recherche dans `dist/`. Publiez ce dossier sur un hébergement statique.

## Mise à jour

- Modifiez les entrées MDX dans `src/content/docs/`. Les métadonnées `label`, `category` et `order` pilotent la navigation et `legacyId` définit l’ancre de chaque section. Les anciennes URL définies par `route` redirigent vers ces ancres.
- Chaque rubrique de Composants affiche sa démonstration depuis `src/components/demos/`. Leurs interactions se trouvent dans `src/scripts/demos/`.
- Les variables CSS exportées par le bouton « Copier les tokens CSS » proviennent de `src/styles/brand-tokens.css`. Les thèmes et les styles du site se trouvent dans le même dossier.
- Ajoutez un titre de section avec un identifiant stable pour qu’il soit directement accessible depuis le sommaire et les résultats de recherche. Les titres réservés aux exemples peuvent être exclus du sommaire avec `data-toc-ignore`.
