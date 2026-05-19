import {
    ApplicationStatus,
    AssociationWithProviderValues,
    EstablishmentWithProviderValues,
    RnaDto,
    ApplicationNature,
} from "dto";
import ProviderValueFactory from "../../../shared/ProviderValueFactory";
import OsirisActionEntity from "./entities/OsirisActionEntity";
import OsirisRequestEntity from "./entities/OsirisRequestEntity";
import { toStatusFactory } from "../providers.mapper";
import { ApplicationFlatEntity } from "../../../entities/flats/ApplicationFlatEntity";
import Siret from "../../../identifier-objects/Siret";
import Ridet from "../../../identifier-objects/Ridet";
import { CompanyIdType, EstablishmentIdType } from "../../../identifier-objects/@types/IdentifierType";
import { sanitizeFloat } from "../../../shared/helpers/NumberHelper";
import { cleanRidet, getAssoIdType, getCofinancers, getPluriannualYears, toOsirisDate } from "./osiris.helper";

export default class OsirisMapper {
    static PROVIDER_NAME = "Osiris";

    private static _statusConversionArray: { label: ApplicationStatus; providerStatusList: string[] }[] = [
        { label: ApplicationStatus.REFUSED, providerStatusList: ["Refusé"] },
        {
            label: ApplicationStatus.GRANTED,
            providerStatusList: ["Traitement Sirepa", "Traitement Chorus", "Terminé", "A évaluer"],
        },
        { label: ApplicationStatus.INELIGIBLE, providerStatusList: ["Rejeté", "Supprimé"] },
        {
            label: ApplicationStatus.PENDING,
            providerStatusList: [
                "Edition document",
                "Renvoyé au compte asso",
                "En cours d'instruction",
                "En attente superviseur",
                "En attente décision",
            ],
        },
    ];

    private static readonly toStatus = toStatusFactory(OsirisMapper._statusConversionArray);

    static toAssociation(
        entity: OsirisRequestEntity,
        actions: OsirisActionEntity[] = [],
    ): AssociationWithProviderValues {
        const association = entity.association || {};
        const siret = association.siret as string;
        const rna = association.rna as string;
        const nom = association.nom as string;
        const exercise = entity.dossier.exerciceBudgetaire;
        const dataDate = new Date(Date.UTC(exercise, 0));
        const toPVs = ProviderValueFactory.buildProviderValuesMapper(OsirisMapper.PROVIDER_NAME, dataDate);
        const isSiege = association.siege === "Oui" || association.siege === true;
        const federation =
            actions.length && actions.find(action => action.federation?.federation)?.federation?.federation;
        const licencies =
            actions.length && actions.find(action => action.federation?.federation)?.federation?.nombreLicencies;
        const licenciesHommes =
            actions.length && actions.find(action => action.federation?.federation)?.federation?.nombreLicenciesHommes;
        const licenciesFemmes =
            actions.length && actions.find(action => action.federation?.federation)?.federation?.nombreLicenciesFemmes;

        return {
            siren: toPVs(Siret.getSiren(siret)),
            rna: rna == undefined ? undefined : toPVs(rna as RnaDto),
            denomination_rna: toPVs(nom),
            etablisements_siret: toPVs([siret]),
            nic_siege: isSiege ? toPVs(Siret.getNic(siret)) : undefined,
            federation: federation ? toPVs(federation) : undefined,
            licencies:
                licencies && licenciesHommes && licenciesFemmes
                    ? {
                          total: toPVs(licencies),
                          hommes: toPVs(licenciesHommes),
                          femmes: toPVs(licenciesFemmes),
                      }
                    : undefined,
            ...(actions.length && actions[0].moyens
                ? {
                      benevoles: {
                          nombre: toPVs(actions[0].moyens.benevolesNombre),
                          ETPT: toPVs(actions[0].moyens.benevolesETPT),
                      },
                      salaries: {
                          nombre: toPVs(actions[0].moyens.salariesNombre),
                          cdi: toPVs(actions[0].moyens.salariesCDINombre),
                          cdiETPT: toPVs(actions[0].moyens.salariesCDIETPT),
                          cdd: toPVs(actions[0].moyens.salariesCDDNombre),
                          cddETPT: toPVs(actions[0].moyens.salariesCDDETPT),
                          emploisAides: toPVs(actions[0].moyens.emploiesAidesNombre),
                          emploisAidesETPT: toPVs(actions[0].moyens.emploiesAidesETPT),
                      },
                      volontaires: {
                          nombre: toPVs(actions[0].moyens.volontairesNombre),
                          ETPT: toPVs(actions[0].moyens.volontairesETPT),
                      },
                  }
                : {}),
        };
    }

    static toEstablishment(entity: OsirisRequestEntity): EstablishmentWithProviderValues {
        const association = entity.association || {};
        const coordonnees = entity.coordonnees || {};
        const representantLegal = entity.representantLegal || {};
        const siret = association.siret as string;
        const isSiege = association.siege === "Oui" || association.siege === true;
        const exercise = entity.dossier.exerciceBudgetaire;
        const dataDate = new Date(Date.UTC(exercise, 0));
        const toPVs = ProviderValueFactory.buildProviderValuesMapper(OsirisMapper.PROVIDER_NAME, dataDate);

        const representant = {
            nom: representantLegal.nom as string,
            prenom: representantLegal.prenom as string,
            civilite: representantLegal.civilite as string,
            role: representantLegal.fonction as string,
            telephone: representantLegal.telephone as string,
            email: representantLegal.courriel as string,
        };

        return {
            siret: toPVs(siret),
            nic: toPVs(Siret.getNic(siret)),
            siege: toPVs(isSiege),
            adresse: toPVs({
                voie: coordonnees.voie as string,
                code_postal: coordonnees.codePostal as string,
                commune: coordonnees.commune as string,
            }),
            representants_legaux: [toPVs(representant)],
            contacts: [toPVs(representant)],
            information_banquaire:
                association.bic && association.iban
                    ? [
                          toPVs({
                              bic: association.bic as string,
                              iban: association.iban as string,
                          }),
                      ]
                    : [],
        };
    }

    static toApplicationFlat(entity: OsirisRequestEntity, actions: OsirisActionEntity[]): ApplicationFlatEntity {
        const association = entity.association || {};
        const dossier = entity.dossier;
        const montants = entity.montants || {};
        const siret = association.siret as string;
        const provider = this.PROVIDER_NAME.toLowerCase();
        const budgetaryYear = dossier.exerciceBudgetaire;
        const applicationProviderId = dossier.osirisId;
        const applicationId = `${provider}-${applicationProviderId}`;
        const uniqueId = `${applicationId}-${budgetaryYear}`;
        const estabIdType = getAssoIdType(siret);

        let assoId: CompanyIdType, estabId: EstablishmentIdType;

        if (estabIdType === Siret.getName()) {
            estabId = new Siret(siret);
            assoId = estabId.toSiren();
        } else {
            estabId = new Ridet(cleanRidet(siret));
            assoId = estabId.toRid();
        }

        const assoIdType = assoId.name;
        const depositDate = toOsirisDate(dossier.dateReception) as Date;

        let ej: unknown = dossier.ej;
        let paymentId: string | null;

        if (!ej) {
            ej = null;
            paymentId = null;
        } else {
            paymentId = `${estabId}-${ej}-${budgetaryYear}`;
        }

        const cofinancersNames = getCofinancers(actions);

        return {
            uniqueId,
            applicationId,
            applicationProviderId,
            provider,
            joinKeyId: dossier.compteAssoId,
            joinKeyDesc: `N° dossier de l'outil "Le Compte Asso". Il permet de faire un lien entre la requête OSIRIS et le dossier du Compte Asso.`,
            allocatorName: null,
            allocatorIdType: null,
            allocatorId: null,
            managingAuthorityName: null,
            managingAuthorityId: null,
            managingAuthorityIdType: null,
            instructiveDepartmentName: dossier.service,
            instructiveDepartmentIdType: null,
            instructiveDepartementId: null,
            beneficiaryEstablishmentId: estabId,
            beneficiaryEstablishmentIdType: estabIdType,
            beneficiaryCompanyId: assoId,
            beneficiaryCompanyIdType: assoIdType,
            budgetaryYear,
            pluriannual: dossier.pluriannualite === "Pluriannuel",
            pluriannualYears: getPluriannualYears(entity),
            decisionDate: toOsirisDate(dossier.dateCommission) as Date | null,
            conventionDate: null,
            decisionReference: null,
            depositDate,
            requestYear: depositDate.getFullYear(),
            scheme: dossier.noProgrammeTypeFinancement,
            subScheme: dossier.sousTypeFinancement,
            statusLabel: this.toStatus(dossier.etatDossier as string),
            object: actions.map(action => action.caracteristiques?.intitule).join("|"),
            nature: ApplicationNature.MONEY,
            requestedAmount: sanitizeFloat(montants.demande),
            grantedAmount: sanitizeFloat(montants.accorde),
            totalAmount: null,
            ej,
            paymentId,
            paymentCondition: null,
            paymentConditionDesc: null,
            paymentPeriodDates: null,
            cofinancersNames: cofinancersNames,
            cofinancingRequested: cofinancersNames.length > 0,
            cofinancersIdType: null,
            confinancersId: null,
            idRAE: null,
            ueNotification: null,
            subventionPercentage: null,
            updateDate: entity.updateDate,
        } as ApplicationFlatEntity;
    }
}
