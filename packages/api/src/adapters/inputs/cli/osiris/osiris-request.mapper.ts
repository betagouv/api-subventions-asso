import OsirisRequestEntity from "../../../../modules/providers/osiris/entities/OsirisRequestEntity";
import { GenericParser } from "../../../../shared/GenericParser";
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

type Formatter = (value: OsirisRequestRawValue) => OsirisRequestRawValue;
type FieldMap<T> = Readonly<Record<string, { dtoKey: keyof T & string; format?: Formatter }>>;

interface FieldMapping {
    dtoKey: string;
    format?: Formatter;
}
interface CategoryMapping {
    key: keyof OsirisRequestDto;
    fields: Readonly<Record<string, FieldMapping>>;
}

// Todo : move / refactor formatters to helpers

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
    "N° Dossier Osiris": { dtoKey: "osirisId" },
    "N° Dossier Compte Asso": { dtoKey: "compteAssoId" },
    "N° EJ": { dtoKey: "ej" },
    "Date Reception": { dtoKey: "dateReception" },
    "Date Commission": { dtoKey: "dateCommission", format: toDate },
    "Exercice Budgetaire": { dtoKey: "exerciceBudgetaire" },
    "Exercice Début": { dtoKey: "exerciceDebut", format: toYearDate },
    "Exercice Debut": { dtoKey: "exerciceDebut", format: toYearDate },
    "Exercice Fin": { dtoKey: "exerciceFin" },
    "Etat Dossier": { dtoKey: "etatDossier" },
    "Etat dossier": { dtoKey: "etatDossier" },
    Service: { dtoKey: "service" },
    "N° programme  / Type financement": { dtoKey: "noProgrammeTypeFinancement" },
    "N° Programme Type Financement": { dtoKey: "noProgrammeTypeFinancement" },
    "Sous-Type financement": { dtoKey: "sousTypeFinancement" },
    "Sous Type Financement": { dtoKey: "sousTypeFinancement" },
    Pluriannualité: { dtoKey: "pluriannualite" },
    Pluriannualite: { dtoKey: "pluriannualite" },
} as const satisfies FieldMap<OsirisRequestDossierDto>;

const ASSOCIATION_FIELDS = {
    "N° RNA": { dtoKey: "rna" },
    "N° Siret": { dtoKey: "siret" },
    Nom: { dtoKey: "nom" },
    Siège: { dtoKey: "siege", format: toBoolean },
    Siege: { dtoKey: "siege", format: toBoolean },
    IBAN: { dtoKey: "iban" },
    BIC: { dtoKey: "bic" },
} as const satisfies FieldMap<OsirisRequestAssociationDto>;

const COORDONNEES_FIELDS = {
    Voie: { dtoKey: "voie" },
    "Code Postal": { dtoKey: "codePostal" },
    Commune: { dtoKey: "commune" },
} as const satisfies FieldMap<OsirisRequestCoordonneesDto>;

const REPRESENTANT_LEGAL_FIELDS = {
    Nom: { dtoKey: "nom" },
    Prénom: { dtoKey: "prenom" },
    Prenom: { dtoKey: "prenom" },
    Civilité: { dtoKey: "civilite" },
    Civilite: { dtoKey: "civilite" },
    Fonction: { dtoKey: "fonction" },
    Courriel: { dtoKey: "courriel" },
    "Adresse Messagerie": { dtoKey: "courriel" },
    "Adresse messagerie": { dtoKey: "courriel" },
    Téléphone: { dtoKey: "telephone" },
    "N° Téléphone": { dtoKey: "telephone" },
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

            const fields = mapping.fields as Record<string, FieldMapping>;
            const target = (dto[mapping.key] as OsirisRequestRawCategory) || {};

            for (const [rawField, value] of Object.entries(rawValues)) {
                const fieldConfig = fields[rawField];
                if (!fieldConfig) continue;
                if (value === null || value === undefined || value === "") continue;

                const formattedValue = fieldConfig.format ? fieldConfig.format(value) : value;
                target[fieldConfig.dtoKey] = formattedValue as OsirisRequestRawValue;
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
