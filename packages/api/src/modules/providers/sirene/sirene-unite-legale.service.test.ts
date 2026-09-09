import { SireneUniteLegaleEntity } from "../../../entities/SireneUniteLegaleEntity";
import UniteLegaleNameEntity from "../../../entities/UniteLegaleNameEntity";
import SireneStockUniteLegaleMapper from "./mappers/sirene-unite-legale.mapper";
import UniteLegaleNameService from "../unite-legale-name/unite-legale.name.service";
import { UniteLegaleEntrepriseEntity } from "../../../entities/UniteLegaleEntrepriseEntity";
import uniteLegaleEntrepriseService from "../unite-legale-entreprise/unite-legale.entreprise.service";
import Siren from "../../../identifier-objects/Siren";
import sireneUniteLegaleAdapter from "../../../adapters/outputs/db/sirene/sirene-unite-legale.adapter";
import sireneUniteLegaleService from "./sirene-unite-legale.service";
import SireneStockUniteLegaleParser from "./parser/sirene-stock-unite-legale.parser";
import SireneUniteLegaleDto from "./@types/SireneUniteLegaleDto";
import { DTOS, ENTITIES } from "./__fixtures__/sirene-unite-legale.fixture";

jest.mock("../../../adapters/outputs/db/sirene/sirene-unite-legale.adapter");
jest.mock("../unite-legale-entreprise/unite-legale.entreprise.service");
jest.mock("../unite-legale-name/unite-legale.name.service");

async function* fakeParse(batches: SireneUniteLegaleDto[][]) {
    for (const batch of batches) {
        yield batch;
    }
}

function mockParserWith(batches: SireneUniteLegaleDto[][]) {
    jest.spyOn(SireneStockUniteLegaleParser, "parse").mockImplementation(() => fakeParse(batches));
}

function toEntity(dto: SireneUniteLegaleDto): SireneUniteLegaleEntity {
    return { ...dto, siren: new Siren(dto.siren) };
}

function makeDtos(length: number, dto: SireneUniteLegaleDto, firstSiren: number) {
    return Array.from({ length }, (_value, index) => ({ ...dto, siren: String(firstSiren + index) }));
}

describe("SireneUniteLegaleService", () => {
    const FILE_PATH = "file.parquet";
    const INVALID_SIREN_DTO = { ...DTOS[0], siren: "invalid" };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe("parse", () => {
        it("should parse file from given filepath", async () => {
            mockParserWith([[DTOS[0]]]);

            await sireneUniteLegaleService.parse(FILE_PATH);

            expect(SireneStockUniteLegaleParser.parse).toHaveBeenCalledWith(FILE_PATH);
        });

        it("should save only valid units in their destination", async () => {
            mockParserWith([[DTOS[0], DTOS[2], DTOS[3], INVALID_SIREN_DTO]]);
            const saveAssoSpy = jest.spyOn(sireneUniteLegaleService, "_saveBatchAssoData").mockResolvedValue();
            const saveNonAssoSpy = jest.spyOn(sireneUniteLegaleService, "_saveBatchNonAssoData").mockResolvedValue();

            await sireneUniteLegaleService.parse(FILE_PATH);

            expect({
                assos: saveAssoSpy.mock.calls.map(([batch]) => batch.map(entity => entity.siren.value)),
                nonAssos: saveNonAssoSpy.mock.calls.map(([batch]) => batch.map(entity => entity.siren.value)),
            }).toEqual({
                assos: [[DTOS[0].siren]],
                nonAssos: [[DTOS[2].siren]],
            });
        });

        it("should flush full and incomplete batches", async () => {
            mockParserWith([makeDtos(1001, DTOS[0], 100000000), makeDtos(1001, DTOS[2], 200000000)]);
            const saveAssoSpy = jest.spyOn(sireneUniteLegaleService, "_saveBatchAssoData").mockResolvedValue();
            const saveNonAssoSpy = jest.spyOn(sireneUniteLegaleService, "_saveBatchNonAssoData").mockResolvedValue();

            await sireneUniteLegaleService.parse(FILE_PATH);

            expect({
                assos: saveAssoSpy.mock.calls.map(([batch]) => batch.length),
                nonAssos: saveNonAssoSpy.mock.calls.map(([batch]) => batch.length),
            }).toEqual({ assos: [1000, 1], nonAssos: [1000, 1] });
        });
    });

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
        const ADAPTED_NAME_BATCH = ["one", "two"] as unknown as UniteLegaleNameEntity[];

        it("calls mapper to adapt names", async () => {
            const nameMapperSpy = jest.spyOn(SireneStockUniteLegaleMapper, "entityToUniteLegaleNameEntity");

            await sireneUniteLegaleService._saveBatchAssoData(ENTITIES);

            expect(nameMapperSpy.mock.calls).toEqual([[ENTITIES[0]], [ENTITIES[1]]]);
        });

        it("saves sirene entity", async () => {
            await sireneUniteLegaleService._saveBatchAssoData(ENTITIES);
            expect(sireneUniteLegaleAdapter.upsertMany).toHaveBeenCalledWith(ENTITIES);
        });

        it("saves name entity", async () => {
            jest.spyOn(SireneStockUniteLegaleMapper, "entityToUniteLegaleNameEntity")
                .mockReturnValueOnce(ADAPTED_NAME_BATCH[0])
                .mockReturnValueOnce(ADAPTED_NAME_BATCH[1]);

            await sireneUniteLegaleService._saveBatchAssoData(ENTITIES);

            expect(UniteLegaleNameService.upsertMany).toHaveBeenCalledWith(ADAPTED_NAME_BATCH);
        });
    });

    describe("saveBatchNonAssoData", () => {
        const BATCH = [toEntity(DTOS[2]), toEntity({ ...DTOS[2], siren: "123456789" })];

        it("saves entreprise entities", async () => {
            await sireneUniteLegaleService._saveBatchNonAssoData(BATCH);

            expect(
                jest
                    .mocked(uniteLegaleEntrepriseService.insertManyEntrepriseSiren)
                    .mock.calls[0][0].map((entity: UniteLegaleEntrepriseEntity) => entity.siren.value),
            ).toEqual([DTOS[2].siren, "123456789"]);
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
