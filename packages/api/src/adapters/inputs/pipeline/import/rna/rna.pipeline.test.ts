import { RnaAdapter } from "../../../../outputs/db/rna/rna.adapter";
import { RNA_DBO } from "../../../../outputs/db/rna/rna.dbo.fixture";
import { RnaWaldecDto } from "./rna.dto";
import { RNA_WALDEC_DTO } from "./rna.dto.fixture";
import { RnaMapper } from "./rna.mapper";
import { RnaParser } from "./rna.parser";
import { RnaPipeline } from "./rna.pipeline";

function* fakeParse(batches: RnaWaldecDto[][]) {
    for (const batch of batches) {
        yield batch;
    }
}

describe("RNA pipeline", () => {
    const FILE_PATH = "path/to/file";

    const BATCHES = [[RNA_WALDEC_DTO, RNA_WALDEC_DTO], [RNA_WALDEC_DTO]];

    const parser = {
        parse: jest.fn().mockImplementation(() => fakeParse(BATCHES)),
    } as unknown as RnaParser;

    const mapper = {
        map: jest.fn(_row => RNA_DBO),
    } as unknown as RnaMapper;

    const adapter = {
        insertMany: jest.fn().mockResolvedValue(undefined),
    } as unknown as RnaAdapter;

    const pipeline = new RnaPipeline(parser, mapper, adapter);

    describe("run", () => {
        it("parses file from given filepath", async () => {
            await pipeline.run(FILE_PATH);

            expect(parser.parse).toHaveBeenCalledWith(FILE_PATH);
        });

        it("transform dtos into dbos", async () => {
            await pipeline.run(FILE_PATH);

            BATCHES.flat().forEach((dto, index) => {
                expect(mapper.map).toHaveBeenNthCalledWith(index + 1, dto);
            });
        });

        it("persists dbos", async () => {
            await pipeline.run(FILE_PATH);

            BATCHES.forEach((_dto, index) => {
                expect(adapter.insertMany).toHaveBeenNthCalledWith(
                    index + 1,
                    BATCHES[index].map(_dto => RNA_DBO),
                );
            });
        });
    });
});
