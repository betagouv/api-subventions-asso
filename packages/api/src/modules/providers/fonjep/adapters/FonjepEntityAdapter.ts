import FonjepTiersEntity from "../entities/FonjepTiersEntity";
import FonjepPosteEntity from "../entities/FonjepPosteEntity";
import FonjepVersementEntity, {
    FullFonjepVersementEntity,
    PayedFonjepVersementEntity,
} from "../entities/FonjepVersementEntity";
import FonjepTypePosteEntity from "../entities/FonjepTypePosteEntity";
import FonjepDispositifEntity from "../entities/FonjepDispositifEntity";
import FonjepDispositifDto from "../../../../dataProviders/db/providers/fonjep/dto/fonjepDispositifDto";
import { FonjepPosteDtoWithJSDate } from "../../../../dataProviders/db/providers/fonjep/dto/fonjepPosteDto";
import FonjepTypePosteDto from "../../../../dataProviders/db/providers/fonjep/dto/fonjepTypePosteDto";
import { FonjepVersementDto } from "../../../../dataProviders/db/providers/fonjep/dto/fonjepVersementDto";
import FonjepTiersDto from "../../../../dataProviders/db/providers/fonjep/dto/fonjepTiersDto";
import Siret from "../../../../valueObjects/Siret";
import Ridet from "../../../../valueObjects/Ridet";
import Rid from "../../../../valueObjects/Rid";
import Siren from "../../../../valueObjects/Siren";
import { GenericAdapter } from "../../../../shared/GenericAdapter";
import { FonjepPaymentFlatEntity } from "../entities/FonjepPaymentFlatEntity";
import { DataBretagneRecords } from "../../dataBretagne/@types/DataBretagne";
import StateBudgetProgramEntity from "../../../../entities/StateBudgetProgramEntity";
import dataBretagneService from "../../dataBretagne/dataBretagne.service";
import { getShortISODate } from "../../../../shared/helpers/DateHelper";

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
    static getBopFromFounderCode(code: number) {
        return this.FOUNDER_CODE_TO_BOP_MAPPER[code];
    }

    static toFonjepTierEntity(tier: FonjepTiersDto): FonjepTiersEntity {
        return {
            code: tier["Code"],
            raisonSociale: tier["RaisonSociale"],
            estAssociation: tier["EstAssociation"],
            estCoFinanceurPostes: tier["EstCoFinanceurPostes"],
            estFinanceurPostes: tier["EstFinanceurPostes"],
            siretOuRidet: tier["SiretOuRidet"],
            codePostal: tier["CodePostal"],
            ville: tier["Ville"],
            contactEmail: tier["ContactEmail"],
        };
    }

    static toFonjepPosteEntity(poste: FonjepPosteDtoWithJSDate): FonjepPosteEntity {
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
        };
    }

    static toFonjepVersementEntity(versement: FonjepVersementDto): FonjepVersementEntity {
        return {
            posteCode: versement["PosteCode"],
            periodeDebut: versement["PeriodeDebut"],
            periodeFin: versement["PeriodeFin"],
            dateVersement: versement["DateVersement"],
            montantAPayer: versement["MontantAPayer"],
            montantPaye: versement["MontantPaye"],
        };
    }

    static toFonjepTypePosteEntity(typePoste: FonjepTypePosteDto): FonjepTypePosteEntity {
        return {
            code: typePoste["Code"],
            libelle: typePoste["Libelle"],
        };
    }

    static toFonjepDispositifEntity(dispositif: FonjepDispositifDto): FonjepDispositifEntity {
        return {
            id: dispositif["ID"],
            libelle: dispositif["Libelle"],
            financeurCode: dispositif["FinanceurCode"],
        };
    }

    private static buildPaymentFlatIdVersement(data: {
        thirdParty: FonjepTiersEntity;
        position: FonjepPosteEntity;
        payment: PayedFonjepVersementEntity;
    }) {
        return `${data.payment.posteCode}-${getShortISODate(data.payment.dateVersement)}-${data.position.annee}-${
            data.thirdParty.siretOuRidet
        }`;
    }

    // this should contain action and activity code like Chorus
    private static buildPaymentFlatUniqueId(
        paymentId: string,
        payment: PayedFonjepVersementEntity,
        program: StateBudgetProgramEntity,
    ) {
        return `${paymentId}-${program.code_programme}-${payment.dateVersement.getTime()}`;
    }

    /**
     *
     * uniqueId : idVersement + numero programme + code action + code activité + date opération
     * idVersement : code poste + date convention + exercice budgétaire + siret
     * idEtablissementBeneficiaire : siret
     * idAssoBeneficiaire : siren à partir du siret
     * montant: MontantPaye
     * exerciceBudgetaire : Annee
     * date_operation: DateVersement
     * nom_programme: voir data bretagne
     * numero_programme: tjs 163
     * mission: data bretagne
     * ministere: data bretagne
     * sigle_ministere : data bretagne
     * provider: fonjep
     *
     */
    static toFonjepPaymentFlat(
        fonjepData: { payment: FullFonjepVersementEntity; position: FonjepPosteEntity; thirdParty: FonjepTiersEntity },
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

            const paymentId = this.buildPaymentFlatIdVersement({
                thirdParty,
                position,
                payment,
            });

            // TODO: Another example where something nullable (Tier.FinanceurPrincipalCode) is required to build a unique ID
            // TODO: make FonjepTierEntity.financeurPrincipalCode mandatory and make it a number
            const uniqueId = this.buildPaymentFlatUniqueId(paymentId, fonjepData.payment, program);

            return {
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
                codePoste: payment.posteCode,
                provider: this.PROVIDER_NAME,
                programName: program.label_programme,
                programNumber: program.code_programme,
                mission: program.mission,
                ministry: ministry?.nom_ministere || null,
                ministryAcronym: ministry?.sigle_ministere || null,

                // as of #3142 we cannot find those fields in FONJEP data
                // it is defined null because we believe that FONJEP can update its data (cf schemas_donnees.xlsx)
                actionCode: null,
                actionLabel: null,
                activityCode: null,
                activityLabel: null,

                idVersement: paymentId,
                uniqueId,
            };
        }
    }
}
