import fonjepService from "../../modules/providers/fonjep/fonjep.service";

describe("FonjepCli", () => {
    const fromFileToEntitiesMock = jest.spyOn(fonjepService, "fromFileToEntities");
    const useTemporyCollectionMock = jest.spyOn(fonjepService, "useTemporyCollection");
    const createFonjepCollectionsMock = jest.spyOn(fonjepService, "createFonjepCollections");
    const applyTemporyCollectionMock = jest.spyOn(fonjepService, "applyTemporyCollection");

    describe("_parse()", () => {});
});
