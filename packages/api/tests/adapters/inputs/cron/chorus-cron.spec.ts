import { mockClient } from "aws-sdk-client-mock";
import { ChorusCron } from "../../../../src/adapters/inputs/cron/chorus.cron";
import { GetObjectCommand, GetObjectTaggingCommand, ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { FileStatus } from "../../../../src/modules/s3-file/@types/FileStatus";
import path from "path";
import { readFileSync } from "fs";
import { Readable } from "stream";
import { GetNewS3File } from "../../../../src/modules/s3-file/use-cases/get-new-s3-file";
import { GetFileData } from "../../../../src/modules/s3-file/use-cases/get-file-data";
// import chorusAdapter from "../../../../src/adapters/outputs/db/providers/chorus/chorus.adapter";
const s3Mock = mockClient(S3Client);

describe("Chorus CRON", () => {
    const PATH = path.resolve(__dirname, "./../__fixtures__/chorus.xlsx");
    const fileBuffer = readFileSync(PATH);

    const mockGetFile = {
        execute: jest.fn().mockResolvedValue([
            {
                path: PATH,
                importDate: new Date("2026-05-20"),
            },
        ]),
    } as unknown as GetNewS3File;
    const mockGetFileData = { execute: jest.fn() } as unknown as GetFileData;

    const cron = new ChorusCron(mockGetFile, mockGetFileData);

    beforeAll(() => {
        s3Mock.on(ListObjectsV2Command).resolves({
            Contents: [
                { Key: "provider/chorus/2026/B0-001.xlsx", LastModified: new Date("2026-05-20") },
                { Key: "provider/chorus/2026/B0-002.xlsx", LastModified: new Date("2026-05-27") },
            ],
        });

        s3Mock.on(GetObjectTaggingCommand).resolvesOnce({ TagSet: [{ Key: "status", Value: FileStatus.IMPORTED }] });
        s3Mock
            .on(GetObjectTaggingCommand)
            .resolvesOnce({ TagSet: [{ Key: "status", Value: FileStatus.NOT_IMPORTED }] });

        s3Mock.on(GetObjectCommand).resolves({
            // @ts-expect-error: mock Body Stream type
            Body: Readable.from(fileBuffer),
        });
    });

    it("imports chorus data", async () => {
        await cron.importNewFile();

        // @TODO: update this when importNewFile will call the Use Case to import data in database
        expect(mockGetFileData.execute).toHaveBeenCalled();
    });
});
