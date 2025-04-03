import { CommonPaymentDto, ChorusPayment } from "dto";
import ProviderValueAdapter from "../../../../shared/adapters/ProviderValueAdapter";
import ChorusLineEntity from "../entities/ChorusLineEntity";
import dataBretagneService from "../../dataBretagne/dataBretagne.service";
import { RawPayment } from "../../../grant/@types/rawGrant";
import StateBudgetProgramDbo from "../../../../dataProviders/db/state-budget-program/StateBudgetProgramDbo";
import StateBudgetProgramEntity from "../../../../entities/StateBudgetProgramEntity";
import MinistryEntity from "../../../../entities/MinistryEntity";
import DomaineFonctionnelEntity from "../../../../entities/DomaineFonctionnelEntity";
import RefProgrammationEntity from "../../../../entities/RefProgrammationEntity";
import PaymentFlatEntity from "../../../../entities/PaymentFlatEntity";
import { GenericParser } from "../../../../shared/GenericParser";
import { NestedDefaultObject } from "../../../../@types";
import { ChorusLineDto } from "./chorusLineDto";

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

    public static toNotAggregatedChorusPaymentFlatEntity(
        /*
            create a PaymentFlatEntity from a ChorusLineEntity without
            aggregating the data. To get "a real" PaymentFlat entity data have
            to be groupbed by the unique key of paymentFlat that is not necessarily
            the same as the unique key of the ChorusLineEntity.
            */

        chorusDocument: ChorusLineEntity,
        programs: Record<string, StateBudgetProgramEntity>,
        ministries: Record<string, MinistryEntity>,
        domainesFonct: Record<string, DomaineFonctionnelEntity>,
        refsProgrammation: Record<string, RefProgrammationEntity>,
    ): PaymentFlatEntity {
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
            domainesFonct,
            refsProgrammation,
        );

        const entityConstructorParameters = [
            ...Object.values(
                GenericParser.indexDataByPathObject(
                    PaymentFlatEntity.chorusToPaymentFlatPath,
                    chorusDocument.data as NestedDefaultObject<string>,
                ),
            ),
            programEntity?.label_programme ?? null, // programName,
            programCode, // programNumber,
            programEntity?.mission ?? null, // mission,
            ministryEntity?.nom_ministere ?? null, // ministry,
            ministryEntity?.sigle_ministere ?? null, // ministryAcronym,
            actionCode, // actionCode,
            domaineFonctEntity?.libelle_action ?? null, // actionLabel,
            activityCode ?? null, // activityCode,
            refProgrammationEntity?.libelle_activite ?? null, // activityLabel,
        ] as ConstructorParameters<typeof PaymentFlatEntity>;

        return new PaymentFlatEntity(...entityConstructorParameters);
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
        refsProgrammation: Record<string, RefProgrammationEntity>,
    ) {
        const code = chorusDto["Référentiel de programmation CODE"]?.slice(-12);
        const entity = refsProgrammation[code];
        if (!entity) {
            console.error(`RefProgrammation not found for code: ${code}`);
            return { code, entity: null };
        }
        return { code, entity };
    }

    private static getActionCodeAndEntity(
        chorusDto: ChorusLineDto,
        domainesFonct: Record<string, DomaineFonctionnelEntity>,
    ) {
        const code = chorusDto["Domaine fonctionnel CODE"];
        const entity = domainesFonct[code];
        if (!entity) {
            console.error(`DomaineFonctionnel not found for code: ${code}`);
            return { code, entity: null };
        }
        return { code, entity };
    }

    private static getMinistryEntity(program: StateBudgetProgramEntity, ministries: Record<string, MinistryEntity>) {
        const entity = ministries[program.code_ministere];
        if (!entity) {
            console.error(`Ministry not found for program code: ${program.code_ministere}`);
            return null;
        }
        return entity;
    }

    /**
     *
     * Fetch the complementary data from dataBretagne API / collection
     *
     * @param chorusDocument A ChorusLineDto object
     * @param programs state programs from state-budget-programs collection
     * @param ministries ministries from dataBretagne API
     * @param domainesFonct domainesFonct from dataBretagne API
     * @param refsProgrammation refsProgrammation from dataBretagne API
     *
     * @returns Object containing complementary data if found, otherwise null
     */
    private static getPaymentFlatComplementaryData(
        chorusDocument: ChorusLineDto,
        programs: Record<number, StateBudgetProgramEntity>,
        ministries: Record<string, MinistryEntity>,
        domainesFonct: Record<string, DomaineFonctionnelEntity>,
        refsProgrammation: Record<string, RefProgrammationEntity>,
    ) {
        const { code: programCode, entity: programEntity } = this.getProgramCodeAndEntity(chorusDocument, programs);

        let ministryEntity: MinistryEntity | null = null;
        if (programEntity) {
            ministryEntity = this.getMinistryEntity(programEntity, ministries);
        }

        const { code: activityCode, entity: refProgrammationEntity } = this.getActivityCodeAndEntity(
            chorusDocument,
            refsProgrammation,
        );

        const { code: actionCode, entity: domaineFonctEntity } = this.getActionCodeAndEntity(
            chorusDocument,
            domainesFonct,
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
