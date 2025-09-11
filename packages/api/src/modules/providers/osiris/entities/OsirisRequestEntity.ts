import { ParserInfo, ParserPath } from "../../../../@types";
import LegalInformations from "../../../search/@types/LegalInformations";
import OsirisRequestInformations from "../@types/OsirisRequestInformations";
import { GenericParser } from "../../../../shared/GenericParser";
import OsirisActionEntity from "./OsirisActionEntity";
import { ProviderDataEntity } from "../../../../@types/ProviderDataEntity";

const dossier = ["Dossier/action", "Dossier"];

export default class OsirisRequestEntity implements ProviderDataEntity {
    public static defaultMainCategory = "Dossier";

    public static adaptsToNb = value => (value ? (typeof value === "number" ? value : parseFloat(value)) : value);

    public static indexedProviderInformationsPath: {
        [key: string]: ParserPath | ParserInfo<string | number>;
    } = {
        osirisId: [dossier, "N° Dossier Osiris"],
        exercise: { path: [dossier, "Exercice Budgetaire"] },
        compteAssoId: [dossier, "N° Dossier Compte Asso"],
        ej: [dossier, "N° EJ"],
        amountAwarded: {
            path: ["Montants", "Accordé"],
            adapter: value => {
                if (!value) return value;
                if (typeof value == "number") return value;
                return parseFloat(value);
            },
        },
        dateCommission: {
            path: [dossier, "Date Commission"],
            adapter: value => {
                if (!value) return value;
                if (typeof value == "number") return GenericParser.ExcelDateToJSDate(value);
                const [day, month, year] = value.split("/").map(v => parseInt(v, 10));
                return new Date(Date.UTC(year, month - 1, day));
            },
        },
        exerciceDebut: {
            path: [dossier, "Exercice Début"],
            adapter: value => {
                if (!value) return value;
                if (typeof value == "number") return value;
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

        service_instructeur: [dossier, "Service"],
        dispositif: [dossier, "N° programme  / Type financement"],
        sous_dispositif: [dossier, "Sous-Type financement"],
        status: [dossier, ["Etat Dossier", "Etat dossier"]],
        pluriannualite: [dossier, "Pluriannualité"],

        montantsTotal: {
            path: ["Montants", "Coût (Total des Charges)"],
            adapter: OsirisRequestEntity.adaptsToNb,
        },
        montantsDemande: {
            path: ["Montants", "Demandé"],
            adapter: OsirisRequestEntity.adaptsToNb,
        },
        montantsPropose: {
            path: ["Montants", "Proposé"],
            adapter: OsirisRequestEntity.adaptsToNb,
        },
        montantsAccorde: {
            path: ["Montants", "Accordé"],
            adapter: OsirisRequestEntity.adaptsToNb,
        },

        versementAcompte: {
            path: ["Versements", "Acompte"],
            adapter: OsirisRequestEntity.adaptsToNb,
        },
        versementSolde: {
            path: ["Versements", "Solde"],
            adapter: OsirisRequestEntity.adaptsToNb,
        },
        versementRealise: {
            path: ["Versements", "Réalisé"],
            adapter: OsirisRequestEntity.adaptsToNb,
        },
        versementCompensationN1: {
            path: ["Versements", "Compensation N-1"],
            adapter: OsirisRequestEntity.adaptsToNb,
        },
        versementCompensationN: {
            path: ["Versements", "Reversement/Compensation"],
            adapter: OsirisRequestEntity.adaptsToNb,
        },
    };

    public static indexedLegalInformationsPath = {
        siret: [["Association", "Bénéficiaire"], "N° Siret"],
        rna: [["Association", "Bénéficiaire"], "N° RNA"],
        name: [["Association", "Bénéficiaire"], "Nom"],
    };

    public provider = "Osiris";

    constructor(
        public legalInformations: LegalInformations,
        public providerInformations: OsirisRequestInformations,
        public data: unknown,
        public updateDate: Date,
        public actions?: OsirisActionEntity[],
    ) {
        this.providerInformations.uniqueId = `${this.providerInformations.osirisId}-${this.providerInformations.exercise}`;
    }
}
