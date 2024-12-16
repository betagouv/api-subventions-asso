import {
    DISPOSITIF_ENTITY,
    POSTE_ENTITY,
    TIER_ENTITY,
    TYPE_POSTE_ENTITY,
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
import { cp } from "fs";

const MAPPED_DATA_ELEMENT = [
    { foo: "foo1", bar: "bar1" },
    { foo: "foo2", bar: "bar2" },
];

const MAPPED_DATA = [
    MAPPED_DATA_ELEMENT,
    MAPPED_DATA_ELEMENT,
    MAPPED_DATA_ELEMENT,
    MAPPED_DATA_ELEMENT,
    MAPPED_DATA_ELEMENT,
];

const PARSED_DATA = {
    tiers: MAPPED_DATA_ELEMENT,
    postes: MAPPED_DATA_ELEMENT,
    versements: MAPPED_DATA_ELEMENT,
    typePoste: MAPPED_DATA_ELEMENT,
    dispositifs: MAPPED_DATA_ELEMENT,
};

const ENTITIES = {
    tierEntities: [TIER_ENTITY, TIER_ENTITY],
    posteEntities: [POSTE_ENTITY, POSTE_ENTITY],
    versementEntities: [VERSEMENT_ENTITY, VERSEMENT_ENTITY],
    typePosteEntities: [TYPE_POSTE_ENTITY, TYPE_POSTE_ENTITY],
    dispositifEntities: [DISPOSITIF_ENTITY, DISPOSITIF_ENTITY],
};

describe("FonjepService", () => {
    let mockParse: jest.SpyInstance;
    beforeAll(() => {
        mockParse = jest.spyOn(FonjepParser, "parse").mockReturnValue(PARSED_DATA);

        jest.mocked(FonjepEntityAdapter.toFonjepTierEntity).mockReturnValue(TIER_ENTITY);
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
});
