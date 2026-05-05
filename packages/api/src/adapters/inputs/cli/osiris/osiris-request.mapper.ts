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

type FieldMap<T> = Readonly<Record<string, keyof T>>;

const DOSSIER_FIELDS = {
    "N° Dossier Osiris": "osirisId",
    "N° Dossier Compte Asso": "compteAssoId",
    "N° EJ": "ej",
    "Date Reception": "dateReception",
    "Date Commission": "dateCommission",
    "Exercice Debut": "exerciceDebut",
    "Exercice Fin": "exerciceFin",
    "Etat Dossier": "etatDossier",
    Service: "service",
    "N° Programme Type Financement": "noProgrammeTypeFinancement",
    "Sous Type Financement": "sousTypeFinancement",
    Pluriannualite: "pluriannualite",
} as const satisfies FieldMap<OsirisRequestDossierDto>;

const ASSOCIATION_FIELDS = {
    "N° RNA": "rna",
    "N° Siret": "siret",
    Nom: "nom",
    Siege: "siege",
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
    Prénom: "prenom",
    Civilité: "civilite",
    Fonction: "fonction",
    Courriel: "courriel",
    "Adresse Messagerie": "adresseMessagerie",
    Téléphone: "telephone",
    "N° Téléphone": "noTelephone",
} as const satisfies FieldMap<OsirisRequestRepresentantLegalDto>;

const MONTANTS_FIELDS = {
    "Coût Total des Charges": "coutTotalDesCharges",
    "Coût Total Charges": "coutTotalCharges",
    Demandé: "demande",
    Proposé: "propose",
    Accordé: "accorde",
} as const satisfies FieldMap<OsirisRequestMontantsDto>;

const VERSEMENTS_FIELDS = {
    Acompte: "acompte",
    Solde: "solde",
    Réalisé: "realise",
    "Compensation N-1": "compensationN1",
    "Reversement Compensation": "reversementCompensation",
} as const satisfies FieldMap<OsirisRequestVersementsDto>;

const NB_ACTIONS_FIELDS = {
    "Nombre Actions": "nombreActions",
} as const satisfies FieldMap<OsirisRequestNbActionsDto>;

interface CategoryMapping {
    key: keyof OsirisRequestDto;
    fields: Readonly<Record<string, string>>;
}

export const CATEGORY_MAPPING = {
    Dossier: { key: "dossier", fields: DOSSIER_FIELDS },
    "Dossier/action": { key: "dossier", fields: DOSSIER_FIELDS },
    Bénéficiaire: { key: "association", fields: ASSOCIATION_FIELDS },
    Association: { key: "association", fields: ASSOCIATION_FIELDS },
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

            const fields = mapping.fields as Record<string, string>;
            const target = (dto[mapping.key] as OsirisRequestRawCategory) || {};

            for (const [rawField, value] of Object.entries(rawValues)) {
                const dtoField = fields[rawField];
                if (!dtoField) continue;
                target[dtoField] = value as OsirisRequestRawValue;
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
