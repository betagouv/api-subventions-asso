import adminStructureService from "./adminStructure.service";
import { BadRequestError } from "../../shared/errors/httpErrors";
import adminStructureRepository from "../../dataProviders/db/admin-structure/adminStructure.port";
import { AgentTypeEnum } from "dto";

jest.mock("../../dataProviders/db/admin-structure/adminStructure.port");

describe("AdminStructureService", () => {
    const REPO_RES = "PROMISE";
    const AGENT_TYPE = AgentTypeEnum.OPERATOR;

    describe("getAdminStructureByStringAgentType", () => {
        let getTyped: jest.SpyInstance;

        beforeAll(() => {
            getTyped = jest.spyOn(adminStructureService, "getAdminStructureByAgentType");
            getTyped.mockResolvedValue(REPO_RES);
        });
        afterAll(() => {
            getTyped.mockRestore();
        });
        it("throws bad request if arg is not agentType", () => {
            const test = () =>
                adminStructureService.getAdminStructureByStringAgentType("notAnAgentType" as AgentTypeEnum);
            expect(test).rejects.toThrow(BadRequestError);
        });

        it("calls repository", async () => {
            await adminStructureService.getAdminStructureByStringAgentType(AGENT_TYPE);
            expect(getTyped).toHaveBeenCalledWith(AGENT_TYPE);
        });

        it("returns result from repository", async () => {
            const expected = REPO_RES;
            const actual = await adminStructureService.getAdminStructureByStringAgentType(AGENT_TYPE);
            expect(actual).toBe(expected);
        });
    });

    describe("getAdminStructureByAgentType", () => {
        beforeAll(() => {
            // @ts-expect-error mock
            jest.mocked(adminStructureRepository.findAllByAgentType).mockReturnValue(REPO_RES);
        });
        afterAll(() => {
            jest.mocked(adminStructureRepository.findAllByAgentType).mockReset();
        });

        it("calls repository", () => {
            adminStructureService.getAdminStructureByAgentType(AGENT_TYPE);
            expect(adminStructureRepository.findAllByAgentType).toHaveBeenCalledWith(AGENT_TYPE);
        });

        it("returns result from repository", () => {
            const expected = REPO_RES;
            const actual = adminStructureService.getAdminStructureByAgentType(AGENT_TYPE);
            expect(actual).toBe(expected);
        });
    });

    describe("replaceAll", () => {
        const NEW_ENTITIES = ["new1", "new2"];

        it("saves old entries", async () => {
            // @ts-expect-error mock
            await adminStructureService.replaceAll(NEW_ENTITIES);
            expect(adminStructureRepository.findAll).toHaveBeenCalled();
        });

        it("deletes all old entries", async () => {
            // @ts-expect-error mock
            await adminStructureService.replaceAll(NEW_ENTITIES);
            expect(adminStructureRepository.deleteAll).toHaveBeenCalled();
        });

        it("inserts new entries", async () => {
            // @ts-expect-error mock
            await adminStructureService.replaceAll(NEW_ENTITIES);
            expect(adminStructureRepository.insertMany).toHaveBeenCalledWith(NEW_ENTITIES);
        });

        describe("in case of failure", () => {
            const ERROR = "ERROR";
            const OLD_ENTRIES = ["old1", "old2"];

            beforeEach(() => {
                jest.mocked(adminStructureRepository.insertMany).mockRejectedValueOnce(ERROR);
                // @ts-expect-error mock
                jest.mocked(adminStructureRepository.findAll).mockResolvedValueOnce(OLD_ENTRIES);
            });

            it("restores old entries in case of failure", async () => {
                // @ts-expect-error mock
                await adminStructureService.replaceAll(NEW_ENTITIES).catch(() => {});
                expect(adminStructureRepository.insertMany).toHaveBeenNthCalledWith(2, OLD_ENTRIES);
            });

            it("throws error back", async () => {
                // @ts-expect-error mock
                const test = async () => await adminStructureService.replaceAll(NEW_ENTITIES);
                await expect(test).rejects.toBe(ERROR);
            });
        });
    });
});
