import { ParquetRow } from "../../../parquet.parser";
import { UniteLegaleEntrepriseEntity } from "../../../../../entities/UniteLegaleEntrepriseEntity";
import { SireneUniteLegalePipeline } from "./sirene-unite-legale.pipeline";
import { SIRENE_UNITE_LEGALE_DTOS } from "./__fixtures__/sirene-unite-legale.dto.fixture";
import SireneUniteLegaleDto from "./SireneUniteLegaleDto";

async function* fakeParse(batches: ParquetRow<SireneUniteLegaleDto>[][]) {
    for (const batch of batches) yield batch;
}

function createPipeline(batches: ParquetRow<SireneUniteLegaleDto>[][]) {
    const parser = { parse: jest.fn().mockImplementation(() => fakeParse(batches)) };
    const sirenePort = { upsertMany: jest.fn().mockResolvedValue(undefined) };
    const searchPort = { upsertMany: jest.fn().mockResolvedValue(undefined) };
    const entrepriseService = { insertManyEntrepriseSiren: jest.fn().mockResolvedValue(undefined) };

    return {
        parser,
        sirenePort,
        searchPort,
        entrepriseService,
        pipeline: new SireneUniteLegalePipeline(
            parser as never,
            sirenePort as never,
            searchPort as never,
            entrepriseService as never,
        ),
    };
}

describe("SireneUniteLegalePipeline", () => {
    const FILE_PATH = "file.parquet";

    describe("run", () => {
        it("parses the given file", async () => {
            const { parser, pipeline } = createPipeline([[{ ...SIRENE_UNITE_LEGALE_DTOS[0] }]]);

            await pipeline.run(FILE_PATH);

            expect(parser.parse).toHaveBeenCalledWith(FILE_PATH);
        });

        it("filters purged units and invalid sirens", async () => {
            const { sirenePort, entrepriseService, pipeline } = createPipeline([
                [
                    { ...SIRENE_UNITE_LEGALE_DTOS[0] },
                    { ...SIRENE_UNITE_LEGALE_DTOS[1], unitePurgeeUniteLegale: false },
                    SIRENE_UNITE_LEGALE_DTOS[2],
                    SIRENE_UNITE_LEGALE_DTOS[3],
                    { ...SIRENE_UNITE_LEGALE_DTOS[0], siren: "invalid" },
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
                associations: [SIRENE_UNITE_LEGALE_DTOS[0].siren, SIRENE_UNITE_LEGALE_DTOS[1].siren],
                entreprises: [SIRENE_UNITE_LEGALE_DTOS[2].siren],
            });
        });

        it("persists every parquet batch", async () => {
            const { sirenePort, searchPort, pipeline } = createPipeline([
                [SIRENE_UNITE_LEGALE_DTOS[0]],
                [SIRENE_UNITE_LEGALE_DTOS[1]],
            ]);

            await pipeline.run(FILE_PATH);

            const actual = {
                sireneBatchSizes: sirenePort.upsertMany.mock.calls.map(([batch]) => batch.length),
                nameBatchSizes: searchPort.upsertMany.mock.calls.map(([batch]) => batch.length),
            };

            expect(actual).toEqual({ sireneBatchSizes: [1, 1], nameBatchSizes: [1, 1] });
        });

        it("returns the import report", async () => {
            const { pipeline } = createPipeline([
                [
                    SIRENE_UNITE_LEGALE_DTOS[0],
                    SIRENE_UNITE_LEGALE_DTOS[2],
                    SIRENE_UNITE_LEGALE_DTOS[3],
                    { ...SIRENE_UNITE_LEGALE_DTOS[0], siren: "invalid" },
                ],
            ]);

            const actual = await pipeline.run(FILE_PATH);

            expect(actual).toEqual({ parsedCount: 4, importedCount: 2, errorCount: 0 });
        });
    });
});
