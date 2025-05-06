import Sentry from "@sentry/node";
import { CommonPaymentDto, ChorusPayment } from "dto";
import { getShortISODate } from "../../../../shared/helpers/DateHelper";
import ProviderValueAdapter from "../../../../shared/adapters/ProviderValueAdapter";
import ChorusLineEntity from "../entities/ChorusLineEntity";
import dataBretagneService from "../../dataBretagne/dataBretagne.service";
import { RawPayment } from "../../../grant/@types/rawGrant";
import StateBudgetProgramDbo from "../../../../dataProviders/db/state-budget-program/StateBudgetProgramDbo";
import StateBudgetProgramEntity from "../../../../entities/StateBudgetProgramEntity";
import MinistryEntity from "../../../../entities/MinistryEntity";
import DomaineFonctionnelEntity from "../../../../entities/DomaineFonctionnelEntity";
import Siret from "../../../../valueObjects/Siret";
import RefProgrammationEntity from "../../../../entities/RefProgrammationEntity";
import { GenericParser } from "../../../../shared/GenericParser";
import { ChorusLineDto } from "../@types/ChorusLineDto";
import { ChorusPaymentFlatEntity, ChorusPaymentFlatRaw } from "../@types/ChorusPaymentFlat";
import Ridet from "../../../../valueObjects/Ridet";
import { establishmentIdType } from "../../../../valueObjects/typeIdentifier";
import Tahitiet from "../../../../valueObjects/Tahitiet";
import REGION_MAPPING from "./ChorusRegionMapping";

export default class ChorusAdapter {
    static PROVIDER_NAME = "Chorus";

    public static rawToPayment(rawPayment: RawPayment<ChorusLineEntity>, program: Omit<StateBudgetProgramDbo, "_id">) {
        return this.toPayment(rawPayment.data, program);
    }

    public static toPayment(entity: ChorusLineEntity, program: Omit<StateBudgetProgramDbo, "_id">): ChorusPayment {
        const toPvChorus = <T>(value: T) =>
            ProviderValueAdapter.toProviderValue<T>(
                value,
                ChorusAdapter.PROVIDER_NAME,
                entity.indexedInformations.dateOperation,
            );

        const toPvDataBretagne = <T>(value: T) =>
            ProviderValueAdapter.toProviderValue<T>(
                value,
                dataBretagneService.provider.name,
                entity.indexedInformations.dateOperation,
            );

        const toPvOrUndefined = value => (value ? toPvChorus(value) : undefined);

        return {
            ej: toPvChorus(entity.indexedInformations.ej),
            versementKey: toPvChorus(entity.indexedInformations.ej),
            siret: toPvChorus(entity.indexedInformations.siret),
            amount: toPvChorus(entity.indexedInformations.amount),
            dateOperation: toPvChorus(entity.indexedInformations.dateOperation),
            centreFinancier: toPvChorus(entity.indexedInformations.centreFinancier),
            domaineFonctionnel: toPvChorus(entity.indexedInformations.domaineFonctionnel),
            codeBranche: toPvChorus(entity.indexedInformations.codeBranche),
            branche: toPvChorus(entity.indexedInformations.branche),
            numeroDemandePaiement: toPvOrUndefined(entity.indexedInformations.numeroDemandePaiement),
            numeroTier: toPvOrUndefined(entity.indexedInformations.numeroTier),
            activitee: toPvOrUndefined(entity.indexedInformations.activitee),
            compte: toPvOrUndefined(entity.indexedInformations.compte),
            type: toPvOrUndefined(entity.indexedInformations.typeOperation),
            programme: toPvDataBretagne(program.code_programme),
            libelleProgramme: toPvDataBretagne(program.label_programme),
            bop: toPvChorus(program.code_programme.toString()), // Deprecated
        };
    }

    public static toCommon(entity: ChorusLineEntity): CommonPaymentDto {
        const bop = entity.indexedInformations.codeDomaineFonctionnel.slice(0, 4);
        return {
            montant_verse: entity.indexedInformations.amount,
            date_debut: entity.indexedInformations.dateOperation,
            bop: bop,
            exercice: entity.indexedInformations.exercice,
        };
    }

    public static getRegionAttachementComptable(attachementComptable: string | "N/A"): string | "N/A" {
        if (attachementComptable == "N/A") return "N/A";

        const region = REGION_MAPPING[attachementComptable];
        if (region === undefined) {
            const errorMessage = `Unknown region code: ${attachementComptable}`;
            Sentry.captureException(new Error(errorMessage));
            console.error(errorMessage);
            return "code region inconnu";
        }
        return region;
    }

    private static getEstablishmentValueObject(chorusLineDto: ChorusLineDto): establishmentIdType {
        if (chorusLineDto["Code taxe 1"] === "#") {
            // special case spotted after handling ridet and tahiti in V0.67
            // sometime chorus line doesn't any siret nor ridet or tahiti
            if (chorusLineDto["No TVA 3 (COM-RIDET ou TAHITI)"] === "#") {
                throw new Error(
                    `Not able to retrieve an establishment identifier for chorus line with EJ ${chorusLineDto["N° EJ"]} for exercice ${chorusLineDto["Exercice comptable"]}`,
                );
            }
            if (Ridet.isRidet(chorusLineDto["No TVA 3 (COM-RIDET ou TAHITI)"])) {
                return new Ridet(chorusLineDto["No TVA 3 (COM-RIDET ou TAHITI)"]);
            } else {
                return new Tahitiet(chorusLineDto["No TVA 3 (COM-RIDET ou TAHITI)"]);
            }
        } else return new Siret(chorusLineDto["Code taxe 1"]);
    }

    // TODO: add to ValueObject a getCompanyId that would abstract the notion of siren/rid/tahiti ?
    private static getCompanyId(estabId: establishmentIdType) {
        if (estabId instanceof Siret) {
            return estabId.toSiren();
        } else if (estabId instanceof Ridet) {
            return estabId.toRid();
        }
        // Tahitiet
        else {
            return estabId.toTahiti();
        }
    }

    private static getAmount(chorusLineDto: ChorusLineDto): number | null {
        const amount = chorusLineDto["Montant payé"];
        if (!amount || typeof amount === "number") return amount;
        if (typeof amount === "string")
            // @ts-expect-error: this should not be a string but was in the original code refactored with #3342
            // Plus, after unit testing it it throws a TypeError because the RegExp doesn't have the g flag (added in #3342)
            return parseFloat(amount.replaceAll(/[\r ]/g, "").replace(",", "."));
        // this should never happen
        else return null;
    }

    private static getOperationDate(chorusLineDto: ChorusLineDto): Date | null {
        const operationDate = chorusLineDto["Date de dernière opération sur la DP"];

        if (!operationDate) return null;

        if (typeof operationDate === "number") {
            return GenericParser.ExcelDateToJSDate(operationDate);
        } else {
            const operationDateFromStr = parseInt(operationDate, 10);
            // if operationDate is DD/MM/YYYY ? Is this realy possible ? This code is old and was refactored in #3342
            if (operationDate != operationDateFromStr.toString()) {
                const [day, month, year] = operationDate.split(/[/.]/).map(v => parseInt(v, 10));
                return new Date(Date.UTC(year, month - 1, day));
            } else {
                return GenericParser.ExcelDateToJSDate(parseInt(operationDate, 10));
            }
        }
    }

    private static getPaymentFlatRawData(data: ChorusLineDto): ChorusPaymentFlatRaw {
        const exerciceBudgetaire = data["Exercice comptable"] ? parseInt(data["Exercice comptable"], 10) : null;
        const idEtablissementBeneficiaire = this.getEstablishmentValueObject(data);
        const idEntrepriseBeneficiaire = this.getCompanyId(idEtablissementBeneficiaire);
        const typeIdEtablissementBeneficiaire = idEtablissementBeneficiaire.name;
        const typeIdEntrepriseBeneficiaire = idEntrepriseBeneficiaire.name;

        // all nullable error should be handled with issue #3345
        return {
            //@ts-expect-error: this should be nullable but was in the original code refactored with #3342
            exerciceBudgetaire,
            typeIdEtablissementBeneficiaire,
            idEtablissementBeneficiaire,
            typeIdEntrepriseBeneficiaire,
            idEntrepriseBeneficiaire,
            //@ts-expect-error: this should be nullable but was in the original code refactored with #3342
            amount: this.getAmount(data),
            //@ts-expect-error: this should be nullable but was in the original code refactored with #3342
            operationDate: this.getOperationDate(data),
            //@ts-expect-error: this should be nullable but was in the original code refactored with #3342
            ej: data["N° EJ"],
            centreFinancierCode: data["Centre financier CODE"],
            centreFinancierLibelle: data["Centre financier"],
            //@ts-expect-error: this should be nullable but was in the original code refactored with #3342
            attachementComptable: data["Société"],
        };
    }

    /**
     *   /!\ DO NOT USE THIS DIRECTLY TO PERSIT IN PAYMENT FLAT DATABASE /!\
     *
     *   Create a PaymentFlatEntity from a ChorusLineEntity
     *
     *   To get a "full" PaymentFlatEntity in order to process persistance in database,
     *   ensure to aggregate all PaymentFlatEntity by uniqueId and merge the amount
     */
    public static toNotAggregatedChorusPaymentFlatEntity(
        chorusDocument: ChorusLineEntity,
        programs: Record<string, StateBudgetProgramEntity>,
        ministries: Record<string, MinistryEntity>,
        fonctionalDomains: Record<string, DomaineFonctionnelEntity>,
        programsRef: Record<string, RefProgrammationEntity>,
    ): ChorusPaymentFlatEntity {
        const {
            programCode,
            activityCode,
            actionCode,
            programEntity,
            ministryEntity,
            domaineFonctEntity,
            refProgrammationEntity,
        } = this.getPaymentFlatComplementaryData(
            chorusDocument.data as ChorusLineDto,
            programs,
            ministries,
            fonctionalDomains,
            programsRef,
        );

        const rawDataWithDataBretagne: Omit<
            ChorusPaymentFlatEntity,
            "regionAttachementComptable" | "idVersement" | "uniqueId"
        > = {
            ...this.getPaymentFlatRawData(chorusDocument.data as ChorusLineDto),
            programName: programEntity?.label_programme ?? null,
            programNumber: programCode,
            mission: programEntity?.mission ?? null,
            ministry: ministryEntity?.nom_ministere ?? null,
            ministryAcronym: ministryEntity?.sigle_ministere ?? null,
            actionCode,
            actionLabel: domaineFonctEntity?.libelle_action ?? null,
            activityCode,
            activityLabel: refProgrammationEntity?.libelle_activite ?? null,
            provider: "chorus", // TODO: get this from config / code => see #3338
        };

        const idVersement = `${rawDataWithDataBretagne.idEtablissementBeneficiaire}-${rawDataWithDataBretagne.ej}-${rawDataWithDataBretagne.exerciceBudgetaire}`;
        const uniqueId = `${idVersement}-${
            rawDataWithDataBretagne.programNumber
        }-${actionCode}-${activityCode}-${getShortISODate(rawDataWithDataBretagne.operationDate)}-${
            rawDataWithDataBretagne.attachementComptable
        }-${rawDataWithDataBretagne.centreFinancierCode}`;
        const regionAttachementComptable = ChorusAdapter.getRegionAttachementComptable(
            rawDataWithDataBretagne.attachementComptable,
        );

        return {
            ...rawDataWithDataBretagne,
            uniqueId,
            idVersement,
            regionAttachementComptable,
        };
    }

    private static getProgramCodeAndEntity(
        chorusDto: ChorusLineDto,
        programs: Record<string, StateBudgetProgramEntity>,
    ) {
        // trick to trim 0 at the beginning of the code
        // i.e "0161" => "161"
        const code = parseInt(chorusDto["Domaine fonctionnel CODE"]?.slice(1, 4));
        const entity = programs[String(code)];
        if (!entity) {
            console.error(`Program not found for code: ${code}`);
            return { code, entity: null };
        }
        return { code, entity };
    }

    private static getActivityCodeAndEntity(
        chorusDto: ChorusLineDto,
        programsRef: Record<string, RefProgrammationEntity>,
    ) {
        const code = chorusDto["Référentiel de programmation CODE"]?.slice(-12);
        const entity = programsRef[code];
        if (!entity) {
            console.error(`RefProgrammation not found for code: ${code}`);
            return { code, entity: null };
        }
        return { code, entity };
    }

    private static getActionCodeAndEntity(
        chorusDto: ChorusLineDto,
        fonctionalDomains: Record<string, DomaineFonctionnelEntity>,
    ) {
        const code = chorusDto["Domaine fonctionnel CODE"];
        const entity = fonctionalDomains[code];
        if (!entity) {
            console.error(`DomaineFonctionnel not found for code: ${code}`);
            return { code, entity: null };
        }
        return { code, entity };
    }

    /**
     *
     * Fetch the complementary data from dataBretagne API / collection
     *
     * @param chorusDocument A ChorusLineDto object
     * @param programs state programs from state-budget-programs collection
     * @param ministries ministries from dataBretagne API
     * @param fonctionalDomains fonctionalDomains from dataBretagne API
     * @param programsRef programsRef from dataBretagne API
     *
     * @returns Object containing complementary data if found, otherwise null
     */
    private static getPaymentFlatComplementaryData(
        chorusDocument: ChorusLineDto,
        programs: Record<number, StateBudgetProgramEntity>,
        ministries: Record<string, MinistryEntity>,
        fonctionalDomains: Record<string, DomaineFonctionnelEntity>,
        programsRef: Record<string, RefProgrammationEntity>,
    ) {
        const { code: programCode, entity: programEntity } = this.getProgramCodeAndEntity(chorusDocument, programs);
        let ministryEntity: MinistryEntity | null = null;
        if (programEntity) {
            ministryEntity = dataBretagneService.getMinistryEntity(programEntity, ministries);
        }

        const { code: activityCode, entity: refProgrammationEntity } = this.getActivityCodeAndEntity(
            chorusDocument,
            programsRef,
        );

        const { code: actionCode, entity: domaineFonctEntity } = this.getActionCodeAndEntity(
            chorusDocument,
            fonctionalDomains,
        );

        return {
            programCode,
            activityCode,
            actionCode,
            programEntity,
            ministryEntity,
            domaineFonctEntity,
            refProgrammationEntity,
        };
    }
}
