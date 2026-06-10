import { mockClient } from "aws-sdk-client-mock";
import { ChorusCron } from "../../../../src/adapters/inputs/cron/chorus.cron";
import { GetObjectCommand, GetObjectTaggingCommand, ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { FileStatus } from "../../../../src/modules/s3-file/@types/FileStatus";
import path from "path";
import { readFileSync } from "fs";
import { Readable } from "stream";
import { GetNewS3File } from "../../../../src/modules/s3-file/use-cases/get-new-s3-file";
import { GetFileData } from "../../../../src/modules/s3-file/use-cases/get-file-data";
import { ChorusImport } from "../../../../src/adapters/inputs/pipeline/import/chorus/chorus.import";
import apiAssoService from "../../../../src/modules/providers/api-asso/api-asso.service";
import stateBudgetProgramAdapter from "../../../../src/adapters/outputs/db/state-budget-program/state-budget-program.adapter";
import sireneUniteLegaleAdapter from "../../../../src/adapters/outputs/db/sirene/sirene-unite-legale.adapter";
import uniteLegalEntrepriseAdapter from "../../../../src/adapters/outputs/db/unite-legale-entreprise/unite-legale-entreprise.adapter";
import { SireneUniteLegaleEntity } from "../../../../src/entities/SireneUniteLegaleEntity";
import { Siren } from "../../../../src/identifier-objects";
import { PROGRAMS } from "../../../__fixtures__/paymentsFlat.fixture";
import { LEGAL_CATEGORIES_ACCEPTED } from "../../../../src/shared/LegalCategoriesAccepted";
import chorusAdapter from "../../../../src/adapters/outputs/db/providers/chorus/chorus.adapter";
import { AssociationWithProviderValues } from "dto";
import paymentFlatAdapter from "../../../../src/adapters/outputs/db/payment-flat/payment-flat.adapter";
import chorusFseAdapter from "../../../../src/adapters/outputs/db/providers/chorus/chorus-fse.adapter";
import { FilterChorusEntities } from "../../../../src/modules/providers/chorus/use-cases/filter-entities";
import { FilterChorusFseEntities } from "../../../../src/modules/providers/chorus/use-cases/filter-fse-entities";
import { CheckIdentifierIsFromAssoUseCase } from "../../../../src/modules/associations/use-cases/check-identifier-is-from-asso.use-case";
import { CheckSirenIsFromAssoUseCase } from "../../../../src/modules/associations/use-cases/check-siren-is-from-asso.use-case";
import rnaSirenAdapter from "../../../../src/adapters/outputs/db/rna-siren/rna-siren.adapter";
import chorusService from "../../../../src/modules/providers/chorus/chorus.service";
import saveChorusEntities from "../../../../src/modules/providers/chorus/use-cases/save-entities";
import saveChorusFseEntities from "../../../../src/modules/providers/chorus/use-cases/save-fse-entities";
import updateFlatByExercise from "../../../../src/modules/providers/chorus/use-cases/update-flat-by-exercise";
import { TagImportedFile } from "../../../../src/modules/s3-file/use-cases/tag-imported-file";

jest.mock("../../../../src/modules/providers/api-asso/api-asso.service");

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
    const mockGetFileData = { execute: jest.fn().mockResolvedValue({ buffer: fileBuffer }) } as unknown as GetFileData;
    const mockTagImportedFile = { execute: jest.fn() } as unknown as TagImportedFile;

    jest.spyOn(apiAssoService, "findAssociationBySiren").mockImplementation((siren: Siren) => {
        if (["200000000"].includes(siren.value))
            // one for chorus and chorus FSE
            return Promise.resolve({
                categorie_juridique: [{ value: LEGAL_CATEGORIES_ACCEPTED[0] }],
            } as AssociationWithProviderValues);
        else
            return Promise.resolve({
                categorie_juridique: [{ value: "random categorie juridique" }],
            } as AssociationWithProviderValues);
    });

    const mockCheckIdentifierIsFromAsso = new CheckIdentifierIsFromAssoUseCase(
        new CheckSirenIsFromAssoUseCase(
            sireneUniteLegaleAdapter,
            rnaSirenAdapter,
            uniteLegalEntrepriseAdapter,
            apiAssoService,
        ),
    );

    // mock file access but not import process
    const cron = new ChorusCron(
        mockGetFile,
        mockGetFileData,
        new ChorusImport(
            saveChorusEntities,
            saveChorusFseEntities,
            // mock API ASSO
            // @TODO: this should be simplified when api-asso.service will be split into use cases
            new FilterChorusEntities(mockCheckIdentifierIsFromAsso),
            new FilterChorusFseEntities(mockCheckIdentifierIsFromAsso),
            chorusService,
            updateFlatByExercise,
        ),
        mockTagImportedFile,
    );

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

        jest.spyOn(apiAssoService, "findAssociationBySiren").mockImplementation((siren: Siren) => {
            if (["200000000"].includes(siren.value))
                // one for chorus and chorus FSE
                return Promise.resolve({
                    categorie_juridique: [{ value: LEGAL_CATEGORIES_ACCEPTED[0] }],
                } as AssociationWithProviderValues);
            else
                return Promise.resolve({
                    categorie_juridique: [{ value: "random categorie juridique" }],
                } as AssociationWithProviderValues);
        });
    });

    beforeEach(async () => {
        await Promise.all([
            stateBudgetProgramAdapter.replace(PROGRAMS),
            // make siren 100000000 belong to asso
            sireneUniteLegaleAdapter.insertOne({ siren: new Siren("100000000") } as SireneUniteLegaleEntity),
            // make siren 30000000 belong to an entreprise
            uniteLegalEntrepriseAdapter.insertMany([{ siren: new Siren("300000000") }]),
        ]);
    });

    it("imports chorus data", async () => {
        await cron.importNewFile();
        expect(
            (await chorusAdapter.cursorFind({}, { _id: 0 }).toArray()).map(data => ({
                ...data,
                updateDate: expect.any(Date),
            })),
        ).toMatchSnapshot();
    });

    it("imports chorus european data", async () => {
        await cron.importNewFile();
        expect(
            (await chorusFseAdapter.findAll()).map(data => ({ ...data, updateDate: expect.any(Date) })),
        ).toMatchSnapshot();
    });

    it("sync flats data", async () => {
        await cron.importNewFile();
        expect(
            (await paymentFlatAdapter.findAll()).map(flat => ({ ...flat, updateDate: expect.any(Date) })),
        ).toMatchSnapshot();
    });

    it("tag file as imported", async () => {
        await cron.importNewFile();
        expect(mockTagImportedFile.execute).toHaveBeenCalledWith(PATH);
    });
});
