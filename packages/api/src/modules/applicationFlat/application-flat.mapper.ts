import { ApplicationFlatDto, DemandeSubvention } from "dto";
import { ApplicationFlatEntity } from "../../entities/flats/ApplicationFlatEntity";
import { RawApplication } from "../grant/@types/rawGrant";
import ProviderValueMapper from "../../shared/mappers/provider-value.mapper";
import applicationFlatService from "./applicationFlat.service";
import { ApplicationFlatDbo } from "../../dataProviders/db/applicationFlat/ApplicationFlatDbo";
import { GenericAdapter } from "../../shared/GenericAdapter";
import EstablishmentIdentifier from "../../identifierObjects/EstablishmentIdentifier";
import Siret from "../../identifierObjects/Siret";
import Ridet from "../../identifierObjects/Ridet";
import Tahitiet from "../../identifierObjects/Tahitiet";

// entities and draft are almost equal but we want ids to be built in constructor
// and we want to be able to build with a properly types object
type ApplicationFlatEntityDraft = Omit<ApplicationFlatEntity, "uniqueId" | "applicationId">;

const OVERALL_FUNCTIONING_ACTION = "Fonctionnement global";

export default class ApplicationFlatMapper {
    public static rawToApplication(rawApplication: RawApplication) {
        return this.toDemandeSubvention(rawApplication.data);
    }

    public static buildEntity(draft: ApplicationFlatEntityDraft): ApplicationFlatEntity {
        return {
            ...draft,
            applicationId: `${draft.provider}--${draft.applicationProviderId}`,
            uniqueId: `${draft.provider}--${draft.applicationProviderId}--${draft.budgetaryYear}`,
        };
    }

    public static toDemandeSubvention(entity: ApplicationFlatEntity): DemandeSubvention | null {
        const siret = applicationFlatService.getSiret(entity);
        if (!siret) return null;

        const toPv = <T>(value: T) => ProviderValueMapper.toProviderValue<T>(value, entity.provider, entity.updateDate);

        const toPvOrUndefined = value => (value ? toPv(value) : undefined);

        /* Pour l'instant on garde ej pour tous les providers sauf Fonjep qui prend idVersement 
        Il faudra convertir tous les versementKey en idVersement quand tout est connecté  */
        return {
            annee_demande: toPvOrUndefined(entity.budgetaryYear),
            date_commision: toPvOrUndefined(entity.decisionDate), // TODO surely not good
            pluriannualite: toPvOrUndefined(entity.pluriannual),
            service_instructeur: toPv(entity.instructiveDepartmentName || ""),
            siret: toPv(siret.value),
            sous_dispositif: toPvOrUndefined(entity.subScheme),
            status: toPv(entity.statusLabel || ""),
            statut_label: toPv(entity.statusLabel),
            transmis_le: toPvOrUndefined(entity.depositDate),
            versementKey: toPvOrUndefined(entity.paymentId),
            ej: toPvOrUndefined(entity.ej),
            creer_le: toPvOrUndefined(entity.depositDate),
            dispositif: toPvOrUndefined(entity.scheme),
            montants: {
                total: toPvOrUndefined(entity.totalAmount),
                demande: toPvOrUndefined(entity.requestedAmount),
                accorde: toPvOrUndefined(entity.grantedAmount),
            },
            financeur_principal: toPvOrUndefined(entity.allocatorName),
            actions_proposee:
                entity.object === OVERALL_FUNCTIONING_ACTION || entity.object == undefined
                    ? undefined
                    : [{ intitule: toPv(entity.object) }],
            co_financement: {
                cofinanceur: toPv(
                    entity.cofinancersNames === GenericAdapter.NOT_APPLICABLE_VALUE
                        ? GenericAdapter.NOT_APPLICABLE_VALUE
                        : entity.cofinancersNames?.join("|") || "",
                ),
                cofinanceur_email: toPv(""),
                montants: toPv(0), // TODO fake data but we won't know
            },
        };
    }

    public static dboToEntity(dbo: ApplicationFlatDbo): ApplicationFlatEntity {
        const beneficiaryEstablishmentIdType = dbo.typeIdEtablissementBeneficiaire;
        const beneficiaryEstablishmentId = EstablishmentIdentifier.buildIdentifierFromString(
            dbo.idEtablissementBeneficiaire,
        );
        // added after using identifier class instead of string in beneficiaryEstablishmentId
        // this guard any miss conception / error in the applicationFlat collection
        // this check could be removed after checking that applicationFlat persistence also check identifier validity
        if (!beneficiaryEstablishmentId)
            throw new Error(
                `Failed to adapt ApplicationFlat DBO into Entity. Incorrect identifier ${dbo.idEtablissementBeneficiaire}`,
            );

        // TODO: make this available from EstablishmentIdentifier
        let beneficiaryCompanyId;
        if (beneficiaryEstablishmentIdType === Siret.getName()) {
            beneficiaryCompanyId = (beneficiaryEstablishmentId as Siret).toSiren();
        } else if (beneficiaryEstablishmentIdType === Ridet.getName()) {
            beneficiaryCompanyId = (beneficiaryEstablishmentId as Ridet).toRid();
        } else {
            beneficiaryCompanyId = (beneficiaryEstablishmentId as Tahitiet).toTahiti();
        }
        const beneficiaryCompanyIdType = beneficiaryCompanyId.name;

        return {
            updateDate: dbo.dateMiseAJour,
            uniqueId: dbo.idUnique,
            applicationId: dbo.idSubvention,
            applicationProviderId: dbo.idSubventionProvider,
            joinKeyId: dbo.idJointure,
            joinKeyDesc: dbo.descriptionIdJointure,
            provider: dbo.fournisseur,
            allocatorName: dbo.nomAttribuant,
            allocatorIdType: dbo.typeIdAttribuant,
            allocatorId: dbo.idAttribuant,
            managingAuthorityName: dbo.nomAutoriteGestion,
            managingAuthorityId: dbo.idAutoriteGestion,
            managingAuthorityIdType: dbo.typeIdAutoriteGestion,
            instructiveDepartmentName: dbo.nomServiceInstructeur,
            instructiveDepartmentIdType: dbo.typeIdServiceInstructeur,
            instructiveDepartementId: dbo.idServiceInstructeur,
            beneficiaryEstablishmentId,
            beneficiaryEstablishmentIdType,
            beneficiaryCompanyId,
            beneficiaryCompanyIdType,
            budgetaryYear: dbo.exerciceBudgetaire,
            pluriannual: dbo.pluriannualite,
            pluriannualYears: dbo.anneesPluriannualite,
            decisionDate: dbo.dateDecision,
            conventionDate: dbo.dateConvention,
            decisionReference: dbo.referenceDecision,
            depositDate: dbo.dateDepotDemande,
            requestYear: dbo.anneeDemande,
            scheme: dbo.dispositif,
            subScheme: dbo.sousDispositif,
            statusLabel: dbo.statutLabel,
            object: dbo.objet,
            nature: dbo.nature,
            requestedAmount: dbo.montantDemande,
            grantedAmount: dbo.montantAccorde,
            totalAmount: dbo.montantTotal,
            ej: dbo.ej,
            paymentId: dbo.idVersement,
            paymentCondition: dbo.conditionsVersements,
            paymentConditionDesc: dbo.descriptionConditionsVersements,
            paymentPeriodDates: dbo.datesPeriodeVersement,
            cofinancingRequested: dbo.cofinancementsSollicites,
            cofinancersNames: dbo.nomsAttribuantsCofinanceurs,
            cofinancersIdType: dbo.typeIdCofinanceursSollicites,
            confinancersId: dbo.idCofinanceursSollicites,
            idRAE: dbo.idRAE,
            ueNotification: dbo.notificationUE,
            subventionPercentage: dbo.pourcentageSubvention,
        };
    }

    public static entityToDbo(entity: ApplicationFlatEntity): Omit<ApplicationFlatDbo, "_id"> {
        return {
            dateMiseAJour: entity.updateDate,
            idUnique: entity.uniqueId,
            idSubvention: entity.applicationId,
            idSubventionProvider: entity.applicationProviderId,
            idJointure: entity.joinKeyId,
            descriptionIdJointure: entity.joinKeyDesc,
            fournisseur: entity.provider,
            nomAttribuant: entity.allocatorName,
            typeIdAttribuant: entity.allocatorIdType,
            idAttribuant: entity.allocatorId,
            nomAutoriteGestion: entity.managingAuthorityName,
            idAutoriteGestion: entity.managingAuthorityId,
            typeIdAutoriteGestion: entity.managingAuthorityIdType,
            nomServiceInstructeur: entity.instructiveDepartmentName,
            typeIdServiceInstructeur: entity.instructiveDepartmentIdType,
            idServiceInstructeur: entity.instructiveDepartementId,
            idEtablissementBeneficiaire: entity.beneficiaryEstablishmentId.toString(),
            typeIdEtablissementBeneficiaire: entity.beneficiaryEstablishmentIdType,
            idEntrepriseBeneficiaire: entity.beneficiaryCompanyId.toString(),
            typeIdEntrepriseBeneficiaire: entity.beneficiaryCompanyIdType,
            exerciceBudgetaire: entity.budgetaryYear,
            pluriannualite: entity.pluriannual,
            anneesPluriannualite: entity.pluriannualYears,
            dateDecision: entity.decisionDate,
            dateConvention: entity.conventionDate,
            referenceDecision: entity.decisionReference,
            dateDepotDemande: entity.depositDate,
            anneeDemande: entity.requestYear,
            dispositif: entity.scheme,
            sousDispositif: entity.subScheme,
            statutLabel: entity.statusLabel,
            objet: entity.object,
            nature: entity.nature,
            montantDemande: entity.requestedAmount,
            montantAccorde: entity.grantedAmount,
            montantTotal: entity.totalAmount,
            ej: entity.ej,
            idVersement: entity.paymentId,
            conditionsVersements: entity.paymentCondition,
            descriptionConditionsVersements: entity.paymentConditionDesc,
            datesPeriodeVersement: entity.paymentPeriodDates,
            cofinancementsSollicites: entity.cofinancingRequested,
            nomsAttribuantsCofinanceurs: entity.cofinancersNames,
            typeIdCofinanceursSollicites: entity.cofinancersIdType,
            idCofinanceursSollicites: entity.confinancersId,
            idRAE: entity.idRAE,
            notificationUE: entity.ueNotification,
            pourcentageSubvention: entity.subventionPercentage,
        };
    }

    static toDto(entity: ApplicationFlatEntity) {
        return ApplicationFlatMapper.entityToDbo(entity) as ApplicationFlatDto;
    }
}
