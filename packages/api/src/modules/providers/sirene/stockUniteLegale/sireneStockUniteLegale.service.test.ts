import sireneStockUniteLegaleDbPort from "../../../../dataProviders/db/sirene/stockUniteLegale/sireneStockUniteLegale.port";
import { SireneUniteLegaleDbo } from "./@types/SireneUniteLegaleDbo";
import sireneStockUniteLegaleService from "./sireneStockUniteLegale.service";
import { SireneStockUniteLegaleEntity } from "../../../../entities/SireneStockUniteLegaleEntity";
import UniteLegalNameEntity from "../../../../entities/UniteLegalNameEntity";
import SireneStockUniteLegaleAdapter from "./adapter/sireneStockUniteLegale.adapter";
import uniteLegalNameService from "../../uniteLegalName/uniteLegal.name.service";
import { UniteLegalEntrepriseEntity } from "../../../../entities/UniteLegalEntrepriseEntity";
import uniteLegalEntreprisesService from "../../uniteLegalEntreprises/uniteLegal.entreprises.service";
import { InsertManyResult } from "mongodb";

const mockUniteLegalEntrepriseConstructor = jest.fn();

jest.mock("./adapter/sireneStockUniteLegale.adapter");
jest.mock("../../uniteLegalEntreprises/uniteLegal.entreprises.service");
jest.mock("../../uniteLegalName/uniteLegal.name.service");
jest.mock("../../../../entities/UniteLegalEntrepriseEntity", () => ({
    UniteLegalEntrepriseEntity: class Mock {
        constructor(public i) {
            mockUniteLegalEntrepriseConstructor(i);
        }
    },
}));

jest.mock("node-stream-zip", () => {
    const mockExtract = jest.fn();
    const mockClose = jest.fn();

    return {
        async: jest.fn(() => ({
            extract: mockExtract,
            close: mockClose,
        })),
    };
});

jest.mock("fs", () => {
    const actualFs = jest.requireActual("fs");
    return {
        ...actualFs,
        mkdtempSync: jest.fn(),
        createWriteStream: jest.fn(),
        existsSync: jest.fn(),
        rmSync: jest.fn(),
    };
});

describe("SireneStockUniteLegaleService", () => {
    describe("insertOne", () => {
        let insertOneMock: jest.SpyInstance;
        beforeAll(() => {
            insertOneMock = jest.spyOn(sireneStockUniteLegaleDbPort, "insertOne").mockImplementation(jest.fn());
        });
        afterAll(() => {
            jest.restoreAllMocks();
        });

        it("should call insertOne", async () => {
            const dbo = { siren: "123456789" } as unknown as SireneUniteLegaleDbo;
            await sireneStockUniteLegaleService.insertOne(dbo);
            expect(insertOneMock).toHaveBeenCalledWith(dbo);
        });
    });

    describe("insertMany", () => {
        let insertManyMock: jest.SpyInstance;
        beforeAll(() => {
            insertManyMock = jest.spyOn(sireneStockUniteLegaleDbPort, "insertMany").mockImplementation(jest.fn());
        });
        afterAll(() => {
            jest.restoreAllMocks();
        });

        it("should call insertMany", async () => {
            const dbos = [{ siren: "123456789" }] as unknown as SireneUniteLegaleDbo[];
            await sireneStockUniteLegaleService.insertMany(dbos);
            expect(insertManyMock).toHaveBeenCalledWith(dbos);
        });
    });

    describe("saveBatchAssoData", () => {
        const BATCH = [1, 2] as unknown as SireneStockUniteLegaleEntity[];
        const ADAPTED_NAME_BATCH = ["one", "two"] as unknown as UniteLegalNameEntity[];
        let insertSpy: jest.SpyInstance;

        beforeAll(() => {
            insertSpy = jest
                .spyOn(sireneStockUniteLegaleService, "insertMany")
                .mockResolvedValue("" as unknown as InsertManyResult<SireneUniteLegaleDbo>);

            jest.mocked(SireneStockUniteLegaleAdapter.entityToDbo).mockImplementation(
                i => i.toString() as unknown as SireneUniteLegaleDbo,
            );
        });
        afterAll(() => insertSpy.mockRestore());

        it("calls adapter to name", async () => {
            await sireneStockUniteLegaleService._saveBatchAssoData(BATCH);
            expect(SireneStockUniteLegaleAdapter.entityToUniteLegaleNameEntity).toHaveBeenCalledWith(1);
            expect(SireneStockUniteLegaleAdapter.entityToUniteLegaleNameEntity).toHaveBeenCalledWith(2);
        });

        it("saves sirene entity", async () => {
            await sireneStockUniteLegaleService._saveBatchAssoData(BATCH);
            expect(insertSpy).toHaveBeenCalledWith(BATCH);
        });

        it("saves name entity", async () => {
            jest.mocked(SireneStockUniteLegaleAdapter.entityToUniteLegaleNameEntity).mockReturnValueOnce(
                "one" as unknown as UniteLegalNameEntity,
            );
            jest.mocked(SireneStockUniteLegaleAdapter.entityToUniteLegaleNameEntity).mockReturnValueOnce(
                "two" as unknown as UniteLegalNameEntity,
            );

            await sireneStockUniteLegaleService._saveBatchAssoData(BATCH);
            expect(uniteLegalNameService.upsertMany).toHaveBeenCalledWith(ADAPTED_NAME_BATCH);
        });
    });

    describe("saveBatchNonAssoData", () => {
        const BATCH = [{ siren: 1 }, { siren: 2 }] as unknown as SireneStockUniteLegaleEntity[];
        const ADAPTED_ENTITY_BATCH = [{ i: 1 }, { i: 2 }] as unknown as UniteLegalEntrepriseEntity;

        it("adapt to entreprise entity", async () => {
            await sireneStockUniteLegaleService._saveBatchNonAssoData(BATCH);
            expect(mockUniteLegalEntrepriseConstructor).toHaveBeenCalledWith(2);
            expect(mockUniteLegalEntrepriseConstructor).toHaveBeenCalledWith(1);
        });

        it("save entreprise entity", async () => {
            await sireneStockUniteLegaleService._saveBatchNonAssoData(BATCH);
            expect(uniteLegalEntreprisesService.insertManyEntrepriseSiren).toHaveBeenCalledWith(ADAPTED_ENTITY_BATCH);
        });
    });
});
