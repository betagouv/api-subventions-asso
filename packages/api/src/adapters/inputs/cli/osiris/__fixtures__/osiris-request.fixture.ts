import OsirisRequestDto, { OsirisRequestRawData } from "../osiris-request.dto";
import DEFAULT_ASSOCIATION from "../../../../../../tests/__fixtures__/association.fixture";

// Raw shape produced by OsirisParser.parseRequests, with the original French
// XLSX labels. Used to feed OsirisRequestMapper.toDto() in tests.
export const OSIRIS_REQUEST_RAW_DATA: OsirisRequestRawData = {
    Dossier: {
        "N° Dossier Osiris": "DD59-22-0654",
        "N° Dossier Compte Asso": "22-040341",
        "N° EJ": "EJ00001",
        "Date Reception": 43549.44370065972,
        "Date Commission": 43600,
        "Exercice Debut": 2022,
        "Exercice Fin": 2024,
        "Etat Dossier": "Terminé",
        Service: "DR-CENT",
        "N° Programme Type Financement": "FDVA",
        "Sous Type Financement": "Financement global",
        Pluriannualite: "Annuel",
    },
    Bénéficiaire: {
        "N° RNA": DEFAULT_ASSOCIATION.rna,
        "N° Siret": DEFAULT_ASSOCIATION.siret,
        Nom: DEFAULT_ASSOCIATION.name,
        Siege: "Oui",
        IBAN: "FR7642559100000800330277358",
        BIC: "CCOPFRPPXXX",
    },
    "Coordonnées correspondance (publipostage)": {
        Voie: "98 rue de Paris",
        "Code Postal": "59200",
        Commune: "TOURCOING",
    },
    "Représentant légal": {
        Nom: "Doe",
        Prénom: "John",
        Civilité: "Monsieur",
        Fonction: "Président",
        Courriel: "johndoe@example.org",
        "N° Téléphone": "0601020304",
    },
    Montants: {
        "Coût Total des Charges": 25500,
        Demandé: 7500,
        Proposé: 7200,
        Accordé: 7200,
    },
    Versements: {
        Acompte: 0,
        Solde: 0,
        Réalisé: 0,
        "Compensation N-1": 0,
        "Reversement Compensation": 0,
    },
    "Nb Actions": {
        "Nombre Actions": 1,
    },
};

// Same data, expressed in the semantic camelCase DTO consumed by toEntity().
const OSIRIS_REQUEST_DTO: OsirisRequestDto = {
    dossier: {
        osirisId: "DD59-22-0654",
        compteAssoId: "22-040341",
        ej: "EJ00001",
        dateReception: 43549.44370065972,
        dateCommission: 43600,
        exerciceDebut: 2022,
        exerciceFin: 2024,
        etatDossier: "Terminé",
        service: "DR-CENT",
        noProgrammeTypeFinancement: "FDVA",
        sousTypeFinancement: "Financement global",
        pluriannualite: "Annuel",
    },
    association: {
        rna: DEFAULT_ASSOCIATION.rna,
        siret: DEFAULT_ASSOCIATION.siret,
        nom: DEFAULT_ASSOCIATION.name,
        siege: "Oui",
        iban: "FR7642559100000800330277358",
        bic: "CCOPFRPPXXX",
    },
    coordonnees: {
        voie: "98 rue de Paris",
        codePostal: "59200",
        commune: "TOURCOING",
    },
    representantLegal: {
        nom: "Doe",
        prenom: "John",
        civilite: "Monsieur",
        fonction: "Président",
        courriel: "johndoe@example.org",
        telephone: "0601020304",
    },
    montants: {
        coutTotalDesCharges: 25500,
        demande: 7500,
        propose: 7200,
        accorde: 7200,
    },
    versements: {
        acompte: 0,
        solde: 0,
        realise: 0,
        compensationN1: 0,
        reversementCompensation: 0,
    },
    nbActions: {
        nombreActions: 1,
    },
};

export default OSIRIS_REQUEST_DTO;
