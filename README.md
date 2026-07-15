# CIF Camping

Application interne React/Vite reliée à Supabase pour gérer les arrivées, le Back Office et le Front Office.

## Mise en ligne sur GitHub Pages

### 1. Créer le dépôt

Crée un nouveau dépôt GitHub, puis ajoute tout le contenu de ce dossier à la racine du dépôt. La branche principale doit s'appeler `main`.

### 2. Ajouter les deux informations Supabase

Dans le dépôt GitHub :

`Settings` → `Secrets and variables` → `Actions` → `New repository secret`

Ajoute exactement ces deux secrets :

- `VITE_SUPABASE_URL` : l'adresse de ton projet Supabase
- `VITE_SUPABASE_ANON_KEY` : la clé publique `anon` de Supabase

Ne mets jamais la clé `service_role`, le mot de passe de la base ou une clé secrète dans GitHub.

### 3. Activer GitHub Pages

Dans le dépôt :

`Settings` → `Pages` → `Build and deployment` → `Source` → `GitHub Actions`

### 4. Lancer la mise en ligne

Une fois les fichiers envoyés sur la branche `main`, l'onglet `Actions` lance automatiquement le déploiement. Les mises à jour suivantes se feront simplement en remplaçant les fichiers puis en validant les changements sur `main`.

## Utilisation locale

Copie `.env.example` en `.env`, puis remplace les valeurs par celles de ton projet Supabase.

```powershell
npm install
npm run dev
```

## Base Supabase

Les scripts SQL nécessaires sont dans le dossier `supabase`. Exécute uniquement ceux qui n'ont pas encore été appliqués à ta base.

## Mise à jour des logements — Front Office

Dans l’espace Front Office, le bouton **Mettre à jour les logements** lit un fichier Excel contenant au minimum les colonnes `Reservation Number` et `Cleaning Status`.

Le rapprochement se fait uniquement avec le numéro de réservation de la journée active. Cette action ne modifie ni les informations de réservation, ni les coches, notes ou statuts du Back Office.

États reconnus : `CLEAN`, `TO_BE_CLEANED`, `IN_PROGRESS`, `POSTPONED`, `TO_BE_CHECKED`, `CHECKED` et `TOUCH_UP`.
