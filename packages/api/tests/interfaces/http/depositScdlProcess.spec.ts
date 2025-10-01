import { App } from "supertest/types";
import request from "supertest";
import { createAndGetUserToken } from "../../__helpers__/tokenHelper";
import depositLogPort from "../../../src/dataProviders/db/deposit-log/depositLog.port";
import { getDefaultUser } from "../../__helpers__/userHelper";
import DepositScdlLogEntity from "../../../src/modules/deposit-scdl-process/depositScdlLog.entity";
import {
    CREATE_DEPOSIT_LOG_DTO,
    DEPOSIT_LOG_DTO,
} from "../../../src/modules/deposit-scdl-process/__fixtures__/depositLog.fixture";

const g = global as unknown as { app: App };

let token;
let userId;

const insertData = async () => {
    token = await createAndGetUserToken();
    userId = (await getDefaultUser())?._id.toString();

    await depositLogPort.insertOne(
        new DepositScdlLogEntity(userId, 1, undefined, false, false, undefined, "12345678901234"),
    );
};

describe("/parcours-depot", () => {
    beforeEach(async () => {
        await insertData();
    });

    describe("GET /", () => {
        it("should return 200 with deposit object", async () => {
            const response = await request(g.app)
                .get(`/parcours-depot`)
                .set("x-access-token", token)
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                grantOrgSiret: "12345678901234",
                overwriteAlert: false,
                permissionAlert: false,
            });
        });

        it("should return 204 when no deposit object exists", async () => {
            await depositLogPort.deleteByUserId(userId);
            const response = await request(g.app)
                .get(`/parcours-depot`)
                .set("x-access-token", token)
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(204);
            expect(response.body).toEqual({});
        });
    });

    describe("DELETE /", () => {
        it("should delete deposit log and return 204", async () => {
            const existingLog = await depositLogPort.findOneByUserId(userId);
            expect(existingLog).not.toBeNull();

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
            await depositLogPort.deleteByUserId(userId);
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
            await depositLogPort.deleteByUserId(userId);
            const response = await request(g.app)
                .post(`/parcours-depot`)
                .send(CREATE_DEPOSIT_LOG_DTO)
                .set("x-access-token", token)
                .set("Accept", "application/json");

            expect(response.statusCode).toBe(201);
            expect(response.body).toEqual(CREATE_DEPOSIT_LOG_DTO);
        });

        it("should return 409 when user already has deposit log", async () => {
            const existingLog = await depositLogPort.findOneByUserId(userId);
            expect(existingLog).not.toBeNull();

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
            await depositLogPort.deleteByUserId(userId);

            const response = await request(g.app)
                .post(`/parcours-depot`)
                .send(DEPOSIT_LOG_DTO)
                .set("x-access-token", token)
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
});
