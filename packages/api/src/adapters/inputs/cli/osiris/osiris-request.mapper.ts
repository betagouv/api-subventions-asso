import OsirisRequestEntity from "../../../../modules/providers/osiris/entities/OsirisRequestEntity";
import OsirisRequestDto, {
    OsirisRequestAssociationDto,
    OsirisRequestCoordonneesDto,
    OsirisRequestDossierDto,
    OsirisRequestMontantsDto,
    OsirisRequestNbActionsDto,
    OsirisRequestRawCategory,
    OsirisRequestRawData,
    OsirisRequestRawValue,
    OsirisRequestRepresentantLegalDto,
    OsirisRequestVersementsDto,
} from "./osiris-request.dto";
import { GenericParser } from "../../../../shared/GenericParser";

type FieldMap<T> = Readonly<Record<string, keyof T | FieldMapping>>;
type AdapterFunction = (value: OsirisRequestRawValue) => OsirisRequestRawValue;

interface FieldMapping {
    dtoKey: string;
    format?: AdapterFunction;
}

interface CategoryMapping {
    key: keyof OsirisRequestDto;
    fields: Readonly<Record<string, string | FieldMapping>>;
}

const toNumber = (value: OsirisRequestRawValue): number | null | undefined => {
    if (!value) return value as null | undefined;
    if (typeof value === "number") return value;
    const cleanValue = (value as string)
        .replace(/[^0-9.,-]/g, "") // remove non-numeric characters (except minus, dot, and comma)
        .replace(",", "."); // replace comma with dot
    const parsed = parseFloat(cleanValue);
    return isNaN(parsed) ? undefined : parsed; // return undefined for invalid numbers instead of NaN
};

const toBoolean = (value: OsirisRequestRawValue): boolean | null | undefined => {
    if (!value) return value as null | undefined;
    return value === "Oui";
};

const toDate = (value: OsirisRequestRawValue): Date | null | undefined => {
    if (!value) return value as null | undefined;
    if (typeof value === "number") return GenericParser.ExcelDateToJSDate(value);
    if (value instanceof Date) return value;
    const [day, month, year] = (value as string).split("/").map(v => parseInt(v, 10));
    return new Date(Date.UTC(year, month - 1, day));
};

const toYearDate = (value: OsirisRequestRawValue): Date | number | null | undefined => {
    if (!value) return value as null | undefined;
    if (typeof value === "number") return value;
    return new Date(Date.UTC(parseInt(value as string), 0));
};

const DOSSIER_FIELDS = {
    "N° Dossier Osiris": "osirisId",
    "N° Dossier Compte Asso": "compteAssoId",
    "N° EJ": "ej",
    "Date Reception": "dateReception",
    "Date Commission": { dtoKey: "dateCommission", format: toDate },
    "Exercice Budgetaire": "exerciceBudgetaire",
    "Exercice Début": { dtoKey: "exerciceDebut", format: toYearDate },
    "Exercice Debut": { dtoKey: "exerciceDebut", format: toYearDate },
    "Exercice Fin": "exerciceFin",
    "Etat Dossier": "etatDossier",
    "Etat dossier": "etatDossier",
    Service: "service",
    "N° programme  / Type financement": "noProgrammeTypeFinancement",
    "N° Programme Type Financement": "noProgrammeTypeFinancement",
    "Sous-Type financement": "sousTypeFinancement",
    "Sous Type Financement": "sousTypeFinancement",
    Pluriannualité: "pluriannualite",
    Pluriannualite: "pluriannualite",
} as const satisfies FieldMap<OsirisRequestDossierDto>;

const ASSOCIATION_FIELDS = {
    "N° RNA": "rna",
    "N° Siret": "siret",
    Nom: "nom",
    Siège: { dtoKey: "siege", format: toBoolean }, // -> siege
    Siege: { dtoKey: "siege", format: toBoolean }, // -> siege
    IBAN: "iban",
    BIC: "bic",
} as const satisfies FieldMap<OsirisRequestAssociationDto>;

const COORDONNEES_FIELDS = {
    Voie: "voie",
    "Code Postal": "codePostal",
    Commune: "commune",
} as const satisfies FieldMap<OsirisRequestCoordonneesDto>;

const REPRESENTANT_LEGAL_FIELDS = {
    Nom: "nom",
    Prénom: "prenom", // -> prenom
    Prenom: "prenom", // -> prenom
    Civilité: "civilite", // -> civilite
    Civilite: "civilite", // -> civilite
    Fonction: "fonction",
    Courriel: "courriel", // -> courriel
    "Adresse Messagerie": "courriel", // -> courriel
    "Adresse messagerie": "courriel", // -> courriel
    Téléphone: "telephone", // -> telephone
    "N° Téléphone": "telephone", // -> telephone
} as const satisfies FieldMap<OsirisRequestRepresentantLegalDto>;

const MONTANTS_FIELDS = {
    "Coût (Total des Charges)": { dtoKey: "coutTotalDesCharges", format: toNumber }, // -> coutTotalDesCharges
    "Coût Total des Charges": { dtoKey: "coutTotalDesCharges", format: toNumber }, // -> coutTotalDesCharges
    "Coût Total Charges": { dtoKey: "coutTotalDesCharges", format: toNumber }, // -> coutTotalDesCharges
    Demandé: { dtoKey: "demande", format: toNumber },
    Proposé: { dtoKey: "propose", format: toNumber },
    Accordé: { dtoKey: "accorde", format: toNumber },
} as const satisfies FieldMap<OsirisRequestMontantsDto>;

const VERSEMENTS_FIELDS = {
    Acompte: { dtoKey: "acompte", format: toNumber },
    Solde: { dtoKey: "solde", format: toNumber },
    Réalisé: { dtoKey: "realise", format: toNumber },
    "Compensation N-1": { dtoKey: "compensationN1", format: toNumber },
    "Reversement/Compensation": { dtoKey: "reversementCompensation", format: toNumber }, // -> reversementCompensation
    "Reversement Compensation": { dtoKey: "reversementCompensation", format: toNumber }, // -> reversementCompensation
} as const satisfies FieldMap<OsirisRequestVersementsDto>;

const NB_ACTIONS_FIELDS = {
    "Nombre Actions": { dtoKey: "nombreActions", format: toNumber },
} as const satisfies FieldMap<OsirisRequestNbActionsDto>;

export const CATEGORY_MAPPING = {
    Dossier: { key: "dossier", fields: DOSSIER_FIELDS }, // -> dossier
    "Dossier/action": { key: "dossier", fields: DOSSIER_FIELDS }, // -> dossier
    Bénéficiaire: { key: "association", fields: ASSOCIATION_FIELDS }, // -> association
    Association: { key: "association", fields: ASSOCIATION_FIELDS }, // -> association
    "Coordonnées correspondance (publipostage)": { key: "coordonnees", fields: COORDONNEES_FIELDS },
    "Représentant légal": { key: "representantLegal", fields: REPRESENTANT_LEGAL_FIELDS },
    Montants: { key: "montants", fields: MONTANTS_FIELDS },
    Versements: { key: "versements", fields: VERSEMENTS_FIELDS },
    "Nb Actions": { key: "nbActions", fields: NB_ACTIONS_FIELDS },
} as const satisfies Record<string, CategoryMapping>;

export default class OsirisRequestMapper {
    static toDto(raw: OsirisRequestRawData): OsirisRequestDto {
        const dto: Record<string, OsirisRequestRawCategory> = {};

        for (const [rawCategory, rawValues] of Object.entries(raw)) {
            const mapping = (CATEGORY_MAPPING as Record<string, CategoryMapping>)[rawCategory];
            if (!mapping || !rawValues) continue;

            const fields = mapping.fields as Record<string, string | FieldMapping>;
            const target = (dto[mapping.key] as OsirisRequestRawCategory) || {};

            for (const [rawField, value] of Object.entries(rawValues)) {
                const fieldConfig = fields[rawField];
                if (!fieldConfig) continue;
                if (value === null || value === undefined || value === "") continue;

                // Handle both string and FieldMapping formats
                if (typeof fieldConfig === "string") {
                    target[fieldConfig] = value as OsirisRequestRawValue;
                } else {
                    const formattedValue = fieldConfig.format ? fieldConfig.format(value) : value;
                    target[fieldConfig.dtoKey] = formattedValue as OsirisRequestRawValue;
                }
            }

            dto[mapping.key] = target;
        }

        return dto as OsirisRequestDto;
    }

    static toEntity(dto: OsirisRequestDto, exerciceBudgetaire: number): OsirisRequestEntity {
        return {
            dossier: { ...(dto.dossier || {}), exerciceBudgetaire },
            ...(dto.association && { association: dto.association }),
            ...(dto.coordonnees && { coordonnees: dto.coordonnees }),
            ...(dto.representantLegal && { representantLegal: dto.representantLegal }),
            ...(dto.montants && { montants: dto.montants }),
            ...(dto.versements && { versements: dto.versements }),
            ...(dto.nbActions && { nbActions: dto.nbActions }),
            updateDate: new Date(),
        } as OsirisRequestEntity;
    }
}
