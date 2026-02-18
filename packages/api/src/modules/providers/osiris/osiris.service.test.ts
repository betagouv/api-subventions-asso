import Rna from "../../../identifierObjects/Rna";
import Siren from "../../../identifierObjects/Siren";
import osirisService, { InvalidOsirisRequestError, VALID_REQUEST_ERROR_CODE } from "./osiris.service";
import { osirisActionPort, osirisRequestPort } from "../../../dataProviders/db/providers/osiris";
import OsirisActionEntity from "./entities/OsirisActionEntity";
import OsirisRequestEntity from "./entities/OsirisRequestEntity";
import rnaSirenService from "../../rna-siren/rna-siren.service";
import RnaSirenEntity from "../../../entities/RnaSirenEntity";
import { ReadableStream } from "stream/web";
import { APPLICATION_LINK_TO_CHORUS } from "../../applicationFlat/__fixtures__";
import applicationFlatService from "../../applicationFlat/applicationFlat.service";
import { REQUEST_DBO } from "./__fixtures__/osiris.request.fixtures";
import { ACTION_ENTITY } from "./__fixtures__/osiris.action.fixtures";
import { cursorToStream } from "../../applicationFlat/applicationFlat.helper";
import osirisJoiner from "../../../dataProviders/db/providers/osiris/osiris.joiner";
import { ApplicationFlatEntity } from "../../../entities/flats/ApplicationFlatEntity";

jest.mock("../../applicationFlat/applicationFlat.helper");
jest.mock("./adapters/OsirisRequestAdapter");
jest.mock("../../../dataProviders/db/providers/osiris");
jest.mock("../../rna-siren/rna-siren.service");
jest.mock("../../applicationFlat/applicationFlat.service");

const SIREN = new Siren("123456789");
const SIRET = SIREN.toSiret("00000");
const RNA = new Rna("W123456789");

describe("OsirisService", () => {
    describe.each`
        method           | identifier
        ${"findBySiret"} | ${SIRET}
        ${"findBySiren"} | ${SIREN}
        ${"findByRna"}   | ${RNA}
    `("$method", ({ method, identifier }) => {
        beforeEach(() => {
            jest.mocked(osirisRequestPort[method]).mockResolvedValue([REQUEST_DBO]);

            if (method === "findBySiren") {
                // mock used in findBySiren
                jest.mocked(osirisActionPort.findBySiren).mockResolvedValue([ACTION_ENTITY]);
            } else {
                // mock used in findBySiret & findByRna
                jest.mocked(osirisActionPort.findByRequestUniqueId).mockResolvedValue([ACTION_ENTITY]);
            }
        });

        it("returns request with actions", async () => {
            const expected = [{ ...REQUEST_DBO, actions: [ACTION_ENTITY] }];
            const actual = await osirisService[method](identifier);
            expect(actual).toEqual(expected);
        });

        it("returns request without actions", async () => {
            if (method === "findBySiren") {
                jest.mocked(osirisActionPort.findBySiren).mockResolvedValue([]);
            } else {
                jest.mocked(osirisActionPort.findByRequestUniqueId).mockResolvedValue([]);
            }
            const expected = [{ ...REQUEST_DBO, actions: [] }];
            const actual = await osirisService[method](identifier);
            expect(actual).toEqual(expected);
        });
    });

    describe("bulkAddRequest", () => {
        const REQUESTS = [
            { legalInformations: { rna: "W000000001", siret: "12345678900001" } },
            { legalInformations: { rna: "W000000002", siret: "12345678900002" } },
        ] as unknown as OsirisRequestEntity[];

        it("calls osiris port", async () => {
            await osirisService.bulkAddRequest(REQUESTS);
            expect(osirisRequestPort.bulkUpsert).toHaveBeenCalledWith(REQUESTS);
        });

        it("calls rna siren", async () => {
            await osirisService.bulkAddRequest(REQUESTS);
            const callArgs = jest.mocked(rnaSirenService.insertMany).mock.calls[0];
            expect(callArgs).toMatchInlineSnapshot(`
                [
                  [
                    {
                      "rna": Rna {
                        "identifier": "W000000001",
                      },
                      "siren": Siren {
                        "identifier": "123456789",
                      },
                    },
                    {
                      "rna": Rna {
                        "identifier": "W000000002",
                      },
                      "siren": Siren {
                        "identifier": "123456789",
                      },
                    },
                  ],
                ]
            `);
        });
    });

    describe("bulkAddActions", () => {
        const ACTIONS = ["a1", "a2"] as unknown as OsirisActionEntity[];

        it("calls port", async () => {
            await osirisService.bulkAddActions(ACTIONS);
            expect(osirisActionPort.bulkUpsert).toHaveBeenCalledWith(ACTIONS);
        });
    });

    describe("validateAndComplete", () => {
        const REQUEST = { legalInformations: { siret: "12345678900001" } } as unknown as OsirisRequestEntity;
        let mockValidate: jest.SpyInstance;

        beforeAll(() => {
            mockValidate = jest.spyOn(osirisService, "validRequest").mockReturnValue(true);
        });
        afterAll(() => mockValidate.mockRestore());

        it("calls pure validation", async () => {
            await osirisService.validateAndComplete(REQUEST);
            expect(mockValidate).toHaveBeenCalledWith(REQUEST);
        });

        describe("if missing rna", () => {
            beforeEach(() => {
                mockValidate.mockReturnValueOnce({
                    message: "tata",
                    code: VALID_REQUEST_ERROR_CODE.INVALID_RNA,
                    data: REQUEST,
                });
            });

            it("get rna from siret", async () => {
                await osirisService.validateAndComplete(REQUEST);
                expect(rnaSirenService.find).toHaveBeenCalledWith(new Siren("123456789"));
            });

            it("if no found rna, validate ignoring rna", async () => {
                await osirisService.validateAndComplete(REQUEST);
                expect(mockValidate).toHaveBeenNthCalledWith(2, REQUEST, false);
            });

            it("if found rna, validate with found rna", async () => {
                const RNA = new Rna("W000000002");
                jest.mocked(rnaSirenService.find).mockResolvedValueOnce([{ rna: RNA }] as unknown as RnaSirenEntity[]);
                await osirisService.validateAndComplete({ ...REQUEST });
                const expected = { ...REQUEST };
                expected.legalInformations.rna = RNA.value;
                expect(mockValidate).toHaveBeenNthCalledWith(2, expected);
            });
        });

        it("if another error, return validation object", () => {
            const validationFailed = {
                message: "tata",
                code: VALID_REQUEST_ERROR_CODE.INVALID_OSIRISID,
                data: REQUEST,
            };
            mockValidate.mockReturnValueOnce(validationFailed);
            const test = osirisService.validateAndComplete(REQUEST);
            expect(test).rejects.toEqual(new InvalidOsirisRequestError(validationFailed));
        });

        it("if validation is ok, calls nothing", async () => {
            await osirisService.validateAndComplete(REQUEST);
            expect(mockValidate).toHaveBeenCalledTimes(1);
            expect(rnaSirenService.find).not.toHaveBeenCalled();
        });
    });

    describe("saveApplicationsFromStream", () => {
        it("calls application flat with stream", async () => {
            const APPLICATIONS = [APPLICATION_LINK_TO_CHORUS];
            const STREAM = ReadableStream.from(APPLICATIONS);
            await osirisService.saveApplicationsFromStream(STREAM);
            expect(applicationFlatService.saveFromStream).toHaveBeenCalledWith(STREAM);
        });
    });

    describe("createStream", () => {
        const STREAM = ReadableStream.from([]);
        const CURSOR = {}; // mocked AggregationCursor
        beforeEach(() => {
            jest.mocked(cursorToStream).mockReturnValue(STREAM);
        });

        it("creates stream from cursor", () => {
            // @ts-expect-error: test private method with mocked cursor
            osirisService.createStream(CURSOR);
            expect(cursorToStream).toHaveBeenCalledWith(CURSOR, expect.any(Function));
        });

        it("returns stream", () => {
            const expected = STREAM;
            // @ts-expect-error: test private method with mocked cursor
            const actual = osirisService.createStream(CURSOR);
            expect(actual).toEqual(expected);
        });
    });

    describe.each`
        method                   | cursorMethod
        ${"initApplicationFlat"} | ${"findAllCursor"}
        ${"syncApplicationFlat"} | ${"findByExerciseCursor"}
    `("$method", ({ method, cursorMethod }) => {
        const STREAM: ReadableStream<ApplicationFlatEntity> = ReadableStream.from([]);
        const CURSOR = { foo: "bar" };
        let mockCreateStream: jest.SpyInstance;
        let mocksaveApplicationsFromStream: jest.SpyInstance;

        beforeEach(() => {
            // @ts-expect-error: mock private method
            mockCreateStream = jest.spyOn(osirisService, "createStream").mockReturnValue(STREAM);
            mocksaveApplicationsFromStream = jest
                .spyOn(osirisService, "saveApplicationsFromStream")
                .mockImplementation(jest.fn());
            jest.spyOn(osirisJoiner, cursorMethod).mockReturnValue(CURSOR);
        });

        afterAll(() => {
            mockCreateStream.mockRestore();
            mocksaveApplicationsFromStream.mockRestore();
        });

        it("get cursor", async () => {
            await osirisService[method]();
            expect(osirisJoiner[cursorMethod]).toHaveBeenCalled();
        });

        it("create stream from cursor", async () => {
            await osirisService[method]();
            expect(mockCreateStream).toHaveBeenCalledWith(CURSOR);
        });

        it("send stream to be saved", async () => {
            await osirisService[method]();
            expect(mocksaveApplicationsFromStream).toHaveBeenCalledWith(STREAM);
        });
    });
});
