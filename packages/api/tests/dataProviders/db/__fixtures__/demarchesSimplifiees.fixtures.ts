import DemarchesSimplifieesDataEntity from "../../../../src/modules/providers/demarchesSimplifiees/entities/DemarchesSimplifieesDataEntity";
import DemarchesSimplifieesMapperEntity from "../../../../src/modules/providers/demarchesSimplifiees/entities/DemarchesSimplifieesMapperEntity";
import DEFAULT_ASSOCIATION from "../../../__fixtures__/association.fixture";

export const DATA_ENTITIES: DemarchesSimplifieesDataEntity[] = [
    {
        demande: {
            id: "RG9zc2llci0xMDE0ODcxNw==",
            demandeur: {
                siret: DEFAULT_ASSOCIATION.siret,
                association: { rna: DEFAULT_ASSOCIATION.rna, titre: "DEMARCHE_1" },
            },
            demarche: {
                title: "Aide au projet ou au fonctionnement - Transmission culturelle (2023)",
            },
            groupeInstructeur: {
                label: "Auvergne-Rhône-Alpes",
            },
            motivation:
                "Bonjour, votre subvention 2023 a été mise en paiement. Veuillez trouver, ci-joint, l'acte attributif de subvention. Cet envoi constitue la notification officielle.",
            state: "accepte",
            dateDepot: "2022-10-07T17:02:34+02:00",
            datePassageEnInstruction: "2022-11-17T15:13:52+01:00",
            dateDerniereModification: "2023-07-26T10:49:43+02:00",
            dateTraitement: "2023-07-26T10:49:42+02:00",
            pdf: {
                url: "https://www.demarches-simplifiees.fr/api/v2/dossiers/pdf/PDF_ID",
                filename: "dossier-10148717.pdf",
                contentType: "application/pdf",
            },
            champs: {
                "Q2hhbXAtMzM0ODAxMA==": {
                    value: "Auvergne-Rhône-Alpes",
                    label: "Votre région d'intervention",
                },
                "Q2hhbXAtMjc1MTY4OA==": {
                    value: "Arts visuels",
                    label: "Domaine(s) culturel(s) et artistique(s)",
                },
                "Q2hhbXAtMjEyNjc5OA==": {
                    value: "",
                    label: "Informations préliminaires : données personnelles",
                },
                "Q2hhbXAtMjA5NDAyOA==": {
                    value: "",
                    label: "Recueil des données personnelles",
                },
                "Q2hhbXAtMjM2MzcyOQ==": {
                    value: "",
                    label: "Formulaire de demande",
                },
                "Q2hhbXAtMjcyMjc1Nw==": {
                    value: "Une collectivité territoriale",
                    label: "Vous êtes",
                },
                "Q2hhbXAtMjUwMjU1MA==": {
                    value: "false",
                    label: "Avez-vous été subventionné(e) par le ministère de la Culture l’année dernière ?",
                },
                "Q2hhbXAtMjY4NDg1Ng==": {
                    value: "Projet(s) / action(s)",
                    label: "Objet de la subvention",
                },
                "Q2hhbXAtMjQ4NzkwOQ==": {
                    value: "false",
                    label: "Avez-vous sollicité un autre financeur public ?",
                },
                "Q2hhbXAtMjc3NTI0Mg==": {
                    value: "false",
                    label: "Votre structure bénéficie-t-elle d’une licence d’entrepreneurs du spectacle ?",
                },
                "Q2hhbXAtMjI4OTkyNw==": {
                    value: "",
                    label: "1. Identité du demandeur",
                },
                "Q2hhbXAtMjQxOTI4NA==": {
                    value: "",
                    label: "Précision",
                },
                "Q2hhbXAtMjcyMjc3OA==": {
                    value: "L'adresse du siège social",
                    label: "L'adresse de correspondance est",
                },
                "Q2hhbXAtMjcyMjc4MA==": {
                    value: "",
                    label: "Représentant légal de la structure",
                },
                "Q2hhbXAtMjUwNTg2OA==": {
                    value: "John",
                    label: "Prénom",
                },
                "Q2hhbXAtMjMzNzU1Mw==": {
                    value: "Doe",
                    label: "Nom",
                },
                "Q2hhbXAtMjM2MzM2NQ==": {
                    value: "Maire de la ville de Austrivage",
                    label: "Fonction",
                },
                "Q2hhbXAtMjM2MzM2Nw==": {
                    value: "01 02 03 04 05",
                    label: "Numéro de téléphone",
                },
                "Q2hhbXAtMjMzNzMwNA==": {
                    value: "mairie@ville-austrivage.az",
                    label: "Adresse mail",
                },
                "Q2hhbXAtMjUwNTg3MA==": {
                    value: "",
                    label: "Personne chargée du suivi du présent dossier",
                },
                "Q2hhbXAtMjcyMjg2Ng==": {
                    value: "Une autre personne",
                    label: "La personne en charge du suivi du dossier est",
                },
                "Q2hhbXAtMjUwNTg2OQ==": {
                    value: "Draka",
                    label: "Prénom",
                },
                "Q2hhbXAtMjMzNzU1NQ==": {
                    value: "Dunord",
                    label: "Nom",
                },
                "Q2hhbXAtMjM2MzM3Ng==": {
                    value: "Directrice du VOG - centre d'art contemporain de la ville de Austrivage",
                    label: "Fonction",
                },
                "Q2hhbXAtMjM2MzM3NQ==": {
                    value: "01 02 03 04 05",
                    label: "Numéro de téléphone",
                },
                "Q2hhbXAtMjMzNzU1Ng==": {
                    value: "draka.dunord@ville-austrivage.fr",
                    label: "Adresse mail",
                },
                "Q2hhbXAtMjMzOTQ4NA==": {
                    value: "",
                    label: "2.1. Présentation du projet",
                },
                "Q2hhbXAtMjM2MzQwMg==": {
                    value: "Atelier d'arts plastiques et d’écriture en Hors temps scolaire ",
                    label: "Intitulé du projet",
                },
                "Q2hhbXAtMjM2MzQwNA==": {
                    value: "Projet d'atelier d'arts plastiques [...]",
                    label: "Objectifs du projet",
                },
                "Q2hhbXAtMjM0MDQ2Mw==": {
                    value: "La pratique artistique est très importante pour sensibiliser les jeunes [...]",
                    label: "Description du projet",
                },
                "Q2hhbXAtMjQxOTY3OA==": {
                    value: "Artistes impliqués en arts plastiques : [...]",
                    label: "Informations complémentaires sur les bénéficiaires du projet",
                },
                "Q2hhbXAtMjY0NzI3MA==": {
                    value: "Intercommunale",
                    label: "Echelle de territoire du projet",
                },
                "Q2hhbXAtMjYzMzk3Ng==": {
                    value: "38 - Isère",
                    label: "Département(s) concerné(s) par le projet",
                },
                "Q2hhbXAtMjU0ODEwMg==": {
                    value: "",
                    label: "Département(s) et commune(s) concerné(s) par le projet",
                },
                "Q2hhbXAtMjcyMjkxMQ==": {
                    value: "false",
                    label: "Votre projet se déroule-t-il en quartier prioritaire de la ville (QPV) ?",
                },
                "Q2hhbXAtMjQxOTY4MQ==": {
                    value: "Projet dans le cadre du PLEAC",
                    label: "Informations complémentaires sur le territoire du projet",
                },
                "Q2hhbXAtMjM2MzUxNg==": {
                    value: "Projet dans le cadre du PLEAC [...]",
                    label: "Indicateurs et méthodes d'évaluation",
                },
                "Q2hhbXAtMjM2MzQ5NQ==": {
                    value: "01 janvier 2023",
                    label: "Date de début du projet",
                },
                "Q2hhbXAtMjM2MzQ5Ng==": {
                    value: "31 décembre 2023",
                    label: "Date de fin du projet",
                },
                "Q2hhbXAtMjUwNjcxOQ==": {
                    value: "",
                    label: "Documents complémentaires relatifs au projet",
                },
                "Q2hhbXAtMjc3NTAzMA==": {
                    value: "",
                    label: "Précisions complémentaires",
                },
                "Q2hhbXAtMjcyMjk5NQ==": {
                    value: "",
                    label: "2.2. Moyens humains affectés au projet",
                },
                "Q2hhbXAtMjcyMjk5OA==": {
                    value: "",
                    label: "Vous n'êtes pas concerné(e) par cette partie.",
                },
                "Q2hhbXAtMjM2MzUxOQ==": {
                    value: "",
                    label: "3. Attestations",
                },
                "Q2hhbXAtMjM2MzcxMQ==": {
                    value: "John Doe",
                    label: "Je soussigné(e)",
                },
                "Q2hhbXAtMjM2MzcxMg==": {
                    value: "",
                    label: "...représentant(e) légal(e) de la structure (ou personne dûment habilitée), déclare",
                },
                "Q2hhbXAtMjM2MzcxMw==": {
                    value: "true",
                    label: "... que la structure est à jour de ses obligations administratives, comptables, sociales et fiscales (déclarations et paiements correspondants)",
                },
                "Q2hhbXAtMjcyMzAxOA==": {
                    value: "true",
                    label: "... exactes et sincères les informations du présent formulaire, notamment relatives aux demandes de subventions déposées auprès d'autres financeurs publics",
                },
                "Q2hhbXAtMjcyMzAyMQ==": {
                    value: "1300",
                    label: "... demander une subvention de",
                },
                "Q2hhbXAtMjcyMzAyMA==": {
                    value: "2600",
                    label: "... que le montant total du budget prévisionnel de la demande s'élève à",
                },
                "Q2hhbXAtMjcyMzAxOQ==": {
                    value: "true",
                    label: "... que cette subvention, si elle est accordée, sera versée sur le compte bancaire de la structure",
                },
                "Q2hhbXAtMjM2MzcxOA==": {
                    value: "",
                    label: "4. Pièces justificatives à joindre au dossier",
                },
                "Q2hhbXAtMjM2MzcxNw==": {
                    value: "",
                    label: "RIB (au format PDF)",
                },
                "Q2hhbXAtMjUwNjk5NA==": {
                    value: "TTC",
                    label: "Les montants du budget sont exprimés en",
                },
                "Q2hhbXAtMjM2MzUxNw==": {
                    value: "",
                    label: "Budget du projet",
                },
                "Q2hhbXAtMjEyNjgwMg==": {
                    value: "",
                    label: "Information finale",
                },
                "Q2hhbXAtMjcyMzAyOQ==": {
                    value: "",
                    label: "Compte-rendu de l'action subventionnée",
                },
                "Q2hhbXAtMjA5NDAzMw==": {
                    value: "",
                    label: "Information importante",
                },
            },
            annotations: {
                "Q2hhbXAtMjU0OTQ4Mw==": {
                    value: "",
                    label: "Instruction administrative",
                },
                "Q2hhbXAtMjUzNTQzNg==": {
                    value: "true",
                    label: "Le dossier est-il complet ?",
                },
                "Q2hhbXAtMjU0OTU2MQ==": {
                    value: "",
                    label: "Si non, quelles sont les pièces jointes manquantes ?",
                },
                "Q2hhbXAtMjU0OTU2Mg==": {
                    value: "",
                    label: "Historique des échanges avec l'usager",
                },
                "Q2hhbXAtMjU0OTU2Mw==": {
                    value: "true",
                    label: "Le bilan N-2 a-t-il été reçu ?",
                },
                "Q2hhbXAtMjU0OTk3Ng==": {
                    value: "oui",
                    label: "Si oui, quel est l'avis sur le bilan ?",
                },
                "Q2hhbXAtMjU0OTk3Nw==": {
                    value: "",
                    label: "Si non, à quelle date la relance a-t-elle été réalisée ?",
                },
                "Q2hhbXAtMjU2ODk2Mg==": {
                    value: "false",
                    label: "Le bilan N-1 a-t-il été reçu ?",
                },
                "Q2hhbXAtMjU0OTk3OA==": {
                    value: "",
                    label: "Instruction métier et financière",
                },
                "Q2hhbXAtMjU2OTA5MA==": {
                    value: "",
                    label: "Avis sur le dossier",
                },
                "Q2hhbXAtMjY1MTUwMQ==": {
                    value: "",
                    label: "Eligibilité de la structure",
                },
                "Q2hhbXAtMjU0OTk4MA==": {
                    value: "priorité 1",
                    label: "Appréciation globale du projet",
                },
                "Q2hhbXAtMjU0OTk4MQ==": {
                    value: "1200",
                    label: "Montant de la subvention proposé",
                },
                "Q2hhbXAtMjU0OTk4Mg==": {
                    value: "",
                    label: "Montant de la subvention accordé",
                },
                "Q2hhbXAtMjY3NDMxMA==": {
                    value: "0001821732",
                    label: "Engagement Juridique",
                },
            },
        },
        demarcheId: 62746,
        siret: DEFAULT_ASSOCIATION.siret,
        service: {
            nom: "--",
            organisme: "Ministère de la Culture",
        },
    },
];

export const SCHEMAS: DemarchesSimplifieesMapperEntity[] = [
    {
        demarcheId: 62746,
        schema: [
            {
                from: "demande.groupeInstructeur.label",
                to: "service_instructeur",
            },
            {
                from: "siret",
                to: "siret",
            },
            {
                from: "demande.state",
                to: "status",
            },
            {
                from: "demande.champs.Q2hhbXAtMjM2MzQwMg==.value",
                to: "actions_proposee[0].intitule",
            },
            {
                from: "demande.champs.Q2hhbXAtMjM2MzQwNA==.value",
                to: "actions_proposee[0].objectifs",
            },
            {
                from: "demande.champs.Q2hhbXAtMjM0MDQ2Mw==.value",
                to: "actions_proposee[0].description",
            },
            {
                from: "demande.champs.Q2hhbXAtMjcyMzAyMQ==.value",
                to: "montants.demande",
            },
            {
                from: "demande.annotations.Q2hhbXAtMjU0OTk4Mg==.value",
                to: "montants.accorde",
            },
            {
                from: "demande.dateDepot",
                to: "transmis_le",
            },
            {
                from: "demande.champs.Q2hhbXAtMjM2MzQ5NQ==.value",
                to: "date_debut",
            },
            {
                from: "demande.champs.Q2hhbXAtMjM2MzQ5Ng==.value",
                to: "date_fin",
            },
            {
                from: "demande.demarche.title",
                to: "dispositif",
            },
            {
                from: "demande.annotations.Q2hhbXAtMjY3NDMxMA==.value",
                to: "ej",
            },
            {
                from: "demande.annotations.Q2hhbXAtMjY3NDMxMA==.value",
                to: "versementKey",
            },
        ],
        commonSchema: [
            {
                to: "siret",
                from: "siret",
            },
            {
                to: "service_instructeur",
                from: "demande.groupeInstructeur.label",
            },
            {
                to: "dispositif",
                from: "demande.demarche.title",
            },
            {
                to: "montant_accorde",
                from: "demande.annotations.Q2hhbXAtMjU0OTk4Mg==.value",
            },
            {
                to: "montant_demande",
                from: "demande.champs.Q2hhbXAtMjcyMzAyMQ==.value",
            },
            {
                to: "objet",
                from: "demande.champs.Q2hhbXAtMjM2MzQwMg==.value",
            },
            {
                to: "providerStatus",
                from: "demande.state",
            },
            {
                to: "dateTransmitted",
                from: "demande.dateDepot",
            },
        ],
    },
];
