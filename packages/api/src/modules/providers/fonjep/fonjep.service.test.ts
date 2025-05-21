import {
    DISPOSITIF_ENTITY,
    POSTE_10006_ENTITY,
    POSTE_ENTITIES,
    POSTE_ENTITY,
    TIERS_ENTITIES,
    TIERS_ENTITY,
    TYPE_POSTE_ENTITY,
    VERSEMENT_10006_ENTITY,
    VERSEMENT_ENTITIES,
    VERSEMENT_ENTITY,
} from "./__fixtures__/fonjepEntities";
import FonjepEntityAdapter from "./adapters/FonjepEntityAdapter";
jest.mock("./adapters/FonjepEntityAdapter");
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
import paymentFlatService from "../../paymentFlat/paymentFlat.service";
import { DATA_BRETAGNE_RECORDS } from "../dataBretagne/__fixtures__/dataBretagne.fixture";
import { CHORUS_PAYMENT_FLAT_ENTITY } from "../../paymentFlat/__fixtures__/paymentFlatEntity.fixture";

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

describe("FonjepService", () => {
    let mockParse: jest.SpyInstance;
    beforeAll(() => {
        mockParse = jest.spyOn(FonjepParser, "parse").mockReturnValue(PARSED_DATA);

        jest.mocked(FonjepEntityAdapter.toFonjepTierEntity).mockReturnValue(TIERS_ENTITY);
        jest.mocked(FonjepEntityAdapter.toFonjepPosteEntity).mockReturnValue(POSTE_ENTITY);
        jest.mocked(FonjepEntityAdapter.toFonjepVersementEntity).mockReturnValue(VERSEMENT_ENTITY);
        jest.mocked(FonjepEntityAdapter.toFonjepTypePosteEntity).mockReturnValue(TYPE_POSTE_ENTITY);
        jest.mocked(FonjepEntityAdapter.toFonjepDispositifEntity).mockReturnValue(DISPOSITIF_ENTITY);
    });

    afterAll(() => {
        mockParse.mockRestore();
    });

    describe("fromFileToEntities", () => {
        it("should call FonjepParser.parse with the given file path", () => {
            const filePath = "filePath";
            fonjepService.fromFileToEntities(filePath);
            expect(mockParse).toHaveBeenCalledWith(filePath);
        });

        it("should call toFonjepTierEntities the length of the parsed tiers", () => {
            fonjepService.fromFileToEntities("filePath");
            expect(FonjepEntityAdapter.toFonjepTierEntity).toHaveBeenCalledTimes(PARSED_DATA.tiers.length);
        });

        it.each(PARSED_DATA.tiers)("should call toFonjepTierEntity with the given tier", tier => {
            fonjepService.fromFileToEntities("filePath");
            expect(FonjepEntityAdapter.toFonjepTierEntity).toHaveBeenCalledWith(tier);
        });

        it("should call toFonjepPosteEntities the length of the parsed postes", () => {
            fonjepService.fromFileToEntities("filePath");
            expect(FonjepEntityAdapter.toFonjepPosteEntity).toHaveBeenCalledTimes(PARSED_DATA.postes.length);
        });

        it.each(PARSED_DATA.postes)("should call toFonjepPosteEntity with the given poste", poste => {
            fonjepService.fromFileToEntities("filePath");
            expect(FonjepEntityAdapter.toFonjepPosteEntity).toHaveBeenCalledWith(poste);
        });

        it("should call toFonjepVersementEntities the length of the parsed versements", () => {
            fonjepService.fromFileToEntities("filePath");
            expect(FonjepEntityAdapter.toFonjepVersementEntity).toHaveBeenCalledTimes(PARSED_DATA.versements.length);
        });

        it.each(PARSED_DATA.versements)("should call toFonjepVersementEntity with the given versement", versement => {
            fonjepService.fromFileToEntities("filePath");
            expect(FonjepEntityAdapter.toFonjepVersementEntity).toHaveBeenCalledWith(versement);
        });

        it("should call toFonjepTypePosteEntities the length of the parsed typePostes", () => {
            fonjepService.fromFileToEntities("filePath");
            expect(FonjepEntityAdapter.toFonjepTypePosteEntity).toHaveBeenCalledTimes(PARSED_DATA.typePoste.length);
        });

        it.each(PARSED_DATA.typePoste)("should call toFonjepTypePosteEntity with the given typePoste", typePoste => {
            fonjepService.fromFileToEntities("filePath");
            expect(FonjepEntityAdapter.toFonjepTypePosteEntity).toHaveBeenCalledWith(typePoste);
        });

        it("should call toFonjepDispositifEntities the length of the parsed dispositifs", () => {
            fonjepService.fromFileToEntities("filePath");
            expect(FonjepEntityAdapter.toFonjepDispositifEntity).toHaveBeenCalledTimes(PARSED_DATA.dispositifs.length);
        });

        it.each(PARSED_DATA.dispositifs)(
            "should call toFonjepDispositifEntity with the given dispositif",
            dispositif => {
                fonjepService.fromFileToEntities("filePath");
                expect(FonjepEntityAdapter.toFonjepDispositifEntity).toHaveBeenCalledWith(dispositif);
            },
        );

        it("should return the entities", () => {
            const actual = fonjepService.fromFileToEntities("filePath");
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
        const mockToFonjepPaymentFlat = jest.spyOn(FonjepEntityAdapter, "toFonjepPaymentFlat");
        const mockUpsertMay = jest.spyOn(paymentFlatService, "upsertMany");

        beforeAll(() => {
            mockValidatePayment.mockReturnValue(true);
            mockGetAllDataRecords.mockResolvedValue(DATA_BRETAGNE_RECORDS);
            // @ts-expect-error: mock adapter
            mockToFonjepPaymentFlat.mockImplementation(() => CHORUS_PAYMENT_FLAT_ENTITY);
            mockUpsertMay.mockImplementation(jest.fn());
        });

        afterEach(() => {
            [mockUpsertMay, mockToFonjepPaymentFlat].map(mock => mock.mockClear());
        });

        afterAll(() => {
            [mockValidatePayment, mockGetAllDataRecords, mockToFonjepPaymentFlat, mockUpsertMay].map(mock =>
                mock.mockRestore(),
            );
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

        it("excluse payments with financeurPrincipalCode 10006", async () => {
            await fonjepService.createPaymentFlatEntitiesFromCollections({
                thirdParties: TIERS_ENTITIES,
                positions: [...POSTE_ENTITIES, POSTE_10006_ENTITY],
                payments: [...VERSEMENT_ENTITIES, VERSEMENT_10006_ENTITY],
            });

            expect(mockUpsertMay.mock.calls[0][0].length).toEqual(VERSEMENT_ENTITIES.length);
        });

        it("fetches data bretagne records", () => {
            fonjepService.createPaymentFlatEntitiesFromCollections({
                thirdParties: TIERS_ENTITIES,
                positions: POSTE_ENTITIES,
                payments: VERSEMENT_ENTITIES,
            });

            expect(mockGetAllDataRecords).toHaveBeenCalled();
        });

        it("adapts payments to payments flat", async () => {
            await fonjepService.createPaymentFlatEntitiesFromCollections({
                thirdParties: TIERS_ENTITIES,
                positions: POSTE_ENTITIES,
                payments: VERSEMENT_ENTITIES,
            });

            VERSEMENT_ENTITIES.forEach((entity, index) => {
                expect(mockToFonjepPaymentFlat).toHaveBeenNthCalledWith(
                    index + 1,
                    {
                        payment: entity,
                        position: POSTE_ENTITIES[index], // matches entity.codePoste
                        thirdParty: TIERS_ENTITIES[index], // matches entity.codePoste
                    },
                    DATA_BRETAGNE_RECORDS,
                );
            });
        });

        it("persist payments flat in database", async () => {
            await fonjepService.createPaymentFlatEntitiesFromCollections({
                thirdParties: TIERS_ENTITIES,
                positions: POSTE_ENTITIES,
                payments: VERSEMENT_ENTITIES,
            });

            // adapter has been mocked to return entity to simplify test
            expect(mockUpsertMay).toHaveBeenCalledWith(VERSEMENT_ENTITIES.map(() => CHORUS_PAYMENT_FLAT_ENTITY));
        });

        it("filter valid payments", async () => {
            await fonjepService.createPaymentFlatEntitiesFromCollections({
                thirdParties: TIERS_ENTITIES,
                positions: POSTE_ENTITIES,
                payments: [
                    ...VERSEMENT_ENTITIES,
                    {
                        posteCode: "Code_NO_MATCH",
                        periodeDebut: new Date("2022-01-12"),
                        periodeFin: new Date("2022-12-14"),
                        dateVersement: new Date("2022-04-15"),
                        montantAPayer: 1000,
                        montantPaye: 1000,
                    },
                ],
            });

            expect(mockToFonjepPaymentFlat).toHaveBeenCalledTimes(VERSEMENT_ENTITIES.length);
        });
    });
});
