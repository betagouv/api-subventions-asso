import OsirisActionEntity from "../../../../modules/providers/osiris/entities/OsirisActionEntity";
import { sanitizeFloat } from "../../../../shared/helpers/NumberHelper";
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

type Formatter = (value: OsirisActionRawValue) => OsirisActionRawValue;
type FieldMap<T> = Readonly<Record<string, { dtoKey: keyof T & string; format?: Formatter }>>;

interface FieldMapping {
    dtoKey: string;
    format?: Formatter;
}
interface CategoryMapping {
    key: keyof OsirisActionDto;
    fields: Readonly<Record<string, FieldMapping>>;
}

const DOSSIER_FIELDS = {
    "Numero Action Osiris": { dtoKey: "numeroActionOsiris" },
    "N° Dossier Compte Asso": { dtoKey: "compteAssoId" },
    "Exercice budgetaire": { dtoKey: "exerciceBudgetaire" },
    "Exercice Budgetaire": { dtoKey: "exerciceBudgetaire" },
    "N° EJ": { dtoKey: "ej" },
} as const satisfies FieldMap<OsirisActionDossierDto>;

const BENEFICIAIRE_FIELDS = {
    "N° Siret": { dtoKey: "siret" },
} as const satisfies FieldMap<OsirisActionBeneficiaireDto>;

const FEDERATION_FIELDS = {
    Fédération: { dtoKey: "federation" },
    "Nombre licenciés": { dtoKey: "nombreLicencies", format: sanitizeFloat },
    "Nombre licenciés hommes": { dtoKey: "nombreLicenciesHommes", format: sanitizeFloat },
    "Nombre licenciées femmes": { dtoKey: "nombreLicenciesFemmes", format: sanitizeFloat },
} as const satisfies FieldMap<OsirisActionFederationDto>;

const MOYENS_FIELDS = {
    "Bénévoles Nombre": { dtoKey: "benevolesNombre", format: sanitizeFloat },
    "Bénévoles ETPT": { dtoKey: "benevolesETPT", format: sanitizeFloat },
    "Salariés Nombre": { dtoKey: "salariesNombre", format: sanitizeFloat },
    "Salariés ETPT": { dtoKey: "salariesETPT", format: sanitizeFloat },
    "Dont en CDI Nombre": { dtoKey: "salariesCDINombre", format: sanitizeFloat },
    "Dont en CDI ETPT": { dtoKey: "salariesCDIETPT", format: sanitizeFloat },
    "Dont en CDD Nombre": { dtoKey: "salariesCDDNombre", format: sanitizeFloat },
    "Dont en CDD ETPT": { dtoKey: "salariesCDDETPT", format: sanitizeFloat },
    "Dont emplois aidés Nombre": { dtoKey: "emploiesAidesNombre", format: sanitizeFloat },
    "Dont emplois aidés ETPT": { dtoKey: "emploiesAidesETPT", format: sanitizeFloat },
    "Volontaires Nombre": { dtoKey: "volontairesNombre", format: sanitizeFloat },
    "Volontaires ETPT": { dtoKey: "volontairesETPT", format: sanitizeFloat },
} as const satisfies FieldMap<OsirisActionMoyensDto>;

const TERRITOIRES_FIELDS = {
    Statut: { dtoKey: "statut" },
    Commentaire: { dtoKey: "commentaire" },
} as const satisfies FieldMap<OsirisActionTerritoiresDto>;

const CARACTERISTIQUES_FIELDS = {
    Rang: { dtoKey: "rang", format: sanitizeFloat },
    Intitulé: { dtoKey: "intitule" },
    Objectifs: { dtoKey: "objectifs" },
    "Objectifs opérationnels": { dtoKey: "objectifsOperationnels" },
    Description: { dtoKey: "description" },
    "Nature de l'aide": { dtoKey: "natureAide" },
    "Modalité de l'aide": { dtoKey: "modaliteAide" },
    "Modalité ou dispositif": { dtoKey: "modaliteOuDispositif" },
} as const satisfies FieldMap<OsirisActionCaracteristiquesDto>;

const EVALUATION_FIELDS = {
    Indicateurs: { dtoKey: "indicateurs" },
} as const satisfies FieldMap<OsirisActionEvaluationDto>;

const COFINANCEURS_FIELDS = {
    Noms: { dtoKey: "noms" },
    "Montants demandés": { dtoKey: "montantsDemandes", format: sanitizeFloat },
} as const satisfies FieldMap<OsirisActionCofinanceursDto>;

const MONTANTS_FIELDS = {
    "Coût (total charges)": { dtoKey: "coutTotalCharges", format: sanitizeFloat },
    Demandé: { dtoKey: "demande", format: sanitizeFloat },
    Proposé: { dtoKey: "propose", format: sanitizeFloat },
    Accordé: { dtoKey: "accorde", format: sanitizeFloat },
    "Montant Total Attribué": { dtoKey: "montantTotalAttribue", format: sanitizeFloat },
    Réalisé: { dtoKey: "realise", format: sanitizeFloat },
    Compensation: { dtoKey: "compensation", format: sanitizeFloat },
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

            const fields = mapping.fields as Record<string, FieldMapping>;
            const target = (dto[mapping.key] as OsirisActionRawCategory) || {};

            for (const [rawField, rawValue] of Object.entries(rawValues)) {
                const fieldConfig = fields[rawField];
                if (!fieldConfig) continue;

                const value: OsirisActionRawValue = typeof rawValue === "string" ? rawValue.trim() : rawValue;
                if (value === null || value === undefined || value === "") continue;

                const formattedValue = fieldConfig.format ? fieldConfig.format(value) : value;
                target[fieldConfig.dtoKey] = formattedValue as OsirisActionRawValue;
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
