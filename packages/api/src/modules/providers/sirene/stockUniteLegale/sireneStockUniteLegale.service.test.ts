import sireneStockUniteLegaleDbPort from "../../../../dataProviders/db/sirene/stockUniteLegale/sireneStockUniteLegale.port";
import { SireneUniteLegaleDbo } from "./@types/SireneUniteLegaleDbo";
import sireneStockUniteLegaleService from "./sireneStockUniteLegale.service";
import { SireneStockUniteLegaleEntity } from "../../../../entities/SireneStockUniteLegaleEntity";
import UniteLegalNameEntity from "../../../../entities/UniteLegalNameEntity";
import SireneStockUniteLegaleMapper from "./mappers/sirene-stock-unite-legale.mapper";
import uniteLegalNameService from "../../uniteLegalName/uniteLegal.name.service";
import { UniteLegalEntrepriseEntity } from "../../../../entities/UniteLegalEntrepriseEntity";
import uniteLegalEntreprisesService from "../../uniteLegalEntreprises/uniteLegal.entreprises.service";
import { BulkWriteResult } from "mongodb";
import Siren from "../../../../identifierObjects/Siren";

const mockUniteLegalEntrepriseConstructor = jest.fn();

jest.mock("./mappers/sirene-stock-unite-legale.mapper");
jest.mock("../../uniteLegalEntreprises/uniteLegal.entreprises.service");
jest.mock("../../uniteLegalName/uniteLegal.name.service");
jest.mock("../../../../entities/UniteLegalEntrepriseEntity", () => ({
    UniteLegalEntrepriseEntity: class Mock {
        constructor(public i) {
            mockUniteLegalEntrepriseConstructor(i);
        }
    },
}));
jest.mock("../../../../dataProviders/db/sirene/stockUniteLegale/sireneStockUniteLegale.port");

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
        it("should call insertOne", async () => {
            const entity = { siren: new Siren("123456789") } as unknown as SireneStockUniteLegaleEntity;
            await sireneStockUniteLegaleService.insertOne(entity);
            expect(sireneStockUniteLegaleDbPort.insertOne).toHaveBeenCalledWith(entity);
        });
    });

    describe("insertMany", () => {
        it("should call upsertMany", async () => {
            const entities = [{ siren: new Siren("123456789") }] as unknown as SireneStockUniteLegaleEntity[];
            await sireneStockUniteLegaleService.upsertMany(entities);
            expect(sireneStockUniteLegaleDbPort.upsertMany).toHaveBeenCalledWith(entities);
        });
    });

    describe("saveBatchAssoData", () => {
        const BATCH = [1, 2] as unknown as SireneStockUniteLegaleEntity[];
        const ADAPTED_NAME_BATCH = ["one", "two"] as unknown as UniteLegalNameEntity[];
        let insertSpy: jest.SpyInstance;

        beforeAll(() => {
            insertSpy = jest
                .spyOn(sireneStockUniteLegaleService, "upsertMany")
                .mockResolvedValue("" as unknown as BulkWriteResult);

            jest.mocked(SireneStockUniteLegaleMapper.entityToDbo).mockImplementation(
                i => i.toString() as unknown as SireneUniteLegaleDbo,
            );
        });
        afterAll(() => insertSpy.mockRestore());

        it("calls adapter to name", async () => {
            await sireneStockUniteLegaleService._saveBatchAssoData(BATCH);
            expect(SireneStockUniteLegaleMapper.entityToUniteLegaleNameEntity).toHaveBeenCalledWith(1);
            expect(SireneStockUniteLegaleMapper.entityToUniteLegaleNameEntity).toHaveBeenCalledWith(2);
        });

        it("saves sirene entity", async () => {
            await sireneStockUniteLegaleService._saveBatchAssoData(BATCH);
            expect(insertSpy).toHaveBeenCalledWith(BATCH);
        });

        it("saves name entity", async () => {
            jest.mocked(SireneStockUniteLegaleMapper.entityToUniteLegaleNameEntity).mockReturnValueOnce(
                "one" as unknown as UniteLegalNameEntity,
            );
            jest.mocked(SireneStockUniteLegaleMapper.entityToUniteLegaleNameEntity).mockReturnValueOnce(
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

    describe("findOneBySiren", () => {
        const SIREN = new Siren("123456789");

        it("should call port", async () => {
            await sireneStockUniteLegaleService.findOneBySiren(SIREN);
            expect(sireneStockUniteLegaleDbPort.findOneBySiren).toHaveBeenCalledWith(SIREN);
        });

        it("should return res from port", async () => {
            const expected = "ratata" as unknown as SireneStockUniteLegaleEntity;
            jest.mocked(sireneStockUniteLegaleDbPort.findOneBySiren).mockResolvedValueOnce(expected);
            const actual = await sireneStockUniteLegaleService.findOneBySiren(SIREN);
            expect(actual).toBe(expected);
        });
    });
});
