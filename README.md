# DCE_F DAHARI — PWA Offline

Application web progressive (PWA) pour l'enquête DCE sur les aires marines protégées à Anjouan.

## Structure

```
DCE_F_PWA/
├── index.html          ← Application complète (HTML + CSS + JS)
├── sw.js               ← Service Worker (cache offline)
├── manifest.json       ← Manifest PWA
├── README.md
└── images/             ← Toutes les images des attributs
    ├── DAHARI.png         (logo DAHARI)
    ├── platier.png        (localisation : platier)
    ├── crete.png          (localisation : crête)
    ├── au_dela.png        (localisation : au-delà de la crête)
    ├── tampon_absence.png (zone tampon : absence)
    ├── tampon_presence.png(zone tampon : présence)
    ├── 0hh.png            (temps volontaire : 0 jour/mois)
    ├── 2hh.png            (temps volontaire : 2 jours/mois)
    ├── 4hh.png            (temps volontaire : 4 jours/mois)
    ├── 6hh.png            (temps volontaire : 6 jours/mois)
    ├── comp_aucune.png    (compensation : aucune)
    ├── frigo.png          (compensation : frigo)
    ├── fournitures.png    (compensation : fourniture scolaire)
    └── hangar.png         (compensation : hangar public)
```

## Design expérimental

- **4 attributs** : localisation (3), zone tampon (2), temps (4 : 0/2/4/6 j/mois), compensation (4)
- **12 ensembles** : 2 blocs de 6 (tirage aléatoire du bloc par répondant)
- **3 alternatives par ensemble** : Option A, Option B, Opt-Out
- **DB-error** : 0.450 (design D-optimal avec priors nuls, 80 départs)
- **Équilibre des blocs** : score = 0 (parfaitement équilibré)

## Déploiement GitHub Pages (une seule fois)

1. Créer un dépôt public GitHub (ex: `dahari-dce-f`)
2. Uploader tous les fichiers du dossier `DCE_F_PWA/` à la racine du dépôt
   - **Ajouter les images dans `images/`** avant l'upload
3. `Settings → Pages → Source : Deploy from a branch → main → / (root) → Save`
4. URL obtenue : `https://VOTRE-COMPTE.github.io/dahari-dce-f/`

## Installation sur les tablettes Android

**À faire avec WiFi AVANT le terrain (une fois par tablette) :**

1. Ouvrir Chrome sur la tablette
2. Aller à l'URL GitHub Pages ci-dessus
3. Attendre que la page charge complètement
4. Menu Chrome (⋮) → **« Ajouter à l'écran d'accueil »**
5. Confirmer l'installation
6. Activer le **mode Avion** → vérifier que l'appli s'ouvre toujours ✓

L'application fonctionne désormais **100 % hors ligne**.

## Collecte des données

- Les réponses s'accumulent dans le **localStorage** de la tablette
- Clé : `dce_f_data`
- Chaque répondant ajoute 18 lignes (6 sets × 3 alternatives)

## Récupération des données

**À la fin du terrain, avec la tablette et une connexion :**

1. Ouvrir l'application → compléter ou simuler une enquête → écran « Merci »
2. Cliquer **📥 Exporter les données CSV**
3. Le fichier `DCE_F_DAHARI_YYYY-MM-DD-HH-mm.csv` se télécharge automatiquement

Ou depuis la console Chrome (F12 / mode développeur) :
```javascript
JSON.parse(localStorage.getItem('dce_f_data'))
```

## Colonnes du CSV exporté

| Colonne | Description |
|---------|-------------|
| timestamp | Date/heure de l'enregistrement |
| id_repondant | ID pêcheur |
| enqueteur | Nom de l'enquêteur |
| village … zone_principale_autre | Questions socio-démographiques (Q1–Q11) |
| connait_dahari … beneficiaires_autre | Section B – connaissance (Q12–Q19) |
| bloc | Bloc tiré (1 ou 2) |
| tache | Numéro de la tâche (1–6) |
| ensemble_choix | Numéro du set (1–12) |
| alternative | A / B / OptOut |
| choix | 1 si alternative choisie, 0 sinon |
| raison_optout | Code raison opt-out (si applicable) |
| type_optout | vrai_zero / protestation / incomprehension / a_classer |
| localisation | Platier / Crête / Au-delà de la crête |
| zone_tampon | Absence / Présence |
| temps_volontaire | 0 / 2 / 4 / 6 |
| compensation | Aucune / Frigo / Fourniture scolaire / Hangar public |
| diff_comprehension … diff_commentaires | Débriefing |
| gouv_implication_tous … gouv_femmes_exclues | Gouvernance Likert 1–5 |

## Réinitialiser les données sur une tablette

```javascript
// Dans la console Chrome (F12)
localStorage.removeItem('dce_f_data');
```

## Fusion des fichiers (retour de terrain)

```r
library(dplyr)
fichiers <- list.files("data/", pattern="DCE_F_.*\\.csv", full.names=TRUE)
df_final <- bind_rows(lapply(fichiers, read.csv, encoding="UTF-8"))
write.csv(df_final, "resultats_complets.csv", row.names=FALSE)
```
