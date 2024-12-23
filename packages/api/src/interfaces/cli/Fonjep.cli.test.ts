import FonjepCli from "./Fonjep.cli";
import {
    DISPOSITIF_ENTITY,
    POSTE_ENTITY,
    TIER_ENTITY,
    TYPE_POSTE_ENTITY,
    VERSEMENT_ENTITY,
} from "../../modules/providers/fonjep/__fixtures__/fonjepEntities";
import fonjepService from "../../modules/providers/fonjep/fonjep.service";
jest.mock("../../modules/providers/fonjep/fonjep.service");

const ENTITIES = {
    tierEntities: [TIER_ENTITY, TIER_ENTITY],
    posteEntities: [POSTE_ENTITY, POSTE_ENTITY],
    versementEntities: [VERSEMENT_ENTITY, VERSEMENT_ENTITY],
    typePosteEntities: [TYPE_POSTE_ENTITY, TYPE_POSTE_ENTITY],
    dispositifEntities: [DISPOSITIF_ENTITY, DISPOSITIF_ENTITY],
};

const FILEPATH = "file.xlsx";
const EXPORT_DATE = new Date();
const LOGS = [];
describe("FonjepCli", () => {
    beforeAll(() => {
        jest.mocked(fonjepService.fromFileToEntities).mockReturnValue(ENTITIES);
    });
    const cli = new FonjepCli();
    describe("_parse()", () => {
        it("should call fromFileToEntities with the right arguments", async () => {
            // @ts-expect-error: test private method
            await cli._parse(FILEPATH, LOGS, EXPORT_DATE);
            expect(fonjepService.fromFileToEntities).toHaveBeenCalledWith(FILEPATH);
        });

        it("should call useTemporyCollection with true", async () => {
            // @ts-expect-error: test private method
            await cli._parse(FILEPATH, LOGS, EXPORT_DATE);
            expect(fonjepService.useTemporyCollection).toHaveBeenCalledWith(true);
        });

        it("should call createFonjepCollections with the right arguments", async () => {
            // @ts-expect-error: test private method
            await cli._parse(FILEPATH, LOGS, EXPORT_DATE);
            expect(fonjepService.createFonjepCollections).toHaveBeenCalledWith(
                ENTITIES.tierEntities,
                ENTITIES.posteEntities,
                ENTITIES.versementEntities,
                ENTITIES.typePosteEntities,
                ENTITIES.dispositifEntities,
            );
        });

        it("should call applyTemporyCollection", async () => {
            // @ts-expect-error: test private method
            await cli._parse(FILEPATH, LOGS, EXPORT_DATE);
            expect(fonjepService.applyTemporyCollection).toHaveBeenCalled();
        });
    });
});
