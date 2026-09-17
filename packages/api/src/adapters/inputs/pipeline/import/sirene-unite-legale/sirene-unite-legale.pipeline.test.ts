import { ParquetRow } from "../../../parquet.parser";
import { UniteLegaleEntrepriseEntity } from "../../../../../entities/UniteLegaleEntrepriseEntity";
import { DTOS } from "../../../../../modules/providers/sirene/__fixtures__/sirene-unite-legale.fixture";
import { SireneUniteLegalePipeline } from "./sirene-unite-legale.pipeline";

async function* fakeParse(batches: ParquetRow[][]): AsyncGenerator<ParquetRow[]> {
    for (const batch of batches) yield batch;
}

function createPipeline(batches: ParquetRow[][]) {
    const parser = { parse: jest.fn().mockImplementation(() => fakeParse(batches)) };
    const sirenePort = { upsertMany: jest.fn().mockResolvedValue(undefined) };
    const nameService = { upsertMany: jest.fn().mockResolvedValue(undefined) };
    const entrepriseService = { insertManyEntrepriseSiren: jest.fn().mockResolvedValue(undefined) };

    return {
        parser,
        sirenePort,
        nameService,
        entrepriseService,
        pipeline: new SireneUniteLegalePipeline(
            parser as never,
            sirenePort as never,
            nameService as never,
            entrepriseService as never,
        ),
    };
}

describe("SireneUniteLegalePipeline", () => {
    const FILE_PATH = "file.parquet";

    describe("run", () => {
        it("parses the given file", async () => {
            const { parser, pipeline } = createPipeline([[DTOS[0]]]);

            await pipeline.run(FILE_PATH);

            expect(parser.parse).toHaveBeenCalledWith(FILE_PATH);
        });

        it("filters purged units and invalid sirens", async () => {
            const { sirenePort, entrepriseService, pipeline } = createPipeline([
                [
                    DTOS[0],
                    { ...DTOS[1], unitePurgeeUniteLegale: false },
                    DTOS[2],
                    DTOS[3],
                    { ...DTOS[0], siren: "invalid" },
                ],
            ]);

            await pipeline.run(FILE_PATH);

            const actual = {
                associations: sirenePort.upsertMany.mock.calls.flatMap(([batch]) =>
                    batch.map(entity => entity.siren.value),
                ),
                entreprises: entrepriseService.insertManyEntrepriseSiren.mock.calls.flatMap(([batch]) =>
                    batch.map((entity: UniteLegaleEntrepriseEntity) => entity.siren.value),
                ),
            };

            expect(actual).toEqual({
                associations: [DTOS[0].siren, DTOS[1].siren],
                entreprises: [DTOS[2].siren],
            });
        });

        it("persists every parquet batch", async () => {
            const { sirenePort, nameService, pipeline } = createPipeline([[DTOS[0]], [DTOS[1]]]);

            await pipeline.run(FILE_PATH);

            const actual = {
                sireneBatchSizes: sirenePort.upsertMany.mock.calls.map(([batch]) => batch.length),
                nameBatchSizes: nameService.upsertMany.mock.calls.map(([batch]) => batch.length),
            };

            expect(actual).toEqual({ sireneBatchSizes: [1, 1], nameBatchSizes: [1, 1] });
        });

        it("returns the import report", async () => {
            const { pipeline } = createPipeline([[DTOS[0], DTOS[2], DTOS[3], { ...DTOS[0], siren: "invalid" }]]);

            const actual = await pipeline.run(FILE_PATH);

            expect(actual).toEqual({ parsedCount: 4, importedCount: 2, errorCount: 0 });
        });
    });
});
