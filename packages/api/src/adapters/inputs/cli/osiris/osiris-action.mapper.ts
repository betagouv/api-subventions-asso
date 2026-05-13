import OsirisActionEntity from "../../../../modules/providers/osiris/entities/OsirisActionEntity";
import OsirisActionDto, {
    OsirisActionBeneficiaireDto,
    OsirisActionCaracteristiquesDto,
    OsirisActionCofinanceursDto,
    OsirisActionDossierDto,
    OsirisActionEvaluationDto,
    OsirisActionFederationDto,
    OsirisActionMontantsDto,
    OsirisActionMoyensDto,
    OsirisActionRawCategory,
    OsirisActionRawData,
    OsirisActionRawValue,
    OsirisActionTerritoiresDto,
} from "./osiris-action.dto";

type FieldMap<T> = Readonly<Record<string, keyof T | FieldMapping>>;
type AdapterFunction = (value: OsirisActionRawValue) => OsirisActionRawValue;

interface FieldMapping {
    dtoKey: string;
    format?: AdapterFunction;
}

interface CategoryMapping {
    key: keyof OsirisActionDto;
    fields: Readonly<Record<string, string | FieldMapping>>;
}

const toNumber = (value: OsirisActionRawValue): number | null | undefined => {
    if (!value) return value as null | undefined;
    if (typeof value === "number") return value;
    const cleanValue = (value as string).replace(/[^0-9.,-]/g, "").replace(",", ".");
    const parsed = parseFloat(cleanValue);
    return isNaN(parsed) ? undefined : parsed;
};

const DOSSIER_FIELDS = {
    "Numero Action Osiris": "numeroActionOsiris",
    "N° Dossier Compte Asso": "compteAssoId",
    "Exercice budgetaire": "exerciceBudgetaire",
    "Exercice Budgetaire": "exerciceBudgetaire",
    "N° EJ": "ej",
} as const satisfies FieldMap<OsirisActionDossierDto>;

const BENEFICIAIRE_FIELDS = {
    "N° Siret": "siret",
} as const satisfies FieldMap<OsirisActionBeneficiaireDto>;

const FEDERATION_FIELDS = {
    Fédération: "federation",
    "Nombre licenciés": { dtoKey: "nombreLicencies", format: toNumber },
    "Nombre licenciés hommes": { dtoKey: "nombreLicenciesHommes", format: toNumber },
    "Nombre licenciées femmes": { dtoKey: "nombreLicenciesFemmes", format: toNumber },
} as const satisfies FieldMap<OsirisActionFederationDto>;

const MOYENS_FIELDS = {
    "Bénévoles Nombre": { dtoKey: "benevolesNombre", format: toNumber },
    "Bénévoles ETPT": { dtoKey: "benevolesETPT", format: toNumber },
    "Salariés Nombre": { dtoKey: "salariesNombre", format: toNumber },
    "Salariés ETPT": { dtoKey: "salariesETPT", format: toNumber },
    "Dont en CDI Nombre": { dtoKey: "salariesCDINombre", format: toNumber },
    "Dont en CDI ETPT": { dtoKey: "salariesCDIETPT", format: toNumber },
    "Dont en CDD Nombre": { dtoKey: "salariesCDDNombre", format: toNumber },
    "Dont en CDD ETPT": { dtoKey: "salariesCDDETPT", format: toNumber },
    "Dont emplois aidés Nombre": { dtoKey: "emploiesAidesNombre", format: toNumber },
    "Dont emplois aidés ETPT": { dtoKey: "emploiesAidesETPT", format: toNumber },
    "Volontaires Nombre": { dtoKey: "volontairesNombre", format: toNumber },
    "Volontaires ETPT": { dtoKey: "volontairesETPT", format: toNumber },
} as const satisfies FieldMap<OsirisActionMoyensDto>;

const TERRITOIRES_FIELDS = {
    Statut: "statut",
    Commentaire: "commentaire",
} as const satisfies FieldMap<OsirisActionTerritoiresDto>;

const CARACTERISTIQUES_FIELDS = {
    Rang: { dtoKey: "rang", format: toNumber },
    Intitulé: "intitule",
    Objectifs: "objectifs",
    "Objectifs opérationnels": "objectifsOperationnels",
    Description: "description",
    "Nature de l'aide": "natureAide",
    "Modalité de l'aide": "modaliteAide",
    "Modalité ou dispositif": "modaliteOuDispositif",
} as const satisfies FieldMap<OsirisActionCaracteristiquesDto>;

const EVALUATION_FIELDS = {
    Indicateurs: "indicateurs",
} as const satisfies FieldMap<OsirisActionEvaluationDto>;

const COFINANCEURS_FIELDS = {
    Noms: "noms",
    "Montants demandés": { dtoKey: "montantsDemandes", format: toNumber },
} as const satisfies FieldMap<OsirisActionCofinanceursDto>;

const MONTANTS_FIELDS = {
    "Coût (total charges)": { dtoKey: "coutTotalCharges", format: toNumber },
    Demandé: { dtoKey: "demande", format: toNumber },
    Proposé: { dtoKey: "propose", format: toNumber },
    Accordé: { dtoKey: "accorde", format: toNumber },
    "Montant Total Attribué": { dtoKey: "montantTotalAttribue", format: toNumber },
    Réalisé: { dtoKey: "realise", format: toNumber },
    Compensation: { dtoKey: "compensation", format: toNumber },
} as const satisfies FieldMap<OsirisActionMontantsDto>;

export const CATEGORY_MAPPING = {
    "Dossier/action": { key: "dossier", fields: DOSSIER_FIELDS },
    Dossier: { key: "dossier", fields: DOSSIER_FIELDS },
    Bénéficiaire: { key: "beneficiaire", fields: BENEFICIAIRE_FIELDS },
    "Fédération d'affiliation": { key: "federation", fields: FEDERATION_FIELDS },
    "Moyens matériels et humains": { key: "moyens", fields: MOYENS_FIELDS },
    Territoires: { key: "territoires", fields: TERRITOIRES_FIELDS },
    "Caractéristiques actions": { key: "caracteristiques", fields: CARACTERISTIQUES_FIELDS },
    Evaluation: { key: "evaluation", fields: EVALUATION_FIELDS },
    Cofinanceurs: { key: "cofinanceurs", fields: COFINANCEURS_FIELDS },
    "Montants et versements": { key: "montants", fields: MONTANTS_FIELDS },
} as const satisfies Record<string, CategoryMapping>;

export default class OsirisActionMapper {
    static toDto(raw: OsirisActionRawData): OsirisActionDto {
        const dto: Record<string, OsirisActionRawCategory> = {};

        for (const [rawCategory, rawValues] of Object.entries(raw)) {
            const mapping = (CATEGORY_MAPPING as Record<string, CategoryMapping>)[rawCategory];
            if (!mapping || !rawValues) continue;

            const fields = mapping.fields as Record<string, string | FieldMapping>;
            const target = (dto[mapping.key] as OsirisActionRawCategory) || {};

            for (const [rawField, rawValue] of Object.entries(rawValues)) {
                const fieldConfig = fields[rawField];
                if (!fieldConfig) continue;

                const value: OsirisActionRawValue = typeof rawValue === "string" ? rawValue.trim() : rawValue;
                if (value === null || value === undefined || value === "") continue;

                if (typeof fieldConfig === "string") {
                    target[fieldConfig] = value as OsirisActionRawValue;
                } else {
                    const formattedValue = fieldConfig.format ? fieldConfig.format(value) : value;
                    target[fieldConfig.dtoKey] = formattedValue as OsirisActionRawValue;
                }
            }

            dto[mapping.key] = target;
        }

        return dto as OsirisActionDto;
    }

    static toEntity(dto: OsirisActionDto, year: number): OsirisActionEntity {
        const dossier = dto.dossier || {};
        const osirisActionId = dossier.numeroActionOsiris;
        const exercise = year;

        const uniqueId = `${osirisActionId}-${exercise}`;
        const requestId = osirisActionId?.match(/^(.+)-\d+$/)?.[1];
        const requestUniqueId = `${requestId ?? osirisActionId}-${exercise}`;

        if (!requestId) {
            console.error(
                `l'identifiant osirisActionId ${osirisActionId} est mal formé. On ne peut pas en déduire l'identifiant du dossier. Nous prenons l'osirisActionId tel quel mais c'est un problème`,
            );
        }

        return {
            dossier: {
                osirisActionId,
                uniqueId,
                requestUniqueId,
                compteAssoId: dossier.compteAssoId || "",
                exerciceBudgetaire: exercise,
                ej: dossier.ej,
            },
            ...(dto.beneficiaire && { beneficiaire: dto.beneficiaire }),
            ...(dto.federation && { federation: dto.federation }),
            ...(dto.moyens && { moyens: dto.moyens }),
            ...(dto.territoires && { territoires: dto.territoires }),
            ...(dto.caracteristiques && { caracteristiques: dto.caracteristiques }),
            ...(dto.evaluation && { evaluation: dto.evaluation }),
            ...(dto.cofinanceurs && { cofinanceurs: dto.cofinanceurs }),
            ...(dto.montants && { montants: dto.montants }),
            updateDate: new Date(),
        } as OsirisActionEntity;
    }
}
