import { ASSOCIATION_SEARCH_ENTITIES } from "../../../../../domain/__fixtures__/association-search.fixture";
import { AssociationSearchAdapter } from "../../../../outputs/db/association-search/association-search.adapter";
import { DataLogPort } from "../../../../outputs/db/data-log/data-log.port";
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
    const IMPORT_DATE = (dtoDate => {
        const importDate = new Date(dtoDate);
        importDate.setDate(dtoDate.getDate() - 1);
        return importDate;
    })(new Date(RNA_WALDEC_DTO.maj_time)); // make filtering pass

    const BATCHES = [[RNA_WALDEC_DTO, RNA_WALDEC_DTO], [RNA_WALDEC_DTO]];

    const parser = {
        parse: jest.fn().mockImplementation(() => fakeParse(BATCHES)),
    } as unknown as RnaParser;

    const mapper = {
        map: jest.fn().mockImplementation(_dto => RNA_DBO),
        toAssociationSearch: jest.fn().mockImplementation(_dbo => ASSOCIATION_SEARCH_ENTITIES[0]),
    } as unknown as jest.Mocked<RnaMapper>;

    const adapter = {
        insertMany: jest.fn().mockResolvedValue(undefined),
        upsertMany: jest.fn().mockResolvedValue(undefined),
    } as unknown as RnaAdapter;

    const searchAdapter = {
        upsertMany: jest.fn().mockResolvedValue(undefined),
    } as unknown as AssociationSearchAdapter;

    const mockLogsAdapter = {
        getLastImportByProvider: jest.fn().mockResolvedValue(IMPORT_DATE),
    } as unknown as jest.Mocked<DataLogPort>;

    let pipeline: RnaPipeline;

    beforeEach(() => {
        pipeline = new RnaPipeline(parser, mapper, adapter, searchAdapter, mockLogsAdapter);
    });

    describe("run", () => {
        it("parses file from given filepath", async () => {
            await pipeline.run(FILE_PATH);

            expect(parser.parse).toHaveBeenCalledWith(FILE_PATH);
        });

        it("filter dto that were not updated since last import", async () => {
            await pipeline.run(FILE_PATH);

            const BATCHES = [
                [
                    RNA_WALDEC_DTO,
                    { ...RNA_WALDEC_DTO, maj_time: IMPORT_DATE.toISOString() }, // filter this one
                ],
                [RNA_WALDEC_DTO],
            ];

            // filter out filtered dto from BATCHES
            [BATCHES[0][0], BATCHES[1][0]].flat().forEach((dto, index) => {
                expect(mapper.map).toHaveBeenNthCalledWith(index + 1, dto);
            });
        });

        it("transform dtos into dbos", async () => {
            await pipeline.run(FILE_PATH);

            [BATCHES[0][0], BATCHES[1][0]].flat().forEach((dto, index) => {
                expect(mapper.map).toHaveBeenNthCalledWith(index + 1, dto);
            });
        });

        it("updates association-search collection", async () => {
            await pipeline.run(FILE_PATH);

            BATCHES.forEach((_dto, index) => {
                expect(searchAdapter.upsertMany).toHaveBeenNthCalledWith(
                    index + 1,
                    BATCHES[index].map(_dbo => ASSOCIATION_SEARCH_ENTITIES[0]),
                );
            });
        });

        it("persists only data that has been updated or added", async () => {
            await pipeline.run(FILE_PATH);

            BATCHES.forEach((_dto, index) => {
                expect(adapter.upsertMany).toHaveBeenNthCalledWith(
                    index + 1,
                    BATCHES[index].map(_dto => RNA_DBO),
                );
            });
        });

        it("persists all data", async () => {
            mockLogsAdapter.getLastImportByProvider.mockResolvedValueOnce(null);
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
