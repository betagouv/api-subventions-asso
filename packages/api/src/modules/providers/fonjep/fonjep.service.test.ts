import {
    ALLOCATOR,
    DISPOSITIF_ENTITIES,
    DISPOSITIF_ENTITY,
    INSTRUCTOR,
    POSTE_10006_ENTITY,
    POSTE_ENTITIES,
    POSTE_ENTITY,
    POSTE_WITHOUT_ASSOCIATION,
    TIERS_ENTITIES,
    TIERS_ENTITY,
    TYPE_POSTE_ENTITY,
    VERSEMENT_10006_ENTITY,
    VERSEMENT_ENTITIES,
    VERSEMENT_ENTITY,
    VERSEMENT_WITHOUT_ASSOCIATION,
    VERSEMENT_WITHOUT_POSITION,
} from "./__fixtures__/fonjepEntities";
import FonjepEntityMapper from "./mappers/fonjep-entity.mapper";
jest.mock("./mappers/fonjep-entity.mapper");
import fonjepTiersPort from "../../../dataProviders/db/providers/fonjep/fonjep.tiers.port";
import fonjepPostesPort from "../../../dataProviders/db/providers/fonjep/fonjep.postes.port";
import fonjepVersementsPort from "../../../dataProviders/db/providers/fonjep/fonjep.versements.port";
import fonjepTypePostePort from "../../../dataProviders/db/providers/fonjep/fonjep.typePoste.port";
import fonjepDispositifPort from "../../../dataProviders/db/providers/fonjep/fonjep.dispositif.port";
jest.mock("../../../dataProviders/db/providers/fonjep/fonjep.tiers.port");
jest.mock("../../../dataProviders/db/providers/fonjep/fonjep.postes.port");
jest.mock("../../../dataProviders/db/providers/fonjep/fonjep.versements.port");
jest.mock("../../../dataProviders/db/providers/fonjep/fonjep.typePoste.port");
jest.mock("../../../dataProviders/db/providers/fonjep/fonjep.dispositif.port");
import FonjepParser from "./fonjep.parser";
import fonjepService from "./fonjep.service";
import {
    DISPOSITIF_DTO,
    POSTE_DTO_WITH_DATE,
    TIER_DTO,
    TYPE_POSTE_DTO,
    VERSEMENT_DTO_WITH_DATE,
} from "./__fixtures__/fonjepDtos";
import FonjepVersementEntity from "./entities/FonjepVersementEntity";
import dataBretagneService from "../dataBretagne/dataBretagne.service";
import { DATA_BRETAGNE_RECORDS } from "../dataBretagne/__fixtures__/dataBretagne.fixture";
import { CHORUS_PAYMENT_FLAT_ENTITY } from "../../paymentFlat/__fixtures__/paymentFlatEntity.fixture";
import { APPLICATION_LINK_TO_FONJEP } from "../../applicationFlat/__fixtures__";
import { ReadableStream } from "node:stream/web";
import applicationFlatService from "../../applicationFlat/applicationFlat.service";
import * as NumberHelper from "../../../shared/helpers/NumberHelper";
import { FonjepApplicationFlatEntity } from "./entities/FonjepFlatEntity";
jest.mock("../../applicationFlat/applicationFlat.service");

const PARSED_DATA = {
    tiers: [TIER_DTO],
    postes: [POSTE_DTO_WITH_DATE],
    versements: [VERSEMENT_DTO_WITH_DATE],
    typePoste: [TYPE_POSTE_DTO],
    dispositifs: [DISPOSITIF_DTO],
};

const ENTITIES = {
    tierEntities: [TIERS_ENTITY],
    posteEntities: [POSTE_ENTITY],
    versementEntities: [VERSEMENT_ENTITY],
    typePosteEntities: [TYPE_POSTE_ENTITY],
    dispositifEntities: [DISPOSITIF_ENTITY],
};

const POSITIONS = [POSTE_ENTITY];
const THIRD_PARTIES = [TIERS_ENTITY, ALLOCATOR, INSTRUCTOR];

describe("FonjepService", () => {
    let mockParse: jest.SpyInstance;
    beforeAll(() => {
        mockParse = jest.spyOn(FonjepParser, "parse").mockReturnValue(PARSED_DATA);

        jest.mocked(FonjepEntityMapper.toFonjepTierEntity).mockReturnValue(TIERS_ENTITY);
        jest.mocked(FonjepEntityMapper.toFonjepPosteEntity).mockReturnValue(POSTE_ENTITY);
        jest.mocked(FonjepEntityMapper.toFonjepVersementEntity).mockReturnValue(VERSEMENT_ENTITY);
        jest.mocked(FonjepEntityMapper.toFonjepTypePosteEntity).mockReturnValue(TYPE_POSTE_ENTITY);
        jest.mocked(FonjepEntityMapper.toFonjepDispositifEntity).mockReturnValue(DISPOSITIF_ENTITY);
    });

    afterAll(() => {
        mockParse.mockRestore();
    });

    describe("fromFileToEntities", () => {
        const FILE_PATH = "/foo/bar";
        const EXPORT_DATE = new Date("2025-08-11");

        it("should call FonjepParser.parse with the given file path", () => {
            fonjepService.fromFileToEntities(FILE_PATH, EXPORT_DATE);
            expect(mockParse).toHaveBeenCalledWith(FILE_PATH);
        });

        it("should call toFonjepTierEntities the length of the parsed tiers", () => {
            fonjepService.fromFileToEntities(FILE_PATH, EXPORT_DATE);
            expect(FonjepEntityMapper.toFonjepTierEntity).toHaveBeenCalledTimes(PARSED_DATA.tiers.length);
        });

        it.each(PARSED_DATA.tiers)("should call toFonjepTierEntity with the given tier", tier => {
            fonjepService.fromFileToEntities(FILE_PATH, EXPORT_DATE);
            expect(FonjepEntityMapper.toFonjepTierEntity).toHaveBeenCalledWith(tier, EXPORT_DATE);
        });

        it("should call toFonjepPosteEntities the length of the parsed postes", () => {
            fonjepService.fromFileToEntities(FILE_PATH, EXPORT_DATE);
            expect(FonjepEntityMapper.toFonjepPosteEntity).toHaveBeenCalledTimes(PARSED_DATA.postes.length);
        });

        it.each(PARSED_DATA.postes)("should call toFonjepPosteEntity with the given poste", poste => {
            fonjepService.fromFileToEntities(FILE_PATH, EXPORT_DATE);
            expect(FonjepEntityMapper.toFonjepPosteEntity).toHaveBeenCalledWith(poste, EXPORT_DATE);
        });

        it("should call toFonjepVersementEntities the length of the parsed versements", () => {
            fonjepService.fromFileToEntities(FILE_PATH, EXPORT_DATE);
            expect(FonjepEntityMapper.toFonjepVersementEntity).toHaveBeenCalledTimes(PARSED_DATA.versements.length);
        });

        it.each(PARSED_DATA.versements)("should call toFonjepVersementEntity with the given versement", versement => {
            fonjepService.fromFileToEntities(FILE_PATH, EXPORT_DATE);
            expect(FonjepEntityMapper.toFonjepVersementEntity).toHaveBeenCalledWith(versement, EXPORT_DATE);
        });

        it("should call toFonjepTypePosteEntities the length of the parsed typePostes", () => {
            fonjepService.fromFileToEntities(FILE_PATH, EXPORT_DATE);
            expect(FonjepEntityMapper.toFonjepTypePosteEntity).toHaveBeenCalledTimes(PARSED_DATA.typePoste.length);
        });

        it.each(PARSED_DATA.typePoste)("should call toFonjepTypePosteEntity with the given typePoste", typePoste => {
            fonjepService.fromFileToEntities(FILE_PATH, EXPORT_DATE);
            expect(FonjepEntityMapper.toFonjepTypePosteEntity).toHaveBeenCalledWith(typePoste, EXPORT_DATE);
        });

        it("should call toFonjepDispositifEntities the length of the parsed dispositifs", () => {
            fonjepService.fromFileToEntities(FILE_PATH, EXPORT_DATE);
            expect(FonjepEntityMapper.toFonjepDispositifEntity).toHaveBeenCalledTimes(PARSED_DATA.dispositifs.length);
        });

        it.each(PARSED_DATA.dispositifs)(
            "should call toFonjepDispositifEntity with the given dispositif",
            dispositif => {
                fonjepService.fromFileToEntities(FILE_PATH, EXPORT_DATE);
                expect(FonjepEntityMapper.toFonjepDispositifEntity).toHaveBeenCalledWith(dispositif, EXPORT_DATE);
            },
        );

        it("should return the entities", () => {
            const actual = fonjepService.fromFileToEntities(FILE_PATH, EXPORT_DATE);
            const expected = ENTITIES;

            expect(actual).toEqual(expected);
        });
    });

    describe("useTemporyCollection", () => {
        it("should call useTemporyCollection on fonjepDispositifPort", () => {
            const active = true;
            fonjepService.useTemporyCollection(active);
            expect(fonjepDispositifPort.useTemporyCollection).toHaveBeenCalledWith(active);
        });

        it("should call useTemporyCollection on fonjepPostesPort", () => {
            const active = true;
            fonjepService.useTemporyCollection(active);
            expect(fonjepPostesPort.useTemporyCollection).toHaveBeenCalledWith(active);
        });

        it("should call useTemporyCollection on fonjepTiersPort", () => {
            const active = true;
            fonjepService.useTemporyCollection(active);
            expect(fonjepTiersPort.useTemporyCollection).toHaveBeenCalledWith(active);
        });

        it("should call useTemporyCollection on fonjepTypePostePort", () => {
            const active = true;
            fonjepService.useTemporyCollection(active);
            expect(fonjepTypePostePort.useTemporyCollection).toHaveBeenCalledWith(active);
        });

        it("should call useTemporyCollection on fonjepVersementsPort", () => {
            const active = true;
            fonjepService.useTemporyCollection(active);
            expect(fonjepVersementsPort.useTemporyCollection).toHaveBeenCalledWith(active);
        });
    });

    describe("createFonjepCollections", () => {
        it("should call insertMany on fonjepTiersPort with the given tierEntities", async () => {
            await fonjepService.createFonjepCollections(ENTITIES.tierEntities, [], [], [], []);
            expect(fonjepTiersPort.insertMany).toHaveBeenCalledWith(ENTITIES.tierEntities);
        });

        it("should call insertMany on fonjepPostesPort with the given posteEntities", async () => {
            await fonjepService.createFonjepCollections([], ENTITIES.posteEntities, [], [], []);
            expect(fonjepPostesPort.insertMany).toHaveBeenCalledWith(ENTITIES.posteEntities);
        });

        it("should call insertMany on fonjepVersementsPort with the given versementEntities", async () => {
            await fonjepService.createFonjepCollections([], [], ENTITIES.versementEntities, [], []);
            expect(fonjepVersementsPort.insertMany).toHaveBeenCalledWith(ENTITIES.versementEntities);
        });

        it("should call insertMany on fonjepTypePostePort with the given typePosteEntities", async () => {
            await fonjepService.createFonjepCollections([], [], [], ENTITIES.typePosteEntities, []);
            expect(fonjepTypePostePort.insertMany).toHaveBeenCalledWith(ENTITIES.typePosteEntities);
        });

        it("should call insertMany on fonjepDispositifPort with the given dispositifEntities", async () => {
            await fonjepService.createFonjepCollections([], [], [], [], ENTITIES.dispositifEntities);
            expect(fonjepDispositifPort.insertMany).toHaveBeenCalledWith(ENTITIES.dispositifEntities);
        });
    });

    describe("applyTemporyCollection", () => {
        it("should call applyTemporyCollection on fonjepDispositifPort", async () => {
            await fonjepService.applyTemporyCollection();
            expect(fonjepDispositifPort.applyTemporyCollection).toHaveBeenCalled();
        });

        it("should call applyTemporyCollection on fonjepPostesPort", async () => {
            await fonjepService.applyTemporyCollection();
            expect(fonjepPostesPort.applyTemporyCollection).toHaveBeenCalled();
        });

        it("should call applyTemporyCollection on fonjepTiersPort", async () => {
            await fonjepService.applyTemporyCollection();
            expect(fonjepTiersPort.applyTemporyCollection).toHaveBeenCalled();
        });

        it("should call applyTemporyCollection on fonjepTypePostePort", async () => {
            await fonjepService.applyTemporyCollection();
            expect(fonjepTypePostePort.applyTemporyCollection).toHaveBeenCalled();
        });

        it("should call applyTemporyCollection on fonjepVersementsPort", async () => {
            await fonjepService.applyTemporyCollection();
            expect(fonjepVersementsPort.applyTemporyCollection).toHaveBeenCalled();
        });
    });

    describe("isPaymentPayed", () => {
        const PARTIAL_PAYMENT = {
            montantPaye: 1000,
            dateVersement: new Date("2025-04-12"),
            periodeDebut: new Date("2025-01-13"),
        };
        it("return true if all payments properties defined", () => {
            const expected = true;
            // @ts-expect-error: test private method
            const actual = fonjepService.isPaymentPayed(PARTIAL_PAYMENT);
            expect(actual).toEqual(expected);
        });

        it.each`
            field
            ${"montantPaye"}
            ${"dateVersement"}
            ${"periodeDebut"}
        `("return false if $field is not defined", ({ field }) => {
            const expected = false;
            const payment = { ...PARTIAL_PAYMENT, [field]: undefined };
            // @ts-expect-error: test private method
            const actual = fonjepService.isPaymentPayed(payment);
            expect(actual).toEqual(expected);
        });
    });

    describe("validatePayment", () => {
        // @ts-expect-error: mock private method
        const mockIsPaymentPayed = jest.spyOn(fonjepService, "isPaymentPayed");

        beforeAll(() => {
            // @ts-expect-error: mock return value
            mockIsPaymentPayed.mockReturnValue(true);
        });

        afterEach(() => {
            mockIsPaymentPayed.mockClear();
        });

        it("return true if payment is payed and posteCode defined", () => {
            const expected = true;
            // @ts-expect-error: test private method
            const actual = fonjepService.validatePayment({ posteCode: "CODE_001" } as FonjepVersementEntity);
            expect(actual).toEqual(expected);
        });

        it("return false if payment is not payed", () => {
            // @ts-expect-error: mock return value
            mockIsPaymentPayed.mockReturnValueOnce(false);
            const expected = false;
            // @ts-expect-error: test private method
            const actual = fonjepService.validatePayment({ posteCode: "CODE_001" } as FonjepVersementEntity);
            expect(actual).toEqual(expected);
        });

        it("return false if codePoste is missing in payment", () => {
            const expected = false;
            // @ts-expect-error: test private method
            const actual = fonjepService.validatePayment({} as FonjepVersementEntity);
            expect(actual).toEqual(expected);
        });
    });

    describe("createPaymentFlatEntitiesFromCollections", () => {
        // @ts-expect-error: mock private method
        const mockValidatePayment: jest.SpyInstance<boolean> = jest.spyOn(fonjepService, "validatePayment");
        const mockGetAllDataRecords = jest.spyOn(dataBretagneService, "getAllDataRecords");
        const mockToFonjepPaymentFlat = jest.spyOn(FonjepEntityMapper, "toFonjepPaymentFlat");

        beforeAll(() => {
            mockValidatePayment.mockReturnValue(true);
            mockGetAllDataRecords.mockResolvedValue(DATA_BRETAGNE_RECORDS);
            // @ts-expect-error: mock adapter
            mockToFonjepPaymentFlat.mockImplementation(() => CHORUS_PAYMENT_FLAT_ENTITY);
        });

        afterAll(() => {
            [mockValidatePayment, mockGetAllDataRecords, mockToFonjepPaymentFlat].map(mock => mock.mockRestore());
        });

        it("validates payments", async () => {
            await fonjepService.createPaymentFlatEntitiesFromCollections({
                thirdParties: TIERS_ENTITIES,
                positions: POSTE_ENTITIES,
                payments: VERSEMENT_ENTITIES,
            });

            VERSEMENT_ENTITIES.forEach((entity, index) => {
                expect(mockValidatePayment).toHaveBeenNthCalledWith(index + 1, entity);
            });
        });

        it("exclude payment if no position found", async () => {
            const PAYMENTS = [VERSEMENT_ENTITY, VERSEMENT_WITHOUT_POSITION];
            const actual = await fonjepService.createPaymentFlatEntitiesFromCollections({
                thirdParties: TIERS_ENTITIES,
                positions: POSTE_ENTITIES,
                payments: [VERSEMENT_ENTITY, VERSEMENT_WITHOUT_POSITION],
            });

            expect(actual.length).toEqual(PAYMENTS.length - 1);
        });

        it("exclude payment if no thirdParty found", async () => {
            const PAYMENTS = [VERSEMENT_ENTITY, VERSEMENT_WITHOUT_ASSOCIATION];
            const actual = await fonjepService.createPaymentFlatEntitiesFromCollections({
                thirdParties: TIERS_ENTITIES,
                positions: [...POSTE_ENTITIES, POSTE_WITHOUT_ASSOCIATION],
                payments: PAYMENTS,
            });

            expect(actual.length).toEqual(PAYMENTS.length - 1);
        });

        it("exclude payments with financeurPrincipalCode 10006", async () => {
            const PAYMENTS = [VERSEMENT_ENTITY, VERSEMENT_10006_ENTITY];
            const actual = await fonjepService.createPaymentFlatEntitiesFromCollections({
                thirdParties: TIERS_ENTITIES,
                positions: [...POSTE_ENTITIES, POSTE_10006_ENTITY],
                payments: PAYMENTS,
            });

            expect(actual.length).toEqual(PAYMENTS.length - 1);
        });

        it("fetches data bretagne records", () => {
            fonjepService.createPaymentFlatEntitiesFromCollections({
                thirdParties: TIERS_ENTITIES,
                positions: POSTE_ENTITIES,
                payments: [VERSEMENT_ENTITY],
            });

            expect(mockGetAllDataRecords).toHaveBeenCalled();
        });

        it("adapts payments to payments flat", async () => {
            await fonjepService.createPaymentFlatEntitiesFromCollections({
                thirdParties: TIERS_ENTITIES,
                positions: POSTE_ENTITIES,
                payments: [VERSEMENT_ENTITY],
            });

            expect(mockToFonjepPaymentFlat).toHaveBeenCalledWith(
                {
                    payment: VERSEMENT_ENTITY,
                    position: POSTE_ENTITIES[0], // matches entity.codePoste
                    thirdParty: TIERS_ENTITIES[0], // matches entity.codePoste
                },
                DATA_BRETAGNE_RECORDS,
            );
        });

        it("returns payments flat", async () => {
            const actual = await fonjepService.createPaymentFlatEntitiesFromCollections({
                thirdParties: TIERS_ENTITIES,
                positions: POSTE_ENTITIES,
                payments: [VERSEMENT_ENTITY],
            });
            expect(actual).toMatchSnapshot();
        });
    });

    describe("Application Flat", () => {
        const FALSE_DUPLICATE_APPLICATION = {
            ...APPLICATION_LINK_TO_FONJEP,
            grantedAmount: 9000,
            requestedAmount: 9000,
            totalAmount: 9000,
        };
        const OTHER_APPLICATION = { ...APPLICATION_LINK_TO_FONJEP, uniqueId: "otherId" };
        const APPLICATIONS = [
            APPLICATION_LINK_TO_FONJEP as FonjepApplicationFlatEntity,
            FALSE_DUPLICATE_APPLICATION as FonjepApplicationFlatEntity,
            OTHER_APPLICATION as FonjepApplicationFlatEntity,
        ];
        const GROUPED_APPLICATIONS = {
            [APPLICATION_LINK_TO_FONJEP.uniqueId]: [APPLICATION_LINK_TO_FONJEP, FALSE_DUPLICATE_APPLICATION],
            [OTHER_APPLICATION.uniqueId]: [OTHER_APPLICATION],
        };

        describe("createApplicationFlatEntitiesFromCollections", () => {
            const POSITIONS = [POSTE_ENTITY];
            const THIRD_PARTIES = [TIERS_ENTITY, ALLOCATOR, INSTRUCTOR];

            beforeAll(() => {
                jest.mocked(FonjepEntityMapper.toFonjepApplicationFlat).mockReturnValue(
                    APPLICATION_LINK_TO_FONJEP as FonjepApplicationFlatEntity,
                );
            });

            it("uses adapter to create application from collections", () => {
                fonjepService.createApplicationFlatEntitiesFromCollections({
                    positions: POSITIONS,
                    thirdParties: THIRD_PARTIES,
                    schemes: DISPOSITIF_ENTITIES,
                });

                expect(FonjepEntityMapper.toFonjepApplicationFlat).toHaveBeenCalledWith({
                    position: POSTE_ENTITY,
                    beneficiary: TIERS_ENTITY,
                    allocator: ALLOCATOR,
                    instructor: INSTRUCTOR,
                    scheme: DISPOSITIF_ENTITIES[0],
                });
            });

            it("creates application flat for each position", () => {
                const actual = fonjepService.createApplicationFlatEntitiesFromCollections({
                    positions: POSITIONS,
                    thirdParties: THIRD_PARTIES,
                    schemes: DISPOSITIF_ENTITIES,
                });

                expect(actual).toEqual([{ ...APPLICATION_LINK_TO_FONJEP, updateDate: expect.any(Date) }]);
            });
        });

        describe("addToApplicationFlat", () => {
            const COLLECTIONS = {
                positions: POSITIONS,
                thirdParties: THIRD_PARTIES,
                schemes: DISPOSITIF_ENTITIES,
            };
            const AGGREGATED_APPLICATIONS = [APPLICATION_LINK_TO_FONJEP as FonjepApplicationFlatEntity];
            let mockCreateApplicationFlat: jest.SpyInstance;
            let mocksaveApplicationsFromStream: jest.SpyInstance;
            let mockProcessDuplicates: jest.SpyInstance;

            beforeEach(() => {
                mockCreateApplicationFlat = jest
                    .spyOn(fonjepService, "createApplicationFlatEntitiesFromCollections")
                    .mockReturnValue(APPLICATIONS);
                mockProcessDuplicates = jest
                    .spyOn(fonjepService, "processDuplicates")
                    .mockReturnValue(AGGREGATED_APPLICATIONS);
                mocksaveApplicationsFromStream = jest
                    .spyOn(fonjepService, "saveApplicationsFromStream")
                    .mockImplementation(jest.fn());
            });

            afterAll(() => {
                mockCreateApplicationFlat.mockRestore();
                mocksaveApplicationsFromStream.mockRestore();
                mockProcessDuplicates.mockRestore();
            });

            it("creates applications flat from collections", () => {
                fonjepService.addToApplicationFlat(COLLECTIONS);
                expect(mockCreateApplicationFlat).toHaveBeenCalledWith(COLLECTIONS);
            });

            it("aggregates applications by unique id to sum amount", () => {
                fonjepService.addToApplicationFlat(COLLECTIONS);
                expect(mockProcessDuplicates).toHaveBeenCalledWith(APPLICATIONS);
            });

            it("sends ApplicationFlat stream to be processed", async () => {
                fonjepService.addToApplicationFlat(COLLECTIONS);

                expect(mocksaveApplicationsFromStream).toHaveBeenCalledWith(expect.any(ReadableStream));
            });
        });

        describe("groupApplicationsByUniqueId", () => {
            it("groups applications by uniqueId", () => {
                const expected = GROUPED_APPLICATIONS;
                // @ts-expect-error: test private method
                const actual = fonjepService.groupApplicationsByUniqueId(APPLICATIONS);
                expect(actual).toEqual(expected);
            });
        });

        describe("aggregateApplications", () => {
            const AGGREGATED_AMOUNT = 25000;

            beforeEach(() => {
                jest.spyOn(NumberHelper, "addWithNull").mockReturnValue(AGGREGATED_AMOUNT);
            });

            it("sums applications grantedAmount", () => {
                const APPLICATIONS = [APPLICATION_LINK_TO_FONJEP, FALSE_DUPLICATE_APPLICATION];
                const expected = {
                    ...APPLICATIONS[0],
                    grantedAmount: AGGREGATED_AMOUNT,
                    requestedAmount: AGGREGATED_AMOUNT,
                    totalAmount: AGGREGATED_AMOUNT,
                };
                // @ts-expect-error: test private method
                const actual = fonjepService.aggregateApplications(APPLICATIONS);
                expect(actual).toEqual(expected);
            });
        });

        describe("processDuplicates", () => {
            let mockGroupApplicationsByUniqueId: jest.SpyInstance;
            let mockAggregateApplications: jest.SpyInstance;

            beforeEach(() => {
                mockGroupApplicationsByUniqueId = jest
                    // @ts-expect-error: mock private method
                    .spyOn(fonjepService, "groupApplicationsByUniqueId")
                    // @ts-expect-error: mock return value
                    .mockReturnValue(GROUPED_APPLICATIONS);
                mockAggregateApplications = jest
                    // @ts-expect-error: mock private method
                    .spyOn(fonjepService, "aggregateApplications")
                    // @ts-expect-error: mock return value
                    .mockReturnValue(APPLICATION_LINK_TO_FONJEP);
            });

            afterAll(() => {
                mockGroupApplicationsByUniqueId.mockRestore();
                mockAggregateApplications.mockRestore();
            });

            it("get grouped applications by uniqueId", () => {
                fonjepService.processDuplicates(APPLICATIONS);
                expect(mockGroupApplicationsByUniqueId).toHaveBeenCalledWith(APPLICATIONS);
            });

            it("aggregates each group", () => {
                fonjepService.processDuplicates(APPLICATIONS);
                expect(mockAggregateApplications).toHaveBeenCalledTimes(Object.values(GROUPED_APPLICATIONS).length);
            });

            it("returns aggregated applications", () => {
                mockAggregateApplications.mockReturnValueOnce(APPLICATION_LINK_TO_FONJEP);
                mockAggregateApplications.mockReturnValueOnce(OTHER_APPLICATION);

                const expected = [APPLICATION_LINK_TO_FONJEP, OTHER_APPLICATION];
                const actual = fonjepService.processDuplicates(APPLICATIONS);
                expect(actual).toEqual(expected);
            });
        });

        describe("saveApplicationsFromStream", () => {
            it("calls applicationFlatService.saveFromStream", () => {
                const STREAM = ReadableStream.from([APPLICATION_LINK_TO_FONJEP]);
                fonjepService.saveApplicationsFromStream(STREAM);
                expect(applicationFlatService.saveFromStream).toHaveBeenCalledWith(STREAM);
            });
        });
    });
});
