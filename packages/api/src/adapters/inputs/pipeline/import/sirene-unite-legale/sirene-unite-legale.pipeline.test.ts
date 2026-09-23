import { ParquetRow } from "../../../parquet.parser";
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

        it("filters importable dtos", async () => {
            const BATCHES = [SIRENE_UNITE_LEGALE_DTOS];

            const { pipeline } = createPipeline(BATCHES);

            const mockIsImportable = jest
                // @ts-expect-error: mock private method
                .spyOn(pipeline, "isImportable")
                // @ts-expect-error: mock private method
                .mockReturnValue(true)
                .mockReturnValueOnce(false);

            await pipeline.run(FILE_PATH);
            BATCHES[0].forEach((dto, index) => {
                expect(mockIsImportable).toHaveBeenNthCalledWith(index + 1, dto);
            });
        });

        it("splits associations and companies", async () => {
            const BATCHES = [SIRENE_UNITE_LEGALE_DTOS];

            const { pipeline } = createPipeline(BATCHES);

            jest
                // @ts-expect-error: mock private method
                .spyOn(pipeline, "isImportable")
                // @ts-expect-error: mock private method
                .mockReturnValue(true)
                .mockReturnValueOnce(false);

            const mockIsAssociation = jest
                // @ts-expect-error: mock private method
                .spyOn(pipeline, "isAssociation")
                // @ts-expect-error: mock private method
                .mockReturnValue(true)
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(false);

            await pipeline.run(FILE_PATH);

            // slice the first one as defined "not importable"
            BATCHES[0].slice(1).forEach((dto, index) => {
                expect(mockIsAssociation).toHaveBeenNthCalledWith(index + 1, dto);
            });
        });

        it("saves associations", async () => {
            const BATCHES = [SIRENE_UNITE_LEGALE_DTOS];

            const { pipeline } = createPipeline(BATCHES);

            jest
                // @ts-expect-error: mock private method
                .spyOn(pipeline, "isImportable")
                // @ts-expect-error: mock private method
                .mockReturnValue(true)
                .mockReturnValueOnce(false);

            jest
                // @ts-expect-error: mock private method
                .spyOn(pipeline, "isAssociation")
                // @ts-expect-error: mock private method
                .mockReturnValue(true)
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(false);

            const mockSaveAssociation = jest
                // @ts-expect-error: mock private method
                .spyOn(pipeline, "saveAssociations")
                // @ts-expect-error: mock private method
                .mockResolvedValue();

            await pipeline.run(FILE_PATH);

            const IMPORTABLES = BATCHES[0].slice(1);
            IMPORTABLES.splice(1, 1); // remove company

            expect(mockSaveAssociation).toHaveBeenCalledWith(IMPORTABLES);
        });

        it("saves establishments", async () => {
            const BATCHES = [SIRENE_UNITE_LEGALE_DTOS];

            const { pipeline } = createPipeline(BATCHES);

            jest
                // @ts-expect-error: mock private method
                .spyOn(pipeline, "isImportable")
                // @ts-expect-error: mock private method
                .mockReturnValue(true)
                .mockReturnValueOnce(false);

            jest
                // @ts-expect-error: mock private method
                .spyOn(pipeline, "isAssociation")
                // @ts-expect-error: mock private method
                .mockReturnValue(true)
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(false);

            jest
                // @ts-expect-error: mock private method
                .spyOn(pipeline, "saveAssociations")
                // @ts-expect-error: mock private method
                .mockResolvedValue();

            const mockSaveEntreprises = jest
                // @ts-expect-error: mock private method
                .spyOn(pipeline, "saveEntreprises")
                // @ts-expect-error: mock private method
                .mockResolvedValue();

            await pipeline.run(FILE_PATH);

            expect(mockSaveEntreprises).toHaveBeenCalledWith(BATCHES[0].slice(1).slice(1, 2));
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
