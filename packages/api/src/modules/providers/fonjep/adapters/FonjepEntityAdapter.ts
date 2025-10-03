import FonjepTiersEntity from "../entities/FonjepTiersEntity";
import FonjepPosteEntity from "../entities/FonjepPosteEntity";
import FonjepVersementEntity, { PayedFonjepVersementEntity } from "../entities/FonjepVersementEntity";
import FonjepTypePosteEntity from "../entities/FonjepTypePosteEntity";
import FonjepDispositifEntity from "../entities/FonjepDispositifEntity";
import FonjepDispositifDto from "../../../../dataProviders/db/providers/fonjep/dto/fonjepDispositifDto";
import { FonjepPosteDtoWithJSDate } from "../../../../dataProviders/db/providers/fonjep/dto/fonjepPosteDto";
import FonjepTypePosteDto from "../../../../dataProviders/db/providers/fonjep/dto/fonjepTypePosteDto";
import { FonjepVersementDto } from "../../../../dataProviders/db/providers/fonjep/dto/fonjepVersementDto";
import FonjepTiersDto from "../../../../dataProviders/db/providers/fonjep/dto/fonjepTiersDto";
import Siret from "../../../../identifierObjects/Siret";
import Ridet from "../../../../identifierObjects/Ridet";
import Rid from "../../../../identifierObjects/Rid";
import Siren from "../../../../identifierObjects/Siren";
import { GenericAdapter } from "../../../../shared/GenericAdapter";
import { FonjepApplicationFlatEntity, FonjepPaymentFlatEntity } from "../entities/FonjepFlatEntity";
import { DataBretagneRecords } from "../../dataBretagne/@types/DataBretagne";
import dataBretagneService from "../../dataBretagne/dataBretagne.service";
import { getShortISODate, modifyDateYear } from "../../../../shared/helpers/DateHelper";
import { removeWhitespace } from "../../../../shared/helpers/StringHelper";
import EstablishmentIdentifier from "../../../../identifierObjects/EstablishmentIdentifier";
import { ApplicationNature, ApplicationStatus, PaymentCondition } from "dto";

/**
 * Some of the nullIfEmpty calls have not been verified and were added base on every FonjepEntity type
 * Properties without nullIfEmpty are supposed to be mandatory / always present (checked in the 2024-12-31 extract file)
 */
export default class FonjepEntityAdapter {
    // duplicate with fonjepService.provider.id
    // see https://github.com/betagouv/api-subventions-asso/issues/3256
    static PROVIDER_NAME = "Fonjep";

    /**
     * This was defined a long time ago and must be updated and validated
     */
    private static FOUNDER_CODE_TO_BOP_MAPPER = {
        "10004": 163,
        "10005": 163,
        "10008": 147,
        "10009": 163,
        "10010": 209,
        "10012": 361,
        "10016": 163,
        "10017": 163,
    };

    /**
     *
     * @param code Financer code
     * It can be found in :
     * financeurCofinanceurCode (fonjepVersement)
     * financeurCode (fonjepDispositif)
     * financeurPrincipalCode (fonjepPoste)
     * code (fonjepTiers)
     *
     * @returns The state financial program number
     */
    static getBopFromFounderCode(code: number): number {
        return this.FOUNDER_CODE_TO_BOP_MAPPER[code];
    }

    static toFonjepTierEntity(tier: FonjepTiersDto, updateDate: Date): FonjepTiersEntity {
        return {
            code: tier["Code"],
            raisonSociale: tier["RaisonSociale"],
            estAssociation: tier["EstAssociation"],
            estCoFinanceurPostes: tier["EstCoFinanceurPostes"],
            estFinanceurPostes: tier["EstFinanceurPostes"],
            siretOuRidet: tier["SiretOuRidet"] ? removeWhitespace(tier["SiretOuRidet"]) : null,
            codePostal: tier["CodePostal"],
            ville: tier["Ville"],
            contactEmail: tier["ContactEmail"],
            updateDate,
        };
    }

    static toFonjepPosteEntity(poste: FonjepPosteDtoWithJSDate, updateDate: Date): FonjepPosteEntity {
        return {
            code: poste["Code"],
            annee: poste["Annee"],
            associationBeneficiaireCode: poste["AssociationBeneficiaireCode"],
            financeurPrincipalCode: poste["FinanceurPrincipalCode"],
            financeurAttributeurCode: poste["FinanceurAttributeurCode"],
            dateFinTriennalite: poste["DateFinTriennalite"],
            dispositifId: poste["DispositifId"],
            pstStatutPosteLibelle: poste["PstStatutPosteLibelle"],
            pstRaisonStatutLibelle: poste["PstRaisonStatutLibelle"],
            associationImplantationCode: poste["AssociationImplantationCode"],
            montantSubvention: poste["MontantSubvention"],
            pstTypePosteCode: poste["PstTypePosteCode"],
            pleinTemps: poste["PleinTemps"],
            doublementUniteCompte: poste["DoublementUniteCompte"],
            updateDate,
        };
    }

    static toFonjepVersementEntity(versement: FonjepVersementDto, updateDate: Date): FonjepVersementEntity {
        return {
            posteCode: versement["PosteCode"],
            periodeDebut: versement["PeriodeDebut"],
            periodeFin: versement["PeriodeFin"],
            dateVersement: versement["DateVersement"],
            montantAPayer: versement["MontantAPayer"],
            montantPaye: versement["MontantPaye"],
            updateDate,
        };
    }

    static toFonjepTypePosteEntity(typePoste: FonjepTypePosteDto, updateDate: Date): FonjepTypePosteEntity {
        return {
            code: typePoste["Code"],
            libelle: typePoste["Libelle"],
            updateDate,
        };
    }

    static toFonjepDispositifEntity(dispositif: FonjepDispositifDto, updateDate: Date): FonjepDispositifEntity {
        return {
            id: dispositif["ID"],
            libelle: dispositif["Libelle"],
            financeurCode: dispositif["FinanceurCode"],
            updateDate,
        };
    }

    public static extractPositionCode(entity: FonjepPaymentFlatEntity) {
        if (entity.ej !== GenericAdapter.NOT_APPLICABLE_VALUE) {
            throw new Error("You must extract a position code from a FonjepPaymentFlat entity");
        } else {
            // cf buildFlatPaymentId
            return entity.idVersement.split("-")[0];
        }
    }

    private static getConventionDate(position: FonjepPosteEntity): Date {
        if (position.dateFinTriennalite) return modifyDateYear(position.dateFinTriennalite, -3);
        throw new Error("We can't create FONJEP PaymentFlat without dateFinTriennalite");
    }

    private static buildFlatPaymentId(data: { thirdParty: FonjepTiersEntity; position: FonjepPosteEntity }) {
        const { thirdParty, position } = data;
        return `${position.code}-${getShortISODate(FonjepEntityAdapter.getConventionDate(position))}-${position.annee}-${
            thirdParty.siretOuRidet
        }`;
    }

    // this keeps the same structure as other providers payment flat uniqueId and add N/A for the missing fields
    private static buildPaymentFlatUniqueId(
        partialPaymentFlat: Omit<FonjepPaymentFlatEntity, "uniqueId">,
        beginningDate: Date,
    ) {
        const keys = [
            "fonjep",
            partialPaymentFlat.idVersement,
            partialPaymentFlat.programNumber,
            GenericAdapter.NOT_APPLICABLE_VALUE, // action code
            GenericAdapter.NOT_APPLICABLE_VALUE, // activity code
            getShortISODate(beginningDate), // was operationDate to be ISO with CHORUS but it can be identical for every payment of the same year. See positionCode S05543
            GenericAdapter.NOT_APPLICABLE_VALUE, // attachement comptable
            GenericAdapter.NOT_APPLICABLE_VALUE, // centre financier code
        ];
        return keys.join("-");
    }

    static toFonjepPaymentFlat(
        fonjepData: { payment: PayedFonjepVersementEntity; position: FonjepPosteEntity; thirdParty: FonjepTiersEntity },
        dataBretagneData: DataBretagneRecords,
    ): FonjepPaymentFlatEntity {
        const { payment, thirdParty, position } = fonjepData;
        if (!thirdParty.siretOuRidet) {
            throw new Error("Trying to create a FONJEP PaymentFlat without siret or ridet information");
        } else {
            const estabId = thirdParty.siretOuRidet;
            let estabIdType: "siret" | "ridet";
            let assoIdType: "siren" | "rid";
            let estabValueObjectId: Siret | Ridet;
            let assoValueObjectId: Siren | Rid;

            if (Siret.isSiret(estabId)) {
                estabIdType = "siret";
                assoIdType = "siren";
                estabValueObjectId = new Siret(estabId);
                assoValueObjectId = estabValueObjectId.toSiren();
            } else if (Ridet.isRidet(estabId)) {
                estabIdType = "ridet";
                assoIdType = "rid";
                estabValueObjectId = new Ridet(estabId);
                assoValueObjectId = estabValueObjectId.toRid();
            } else {
                throw new Error(
                    `Fonjep Tier with code ${position.code} has no siret or ridet and should not have been parsed`,
                );
            }

            const program =
                dataBretagneData.programs[
                    this.getBopFromFounderCode(Number(fonjepData.position.financeurPrincipalCode))
                ];

            const ministry = dataBretagneService.getMinistryEntity(program, dataBretagneData.ministries);

            const paymentId = this.buildFlatPaymentId({
                thirdParty,
                position,
            });

            const partialPaymentFlat = {
                idVersement: paymentId,
                exerciceBudgetaire: position.annee as number,
                typeIdEtablissementBeneficiaire: estabIdType,
                idEtablissementBeneficiaire: estabValueObjectId,
                typeIdEntrepriseBeneficiaire: assoIdType,
                idEntrepriseBeneficiaire: assoValueObjectId,
                amount: payment.montantPaye,
                operationDate: payment.dateVersement,
                centreFinancierCode: GenericAdapter.NOT_APPLICABLE_VALUE,
                centreFinancierLibelle: GenericAdapter.NOT_APPLICABLE_VALUE,
                attachementComptable: GenericAdapter.NOT_APPLICABLE_VALUE,
                regionAttachementComptable: GenericAdapter.NOT_APPLICABLE_VALUE,
                ej: GenericAdapter.NOT_APPLICABLE_VALUE,
                actionCode: GenericAdapter.NOT_APPLICABLE_VALUE,
                actionLabel: GenericAdapter.NOT_APPLICABLE_VALUE,
                activityCode: GenericAdapter.NOT_APPLICABLE_VALUE,
                activityLabel: GenericAdapter.NOT_APPLICABLE_VALUE,
                provider: this.PROVIDER_NAME.toLowerCase(),
                programName: program.label_programme,
                programNumber: program.code_programme,
                mission: program.mission,
                ministry: ministry?.nom_ministere || null,
                ministryAcronym: ministry?.sigle_ministere || null,
                updateDate: payment.updateDate,
            };

            // TODO: Another example where something nullable (Tier.FinanceurPrincipalCode) is required to build a unique ID
            // TODO: make FonjepTierEntity.financeurPrincipalCode mandatory and make it a number
            const uniqueId = this.buildPaymentFlatUniqueId(partialPaymentFlat, payment.periodeDebut);

            return { uniqueId, ...partialPaymentFlat };
        }
    }

    static toFonjepApplicationFlat(entities: {
        position: FonjepPosteEntity;
        beneficiary: FonjepTiersEntity; // association who made the application
        allocator: FonjepTiersEntity | undefined; // structure who handle the application payment
        instructor: FonjepTiersEntity | undefined; // structure who validates / instructs the application
        scheme: FonjepDispositifEntity | undefined;
    }): Omit<FonjepApplicationFlatEntity, "updateDate"> | null {
        const { position, beneficiary, allocator, instructor, scheme } = entities;
        if (!position.annee) throw new Error("FONJEP ApplicationFlat must have a budgetary year");
        if (!beneficiary.siretOuRidet) throw new Error("FONJEP ApplicationFlat must have a beneficiary siret or ridet");
        const beneficiaryEstablishmentIdType =
            EstablishmentIdentifier.getIdentifierType(beneficiary.siretOuRidet) || null;
        if (!beneficiaryEstablishmentIdType) {
            // TODO: this should not happen but has been encountered where rid was present in instead of ridet. See #3586
            console.log(
                `FONJEP ApplicationFlat must have a valid beneficiary siret or ridet, given ${beneficiary.siretOuRidet}.`,
            );
            return null;
        }

        const provider = this.PROVIDER_NAME.toLowerCase(); // replace this with #3338
        const applicationProviderId = `${position.code}-${getShortISODate(this.getConventionDate(position))}`;
        const applicationId = `${provider}-${applicationProviderId}`;
        const uniqueId = `${applicationId}-${position.annee}`;
        const paymentId = this.buildFlatPaymentId({ thirdParty: beneficiary, position });

        const allocatorIdType = allocator?.siretOuRidet
            ? EstablishmentIdentifier.getIdentifierType(allocator.siretOuRidet)
            : null;
        const instructiveDepartmentIdType = instructor?.siretOuRidet
            ? EstablishmentIdentifier.getIdentifierType(instructor.siretOuRidet)
            : null;

        return {
            uniqueId,
            applicationId,
            applicationProviderId,
            provider,
            joinKeyId: GenericAdapter.NOT_APPLICABLE_VALUE,
            joinKeyDesc: GenericAdapter.NOT_APPLICABLE_VALUE,
            allocatorName: allocator?.raisonSociale ?? null,
            allocatorId: allocator?.siretOuRidet ?? null,
            allocatorIdType,
            managingAuthorityName: "FONJEP",
            managingAuthorityId: null,
            managingAuthorityIdType: null,
            instructiveDepartmentName: instructor?.raisonSociale ?? null,
            instructiveDepartmentIdType,
            instructiveDepartementId: instructor?.siretOuRidet ?? null,
            beneficiaryEstablishmentId: beneficiary.siretOuRidet,
            beneficiaryEstablishmentIdType,
            budgetaryYear: position.annee,
            pluriannual: true,
            pluriannualYears: null, // null for now, see #3575 for updates
            decisionDate: null,
            conventionDate: this.getConventionDate(position),
            decisionReference: null,
            depositDate: null,
            requestYear: null,
            scheme: scheme?.libelle ?? null,
            subScheme: GenericAdapter.NOT_APPLICABLE_VALUE,
            statusLabel: ApplicationStatus.GRANTED, // always GRANTED because FONJEP only concerns payments (means that application has been granted)
            object: null,
            nature: ApplicationNature.MONEY,
            requestedAmount: position.montantSubvention,
            grantedAmount: position.montantSubvention,
            totalAmount: position.montantSubvention,
            ej: GenericAdapter.NOT_APPLICABLE_VALUE,
            paymentId,
            paymentCondition: PaymentCondition.PHASED,
            paymentConditionDesc: null,
            paymentPeriodDates: null,
            cofinancingRequested: GenericAdapter.NOT_APPLICABLE_VALUE,
            cofinancersNames: GenericAdapter.NOT_APPLICABLE_VALUE,
            cofinancersIdType: GenericAdapter.NOT_APPLICABLE_VALUE,
            confinancersId: GenericAdapter.NOT_APPLICABLE_VALUE,
            idRAE: null,
            ueNotification: null,
            subventionPercentage: null,
        };
    }
}
