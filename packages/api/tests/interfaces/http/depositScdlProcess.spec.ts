import { App } from "supertest/types";
import request from "supertest";
import { createAndGetUserToken } from "../../__helpers__/tokenHelper";
import depositLogPort from "../../../src/dataProviders/db/deposit-log/depositLog.port";
import { getDefaultUser } from "../../__helpers__/userHelper";
import DepositScdlLogEntity from "../../../src/modules/deposit-scdl-process/entities/depositScdlLog.entity";
import {
    CREATE_DEPOSIT_LOG_DTO,
    DEPOSIT_LOG_DTO,
    DEPOSIT_LOG_PATCH_DTO_PARTIAL_STEP_2,
    DEPOSIT_LOG_RESPONSE_DTO,
} from "../../../src/modules/deposit-scdl-process/__fixtures__/depositLog.fixture";
import { DepositScdlLogDto, DepositScdlLogResponseDto } from "dto";
import path from "path";

const g = global as unknown as { app: App };

const FILE_PATH = path.join(__dirname, "..", "..", "__fixtures__", "files");

describe("/parcours-depot", () => {
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

    describe("DELETE /", () => {
        it("should delete deposit log and return 204", async () => {
            const token = await createAndGetUserToken();
            const userId = (await getDefaultUser())!._id.toString();

            await depositLogPort.insertOne(new DepositScdlLogEntity(userId, 1, undefined, true));

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
                .patch(`/parcours-depot/step/2`)
                .send(DEPOSIT_LOG_PATCH_DTO_PARTIAL_STEP_2)
                .set("x-access-token", token)
                .set("Accept", "application/json");

            const expected: DepositScdlLogResponseDto = {
                allocatorSiret: "12345678901234",
                overwriteAlert: true,
                permissionAlert: true,
                step: 2,
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

    describe("POST /fichier-scdl", () => {
        it("should validate csv scdl file and update depositLog", async () => {
            const token = await createAndGetUserToken();
            const userId = (await getDefaultUser())!._id.toString();

            await depositLogPort.insertOne(new DepositScdlLogEntity(userId, 1, undefined, true, "12345678901234"));

            const csvPath = path.join(FILE_PATH, "test-csv-valid.csv");

            const response = await request(g.app)
                .post(`/parcours-depot/fichier-scdl`)
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
                        errors: expect.any(Array),
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
                .post(`/parcours-depot/fichier-scdl`)
                .attach("file", csvPath)
                .field("depositScdlLogDto", JSON.stringify({ permissionAlert: false }))
                .set("x-access-token", token);

            expect(response.statusCode).toBe(400);
        });
    });
});
