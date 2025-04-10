import Sentry from "@sentry/node";
import { CommonPaymentDto, ChorusPayment } from "dto";
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
import { NestedDefaultObject, ParserInfo } from "../../../../@types";
import { ChorusLineDto } from "../@types/ChorusLineDto";
import PaymentFlatEntity from "../../../../entities/PaymentFlatEntity";
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

    public static chorusToPaymentFlatPath: { [key: string]: ParserInfo } = {
        exerciceBudgetaire: {
            path: ["Exercice comptable"],
            adapter: value => {
                if (!value) return value;
                return parseInt(value, 10);
            },
        },
        typeIdEtablissementBeneficiaire: {
            path: ["Code taxe 1"],
            adapter: value => {
                if (Siret.isSiret(value)) return "siret";
            },
        },
        idEtablissementBeneficiaire: {
            path: ["Code taxe 1"],
            adapter: value => {
                if (value) return new Siret(value);
            },
        },
        typeIdEntrepriseBeneficiaire: {
            path: ["Code taxe 1"],
            adapter: value => {
                if (Siret.isSiret(value)) return "siren";
            },
        },
        idEntrepriseBeneficiaire: {
            path: ["Code taxe 1"],
            adapter: value => {
                if (value) return new Siret(value).toSiren();
            },
        },
        amount: {
            path: ["Montant payé"],
            adapter: value => {
                if (!value || typeof value === "number") return value;

                return parseFloat(value.replaceAll(/[\r ]/, "").replace(",", "."));
            },
        },
        operationDate: {
            path: ["Date de dernière opération sur la DP"],
            adapter: value => {
                if (!value) return value;
                if (value != parseInt(value, 10).toString()) {
                    const [day, month, year] = value.split(/[/.]/).map(v => parseInt(v, 10));
                    return new Date(Date.UTC(year, month - 1, day));
                }
                return GenericParser.ExcelDateToJSDate(parseInt(value, 10));
            },
        },

        centreFinancierCode: {
            path: ["Centre financier CODE"],
        },
        centreFinancierLibelle: {
            path: ["Centre financier"],
        },
        attachementComptable: {
            path: ["Société"],
        },
        ej: {
            path: ["N° EJ"],
        },
        provider: {
            path: [],
            adapter: () => "chorus",
        },
    };

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

        // const chorusRawData = ;

        const rawDataWithDataBretagne: Omit<
            PaymentFlatEntity,
            "regionAttachementComptable" | "idVersement" | "uniqueId"
        > = {
            ...GenericParser.indexDataByPathObject(
                ChorusAdapter.chorusToPaymentFlatPath,
                chorusDocument.data as NestedDefaultObject<string>,
            ),
            programName: programEntity?.label_programme ?? null,
            programNumber: programCode,
            mission: programEntity?.mission ?? null,
            ministry: ministryEntity?.nom_ministere ?? null,
            ministryAcronym: ministryEntity?.sigle_ministere ?? null,
            actionCode,
            actionLabel: domaineFonctEntity?.libelle_action ?? null,
            activityCode,
            activityLabel: refProgrammationEntity?.libelle_activite ?? null,
        };

        const regionAttachementComptable = ChorusAdapter.getRegionAttachementComptable(
            rawDataWithDataBretagne.attachementComptable,
        );
        const idVersement = `${rawDataWithDataBretagne.idEtablissementBeneficiaire}-${rawDataWithDataBretagne.ej}-${rawDataWithDataBretagne.exerciceBudgetaire}`;
        const uniqueId = `${idVersement}-${
            rawDataWithDataBretagne.programNumber
        }-${actionCode}-${activityCode}-${rawDataWithDataBretagne.operationDate.getTime()}-${
            rawDataWithDataBretagne.attachementComptable
        }-${rawDataWithDataBretagne.centreFinancierCode}`;

        return {
            ...rawDataWithDataBretagne,
            regionAttachementComptable,
            idVersement,
            uniqueId,
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
