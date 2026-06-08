import { SireneUniteLegaleDbo } from "./@types/SireneUniteLegaleDbo";
import { SireneUniteLegaleEntity } from "../../../entities/SireneUniteLegaleEntity";
import UniteLegaleNameEntity from "../../../entities/UniteLegaleNameEntity";
import SireneStockUniteLegaleMapper from "./mappers/sirene-unite-legale.mapper";
import UniteLegaleNameService from "../unite-legale-name/unite-legale.name.service";
import { UniteLegaleEntrepriseEntity } from "../../../entities/UniteLegaleEntrepriseEntity";
import uniteLegaleEntrepriseService from "../unite-legale-entreprise/unite-legale.entreprise.service";
import Siren from "../../../identifier-objects/Siren";
import sireneUniteLegaleAdapter from "../../../adapters/outputs/db/sirene/sirene-unite-legale.adapter";
import sireneUniteLegaleService from "./sirene-unite-legale.service";

const mockUniteLegalEntrepriseConstructor = jest.fn();

jest.mock("../../../adapters/outputs/db/sirene/sirene-unite-legale.adapter");
jest.mock("./mappers/sirene-unite-legale.mapper");
jest.mock("../unite-legale-entreprise/unite-legale.entreprise.service");
jest.mock("../unite-legale-name/unite-legale.name.service");
jest.mock("../../../entities/UniteLegaleEntrepriseEntity", () => ({
    UniteLegaleEntrepriseEntity: class Mock {
        constructor(public i) {
            mockUniteLegalEntrepriseConstructor(i);
        }
    },
}));
jest.mock("../../../adapters/outputs/db/sirene/sirene-unite-legale.adapter");

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

describe("SireneUniteLegaleService", () => {
    describe("insertOne", () => {
        it("should call insertOne", async () => {
            const entity = { siren: new Siren("123456789") } as unknown as SireneUniteLegaleEntity;
            await sireneUniteLegaleService.insertOne(entity);
            expect(sireneUniteLegaleAdapter.insertOne).toHaveBeenCalledWith(entity);
        });
    });

    describe("insertMany", () => {
        it("should call upsertMany", async () => {
            const entities = [{ siren: new Siren("123456789") }] as unknown as SireneUniteLegaleEntity[];
            await sireneUniteLegaleService.upsertMany(entities);
            expect(sireneUniteLegaleAdapter.upsertMany).toHaveBeenCalledWith(entities);
        });
    });

    describe("saveBatchAssoData", () => {
        const BATCH = [1, 2] as unknown as SireneUniteLegaleEntity[];
        const ADAPTED_NAME_BATCH = ["one", "two"] as unknown as UniteLegaleNameEntity[];
        let insertSpy: jest.SpyInstance;

        beforeAll(() => {
            insertSpy = jest.spyOn(sireneUniteLegaleService, "upsertMany").mockResolvedValue(true);

            jest.mocked(SireneStockUniteLegaleMapper.entityToDbo).mockImplementation(
                i => i.toString() as unknown as SireneUniteLegaleDbo,
            );
        });
        afterAll(() => insertSpy.mockRestore());

        it("calls adapter to name", async () => {
            await sireneUniteLegaleService._saveBatchAssoData(BATCH);
            expect(SireneStockUniteLegaleMapper.entityToUniteLegaleNameEntity).toHaveBeenCalledWith(1);
            expect(SireneStockUniteLegaleMapper.entityToUniteLegaleNameEntity).toHaveBeenCalledWith(2);
        });

        it("saves sirene entity", async () => {
            await sireneUniteLegaleService._saveBatchAssoData(BATCH);
            expect(insertSpy).toHaveBeenCalledWith(BATCH);
        });

        it("saves name entity", async () => {
            jest.mocked(SireneStockUniteLegaleMapper.entityToUniteLegaleNameEntity).mockReturnValueOnce(
                "one" as unknown as UniteLegaleNameEntity,
            );
            jest.mocked(SireneStockUniteLegaleMapper.entityToUniteLegaleNameEntity).mockReturnValueOnce(
                "two" as unknown as UniteLegaleNameEntity,
            );

            await sireneUniteLegaleService._saveBatchAssoData(BATCH);
            expect(UniteLegaleNameService.upsertMany).toHaveBeenCalledWith(ADAPTED_NAME_BATCH);
        });
    });

    describe("saveBatchNonAssoData", () => {
        const BATCH = [{ siren: 1 }, { siren: 2 }] as unknown as SireneUniteLegaleEntity[];
        const ADAPTED_ENTITY_BATCH = [{ i: 1 }, { i: 2 }] as unknown as UniteLegaleEntrepriseEntity;

        it("adapt to entreprise entity", async () => {
            await sireneUniteLegaleService._saveBatchNonAssoData(BATCH);
            expect(mockUniteLegalEntrepriseConstructor).toHaveBeenCalledWith(2);
            expect(mockUniteLegalEntrepriseConstructor).toHaveBeenCalledWith(1);
        });

        it("save entreprise entity", async () => {
            await sireneUniteLegaleService._saveBatchNonAssoData(BATCH);
            expect(uniteLegaleEntrepriseService.insertManyEntrepriseSiren).toHaveBeenCalledWith(ADAPTED_ENTITY_BATCH);
        });
    });

    describe("findOneBySiren", () => {
        const SIREN = new Siren("123456789");

        it("should call port", async () => {
            await sireneUniteLegaleService.findOneBySiren(SIREN);
            expect(sireneUniteLegaleAdapter.findOneBySiren).toHaveBeenCalledWith(SIREN);
        });

        it("should return res from port", async () => {
            const expected = "ratata" as unknown as SireneUniteLegaleEntity;
            jest.mocked(sireneUniteLegaleAdapter.findOneBySiren).mockResolvedValueOnce(expected);
            const actual = await sireneUniteLegaleService.findOneBySiren(SIREN);
            expect(actual).toBe(expected);
        });
    });
});
