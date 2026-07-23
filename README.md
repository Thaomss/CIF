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

## Contrôle journée Front Office

Avant la première utilisation de l’écran **Contrôle journée**, exécuter une seule fois dans Supabase SQL Editor :

`supabase/front_day_check.sql`

Le premier import crée la liste indépendante du Back Office. L’ordre des colonnes est libre : l’application repère leurs noms automatiquement, même si la ligne d’en-tête n’est pas la première ligne du fichier. Le fichier doit contenir au minimum `Reservation Number` ; la colonne `Cleaning Status` peut être absente le matin. Les colonnes client et emplacement sont utilisées dès qu’elles sont présentes.

À chaque nouvel import, l’application compare les réservations par numéro :

- une nouvelle réservation est ajoutée automatiquement avec la mention **Last minute** ;
- une réservation absente est signalée et peut être gardée ou supprimée individuellement ;
- un changement d’état de nettoyage remet uniquement cette réservation à vérifier et l’affiche en jaune ;
- les réservations déjà vérifiées et dont l’état n’a pas changé restent validées.

États reconnus : `CLEAN`, `TO_BE_CLEANED`, `IN_PROGRESS`, `POSTPONED`, `TO_BE_CHECKED`, `CHECKED`, `TOUCH_UP` et `OCCUPIED_CLEAN`, avec plusieurs synonymes courants. Toute autre valeur est quand même importée, conservée, affichée avec un style « statut inhabituel » et comparée normalement lors des mises à jour suivantes.

Quand une réservation regroupe plusieurs logements dans le même export, leurs emplacements et leurs états sont regroupés sous le même numéro de réservation.
