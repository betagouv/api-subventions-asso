import { ObjectId } from "mongodb";
import { ParserInfo, ParserPath } from "../../../../@types";
import ILegalInformations from "../../../search/@types/ILegalInformations";
import RequestEntity from "../../../search/entities/RequestEntity";
import IOsirisRequestInformations from "../@types/IOsirisRequestInformations";
import OsirisActionEntity from "./OsirisActionEntity";

export default class OsirisRequestEntity extends RequestEntity {
    public static defaultMainCategory = "Dossier";

    public static indexedProviderInformationsPath: {
        [key: string]: ParserPath | ParserInfo; // TODO <string|number>
    } = {
        osirisId: ["Dossier", "N° Dossier Osiris"],
        compteAssoId: ["Dossier", "N° Dossier Compte Asso"],
        ej: ["Dossier", "N° EJ"],
        amountAwarded: {
            path: ["Montants", "Accordé"],
            adapter: value => {
                if (!value) return value;

                return parseFloat(value);
            },
        },
        dateCommission: {
            path: ["Dossier", "Date Commission"],
            adapter: value => {
                if (!value) return value;

                const [day, month, year] = value.split("/").map(v => parseInt(v, 10));
                return new Date(Date.UTC(year, month - 1, day));
            },
        },
        exerciceDebut: {
            path: ["Dossier", "Exercice Début"],
            adapter: value => {
                if (!value) return value;
                return new Date(Date.UTC(parseInt(value), 0));
            },
        },
        etablissementSiege: {
            path: ["Association", "Siège"],
            adapter: value => value === "Oui",
        },
        etablissementVoie: ["Coordonnées correspondance (publipostage)", "Voie"],
        etablissementCodePostal: ["Coordonnées correspondance (publipostage)", "Code Postal"],
        etablissementCommune: ["Coordonnées correspondance (publipostage)", "Commune"],
        etablissementIBAN: ["Association", "IBAN"],
        etablissementBIC: ["Association", "BIC"],

        representantNom: ["Représentant légal", "Nom"],
        representantPrenom: ["Représentant légal", ["Prénom", "Prenom"]],
        representantRole: ["Représentant légal", "Fonction"],
        representantCivilite: ["Représentant légal", ["Civilité", "Civilite"]],
        representantEmail: ["Représentant légal", ["Courriel", "Adresse messagerie"]],
        representantPhone: ["Représentant légal", "N° Téléphone"],

        service_instructeur: ["Dossier", "Service"],
        dispositif: ["Dossier", "N° programme  / Type financement"],
        sous_dispositif: ["Dossier", "Sous-Type financement"],
        status: ["Dossier", ["Etat Dossier", "Etat dossier"]],
        pluriannualite: ["Dossier", "Pluriannualité"],

        montantsTotal: {
            path: ["Montants", "Coût (Total des Charges)"],
            adapter: value => (value ? parseFloat(value) : value),
        },
        montantsDemande: {
            path: ["Montants", "Demandé"],
            adapter: value => (value ? parseFloat(value) : value),
        },
        montantsPropose: {
            path: ["Montants", "Proposé"],
            adapter: value => (value ? parseFloat(value) : value),
        },
        montantsAccorde: {
            path: ["Montants", "Accordé"],
            adapter: value => (value ? parseFloat(value) : value),
        },

        versementAcompte: {
            path: ["Versements", "Acompte"],
            adapter: value => (value ? parseFloat(value) : value),
        },
        versementSolde: {
            path: ["Versements", "Solde"],
            adapter: value => (value ? parseFloat(value) : value),
        },
        versementRealise: {
            path: ["Versements", "Réalisé"],
            adapter: value => (value ? parseFloat(value) : value),
        },
        versementCompensationN1: {
            path: ["Versements", "Compensation N-1"],
            adapter: value => (value ? parseFloat(value) : value),
        },
        versementCompensationN: {
            path: ["Versements", "Reversement/Compensation"],
            adapter: value => (value ? parseFloat(value) : value),
        },
    };

    public static indexedLegalInformationsPath = {
        siret: [["Association", "Bénéficiaire"], "N° Siret"],
        rna: [["Association", "Bénéficiaire"], "N° RNA"],
        name: [["Association", "Bénéficiaire"], "Nom"],
    };

    public provider = "Osiris";

    public providerMatchingKeys: string[] = ["osirisId", "compteAssoId", "ej"];

    constructor(
        public legalInformations: ILegalInformations,
        public providerInformations: IOsirisRequestInformations,
        public data: unknown,
        public _id?: ObjectId,
        public actions?: OsirisActionEntity[],
    ) {
        super(legalInformations);
    }
}
