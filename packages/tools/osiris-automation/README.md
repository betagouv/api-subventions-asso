# AUTOMATISATION DU TELECHARGEMENT DES DONNEES LCA-OSIRIS

## CONFIGURATION

Pour fonctionner, ce script d'automatisation du téléchargement des données OSIRIS depuis la plateforme Le Compte Asso a besoin d'avoir en .env.local trois variable configurée :

    OSIRIS_URL
    OSIRIS_EMAIL
    OSIRIS_PASSWORD

## EXECUTION

Une fois les variables d'environnement définies, il suffit d'exécuter le script avec la commande `node ./index.js {YEAR} {FILE_TYPE}`.
YEAR définie l'année budgétaire désirée et FILE_TYPE permet de choisir entre les "Requêtes" (SuiviDossiers) ou les "Actions" (SuiviActions).

Une fois démarré, le script ouvre un instance chromium pour s'authentifié puis une seconde instance pour récupérer le cookie une fois connecté. Ce cookie est ensuite utilisé dans la suite du script pour établir la connexion direct et calculer toutes les "possibilités" (c'est à dire toutes les combinaisons possible du formulaire pour l'exercice et le type de fichier désirés). Une fois ces dernières récupérées, commence le vrai téléchargement.

### BUGS

Régulièrement le chromium s'ouvre sur une page blanche. En ouvrant un nouvel onglet on arrive à debloquer Puppeteer.

## TELECHARGEMENT

Le téléchargement est long (surtout pour les actions) et plante régulièrement sans remontée d'erreur. Il faut alors relancer le script qui reprendra à la dernière possibilité téléchargée.

## NETTOYAGE

Le script Osiris/remove-empty-files.js permet de supprimer les fichiers ne contenant aucune ligne (mise à part en-têtes et pied de page) et alléger l'archive à envoyer sur Scalingo.

## IMPORTATION

Pour importer les fichiers sur Scalingo, se référer au script présent dans `packages/api/tools/osiris`
