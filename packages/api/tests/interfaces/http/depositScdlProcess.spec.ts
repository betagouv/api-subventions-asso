import { App } from "supertest/types";
import request from "supertest";
import { createAndGetUserToken } from "../../__helpers__/tokenHelper";
import depositLogPort from "../../../src/dataProviders/db/deposit-log/depositLog.port";
import { getDefaultUser } from "../../__helpers__/userHelper";
import DepositScdlLogEntity from "../../../src/modules/deposit-scdl-process/entities/depositScdlLog.entity";
import {
    CREATE_DEPOSIT_LOG_DTO,
    DEPOSIT_LOG_DTO,
    DEPOSIT_LOG_PATCH_DTO_PARTIAL_STEP_1,
    DEPOSIT_LOG_PATCH_DTO_PARTIAL_STEP_2,
    DEPOSIT_LOG_RESPONSE_DTO,
} from "../../../src/modules/deposit-scdl-process/__fixtures__/depositLog.fixture";
import { DepositScdlLogDto, DepositScdlLogResponseDto } from "dto";
import path from "path";
import miscScdlGrantPort from "../../../src/dataProviders/db/providers/scdl/miscScdlGrant.port";
import { SCDL_GRANT_DBOS } from "../../dataProviders/db/__fixtures__/scdl.fixtures";
import UploadedFileInfosEntity from "../../../src/modules/deposit-scdl-process/entities/uploadedFileInfos.entity";
import MiscScdlProducerEntity from "../../../src/modules/providers/scdl/entities/MiscScdlProducerEntity";
import scdlService from "../../../src/modules/providers/scdl/scdl.service";
import { mockClient } from "aws-sdk-client-mock";
import {
    DeleteObjectCommand,
    GetObjectCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import fs from "fs";
import ScdlErrorStats from "../../../src/modules/deposit-scdl-process/entities/ScdlErrorStats";

const g = global as unknown as { app: App };

const FILE_PATH = path.join(__dirname, "..", "..", "__fixtures__", "files");

const s3Mock = mockClient(S3Client);

describe("/parcours-depot", () => {
    beforeEach(() => {
        s3Mock.reset();
    });

    describe("GET /", () => {
        it("should return 200 with deposit object", async () => {
            const token = await createAndGetUserToken();
            const userId = (await getDefaultUser())!._id.toString();

            await depositLogPort.insertOne(new DepositScdlLogEntity(userId, 1, undefined, true));

            const response = await request(g.app)
                .get(`/parcours-depot`)
                .set("x-access-token", token)
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                overwriteAlert: true,
                step: 1,
            });
        });

        it("should return 204 when no deposit object exists", async () => {
            const response = await request(g.app)
                .get(`/parcours-depot`)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(204);
            expect(response.body).toEqual({});
        });
    });

    describe("GET /donnees-existantes", () => {
        it("should return 200 and match expected csv", async () => {
            await miscScdlGrantPort.createMany(SCDL_GRANT_DBOS);
            const token = await createAndGetUserToken();
            const userId = (await getDefaultUser())!._id.toString();

            const uploadFileInfo = new UploadedFileInfosEntity(
                "test.csv",
                new Date(),
                ["99000000000001"],
                [2019, 2021],
                12,
                13,
                1,
                new ScdlErrorStats([]),
            );

            await depositLogPort.insertOne(
                new DepositScdlLogEntity(userId, 1, new Date(), true, "99000000000001", true, uploadFileInfo),
            );

            const response = await request(g.app)
                .get(`/parcours-depot/donnees-existantes`)
                .set("x-access-token", token)
                .set("Accept", "text/csv")
                .expect("Content-Type", /text\/csv/)
                .expect(200);

            expect(response.headers["content-disposition"]).toContain("attachment; filename=");
            expect(response.text).toMatchSnapshot();
        });

        it("should return 200 and match expected filename", async () => {
            await miscScdlGrantPort.createMany(SCDL_GRANT_DBOS);
            const token = await createAndGetUserToken();
            const userId = (await getDefaultUser())!._id.toString();

            const uploadFileInfo = new UploadedFileInfosEntity(
                "test.csv",
                new Date(),
                ["99000000000001"],
                [2019, 2021],
                12,
                13,
                1,
                new ScdlErrorStats([]),
            );

            await depositLogPort.insertOne(
                new DepositScdlLogEntity(userId, 1, new Date(), true, "99000000000001", true, uploadFileInfo),
            );

            const response = await request(g.app)
                .get(`/parcours-depot/donnees-existantes`)
                .set("x-access-token", token)
                .set("Accept", "text/csv")
                .expect("Content-Type", /text\/csv/)
                .expect(200);

            const contentDisposition = response.headers["content-disposition"];
            const fileName = contentDisposition!.split("filename=")[1];

            expect(fileName).toMatch(/^existing-grants-99000000000001-2019-2021-\d{8}\.csv$/);
        });
    });

    describe("GET /fichier-depose/url-de-telechargement", () => {
        it("should return 200 with presigned url", async () => {
            await miscScdlGrantPort.createMany(SCDL_GRANT_DBOS);
            const token = await createAndGetUserToken();
            const userId = (await getDefaultUser())!._id.toString();

            const uploadFileInfo = new UploadedFileInfosEntity(
                "test.csv",
                new Date(),
                ["99000000000001"],
                [2019, 2021],
                12,
                13,
                1,
                new ScdlErrorStats([]),
            );

            await depositLogPort.insertOne(
                new DepositScdlLogEntity(userId, 2, new Date(), true, "99000000000001", true, uploadFileInfo),
            );

            const response = await request(g.app)
                .get("/parcours-depot/fichier-depose/url-de-telechargement")
                .set("x-access-token", token)
                .set("Accept", "application/json")
                .expect(200);

            expect(response.body).toEqual({
                url: "http://mock-presigned-url",
            });
        });
    });

    describe("DELETE /", () => {
        it("should delete deposit log and return 204", async () => {
            s3Mock.on(DeleteObjectCommand).resolvesOnce({});

            const token = await createAndGetUserToken();
            const userId = (await getDefaultUser())!._id.toString();
            const filename = "test-csv-valid.csv";
            const uploadFileInfo = new UploadedFileInfosEntity(
                filename,
                new Date(),
                ["12345676541230"],
                [2019, 2021],
                38,
                39,
                0,
                new ScdlErrorStats([]),
            );
            await depositLogPort.insertOne(
                new DepositScdlLogEntity(userId, 1, undefined, true, "12345678901234", true, uploadFileInfo),
            );

            const response = await request(g.app)
                .delete(`/parcours-depot`)
                .set("x-access-token", token)
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(204);
            expect(response.body).toEqual({});

            const deletedLog = await depositLogPort.findOneByUserId(userId);
            expect(deletedLog).toBeNull();
        });

        it("should return 204 if deposit log does not exist", async () => {
            const token = await createAndGetUserToken();
            const userId = (await getDefaultUser())!._id.toString();
            const existingLog = await depositLogPort.findOneByUserId(userId);
            expect(existingLog).toBeNull();

            const response = await request(g.app)
                .delete("/parcours-depot")
                .set("x-access-token", token)
                .set("Accept", "application/json");

            expect(response.status).toBe(204);
            expect(response.body).toEqual({});

            const deletedLog = await depositLogPort.findOneByUserId(userId);
            expect(deletedLog).toBeNull();
        });
    });

    describe("POST /", () => {
        it("should create deposit log and return 201", async () => {
            const response = await request(g.app)
                .post(`/parcours-depot`)
                .send(CREATE_DEPOSIT_LOG_DTO)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(201);
            expect(response.body).toEqual(DEPOSIT_LOG_RESPONSE_DTO);
        });

        it("should return 409 when user already has deposit log", async () => {
            const token = await createAndGetUserToken();
            const userId = (await getDefaultUser())!._id.toString();

            await depositLogPort.insertOne(new DepositScdlLogEntity(userId, 1, undefined, true));

            const response = await request(g.app)
                .post(`/parcours-depot`)
                .send(CREATE_DEPOSIT_LOG_DTO)
                .set("x-access-token", token)
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(409);
            expect(response.body).toEqual({
                message: "Deposit log already exists",
            });
        });

        it("should return bad request when wrong dto", async () => {
            const response = await request(g.app)
                .post(`/parcours-depot`)
                .send(DEPOSIT_LOG_DTO)
                .set("x-access-token", await createAndGetUserToken())
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual(
                expect.objectContaining({
                    details: expect.any(Object),
                    message: expect.any(String),
                }),
            );
        });
    });

    describe("PATCH /step/{step}", () => {
        it("should update deposit log and return 200", async () => {
            const token = await createAndGetUserToken();
            const userId = (await getDefaultUser())!._id.toString();

            await depositLogPort.insertOne(new DepositScdlLogEntity(userId, 1, undefined, true, "12345678901234"));

            const response = await request(g.app)
                .patch(`/parcours-depot/step/1`)
                .send(DEPOSIT_LOG_PATCH_DTO_PARTIAL_STEP_1)
                .set("x-access-token", token)
                .set("Accept", "application/json");

            const expected: DepositScdlLogResponseDto = {
                allocatorSiret: "12345678901234",
                overwriteAlert: true,
                step: 1,
            };

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(expected);
        });

        it("should return BadRequest error when update inconsistent", async () => {
            const token = await createAndGetUserToken();
            const userId = (await getDefaultUser())!._id.toString();

            const depositLogEntity = new DepositScdlLogEntity(userId, 2, undefined, true, "12345678901234");
            await depositLogPort.insertOne(depositLogEntity);

            const inconsistentDto: DepositScdlLogDto = {
                overwriteAlert: true,
            };

            const response = await request(g.app)
                .patch(`/parcours-depot/step/2`)
                .send(inconsistentDto)
                .set("x-access-token", token)
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(400);

            const existingLog = await depositLogPort.findOneByUserId(userId);
            expect(existingLog).toEqual({
                userId: depositLogEntity.userId,
                step: depositLogEntity.step,
                updateDate: existingLog?.updateDate,
                allocatorSiret: depositLogEntity.allocatorSiret,
                overwriteAlert: depositLogEntity.overwriteAlert,
            });
        });

        it("should return bad request error when step don't exists", async () => {
            const token = await createAndGetUserToken();
            const userId = (await getDefaultUser())!._id.toString();

            await depositLogPort.insertOne(new DepositScdlLogEntity(userId, 1, undefined, true));

            const response = await request(g.app)
                .patch(`/parcours-depot/step/9`)
                .send(DEPOSIT_LOG_PATCH_DTO_PARTIAL_STEP_2)
                .set("x-access-token", token)
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(400);
        });
    });

    describe("POST /validation-fichier-scdl", () => {
        it("should validate csv scdl file and update depositLog", async () => {
            s3Mock.on(ListObjectsV2Command).resolvesOnce({});
            s3Mock.on(PutObjectCommand).resolvesOnce({});

            const token = await createAndGetUserToken();
            const userId = (await getDefaultUser())!._id.toString();

            await depositLogPort.insertOne(new DepositScdlLogEntity(userId, 1, undefined, true, "12345678901234"));

            const csvPath = path.join(FILE_PATH, "test-csv-valid.csv");

            const response = await request(g.app)
                .post(`/parcours-depot/validation-fichier-scdl`)
                .attach("file", csvPath)
                .field("depositScdlLogDto", JSON.stringify(DEPOSIT_LOG_PATCH_DTO_PARTIAL_STEP_2))
                .set("x-access-token", token);

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(
                expect.objectContaining({
                    allocatorSiret: "12345678901234",
                    step: 2,
                    uploadedFileInfos: expect.objectContaining({
                        fileName: "test-csv-valid.csv",
                        uploadDate: expect.any(String),
                        allocatorsSiret: expect.arrayContaining([expect.any(String)]),
                        errorStats: expect.objectContaining({
                            count: expect.any(Number),
                            errors: expect.any(Array),
                        }),
                    }),
                }),
            );
        });

        it("should return BadRequest error when scdl dto inconsistent", async () => {
            const token = await createAndGetUserToken();
            const userId = (await getDefaultUser())!._id.toString();

            await depositLogPort.insertOne(new DepositScdlLogEntity(userId, 1, undefined, true, "12345678901234"));

            const csvPath = path.join(FILE_PATH, "test-csv-valid.csv");

            const response = await request(g.app)
                .post(`/parcours-depot/validation-fichier-scdl`)
                .attach("file", csvPath)
                .field("depositScdlLogDto", JSON.stringify({ permissionAlert: false }))
                .set("x-access-token", token);

            expect(response.statusCode).toBe(400);
        });
    });

    describe("POST /depot-fichier-scdl", () => {
        it("should persist scdl file and delete depositLog", async () => {
            const csvPath = path.join(FILE_PATH, "test-csv-valid.csv");
            const stream: NodeJS.ReadableStream = fs.createReadStream(csvPath);

            s3Mock.on(GetObjectCommand).resolvesOnce({ Body: stream as never, ContentType: "text/csv" });
            s3Mock.on(DeleteObjectCommand).resolvesOnce({});

            // @ts-expect-error: mock - omit _id
            jest.spyOn(scdlService, "getProducer").mockResolvedValueOnce({
                siret: "12345676541230",
            } as MiscScdlProducerEntity);

            const token = await createAndGetUserToken();
            const userId = (await getDefaultUser())!._id.toString();

            const uploadFileInfo = new UploadedFileInfosEntity(
                "test-csv-valid.csv",
                new Date(),
                ["12345676541230"],
                [2019, 2021],
                38,
                39,
                0,
                new ScdlErrorStats([]),
            );
            await depositLogPort.insertOne(
                new DepositScdlLogEntity(userId, 2, undefined, true, "12345676541230", true, uploadFileInfo),
            );

            const response = await request(g.app)
                .post(`/parcours-depot/depot-fichier-scdl`)
                .set("x-access-token", token);

            expect(response.statusCode).toBe(204);
            await expect(depositLogPort.findOneByUserId(userId)).resolves.toBeNull();
        });

        it("should not persist scdl file and delete depositLog when blocking error", async () => {
            const csvPath = path.join(FILE_PATH, "test-csv-invalid.csv");
            const stream: NodeJS.ReadableStream = fs.createReadStream(csvPath);

            s3Mock.on(GetObjectCommand).resolvesOnce({ Body: stream as never, ContentType: "text/csv" });

            // @ts-expect-error: mock - omit _id
            jest.spyOn(scdlService, "getProducer").mockResolvedValueOnce({
                siret: "12345676541230",
            } as MiscScdlProducerEntity);

            const token = await createAndGetUserToken();
            const userId = (await getDefaultUser())!._id.toString();

            const uploadFileInfo = new UploadedFileInfosEntity(
                "test-csv-invalid.csv",
                new Date(),
                ["12345676541230"],
                [2019, 2021],
                38,
                39,
                0,
                new ScdlErrorStats([]),
            );
            await depositLogPort.insertOne(
                new DepositScdlLogEntity(userId, 2, undefined, true, "12345676541230", true, uploadFileInfo),
            );

            const response = await request(g.app)
                .post(`/parcours-depot/depot-fichier-scdl`)
                .set("x-access-token", token);

            expect(response.statusCode).toBe(400);
            await expect(depositLogPort.findOneByUserId(userId)).resolves.not.toBeNull();
            await expect(miscScdlGrantPort.findAll()).resolves.toHaveLength(0);
        });
    });
});
