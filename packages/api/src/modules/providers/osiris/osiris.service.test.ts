import AssociationIdentifier from "../../../identifierObjects/AssociationIdentifier";
import Rna from "../../../identifierObjects/Rna";
import Siren from "../../../identifierObjects/Siren";
import OsirisRequestAdapter from "./adapters/OsirisRequestAdapter";
import osirisService, { InvalidOsirisRequestError, VALID_REQUEST_ERROR_CODE } from "./osiris.service";
import { osirisActionPort, osirisRequestPort } from "../../../dataProviders/db/providers/osiris";
import OsirisActionEntity from "./entities/OsirisActionEntity";
import OsirisRequestEntity from "./entities/OsirisRequestEntity";
import rnaSirenService from "../../rna-siren/rnaSiren.service";
import RnaSirenEntity from "../../../entities/RnaSirenEntity";
import { ReadableStream } from "stream/web";
import { ENTITY } from "../../applicationFlat/__fixtures__";
import applicationFlatService from "../../applicationFlat/applicationFlat.service";
import { REQUEST_DBO } from "./__fixtures__/osiris.request.fixtures";
import { ACTION_ENTITY } from "./__fixtures__/osiris.action.fixtures";
import { cursorToStream } from "../../applicationFlat/applicationFlat.helper";
import osirisJoiner from "../../../dataProviders/db/providers/osiris/osiris.joiner";
import { ApplicationFlatEntity } from "../../../entities/ApplicationFlatEntity";

jest.mock("../../applicationFlat/applicationFlat.helper");
jest.mock("./adapters/OsirisRequestAdapter");
jest.mock("../../../dataProviders/db/providers/osiris");
jest.mock("../../rna-siren/rnaSiren.service");
jest.mock("../../applicationFlat/applicationFlat.service");

const SIREN = new Siren("123456789");
const SIRET = SIREN.toSiret("00000");
const RNA = new Rna("W123456789");

describe("OsirisService", () => {
    beforeAll(() => {
        // @ts-expect-error: disable adapter
        jest.mocked(OsirisRequestAdapter.toDemandeSubvention).mockReturnValue(entity => entity);
    });

    afterAll(() => {
        jest.mocked(OsirisRequestAdapter.toDemandeSubvention).mockRestore();
    });

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

    describe("rawToApplication", () => {
        // @ts-expect-error: parameter type
        const RAW_APPLICATION: RawApplication = { data: { foo: "bar" } };
        // @ts-expect-error: parameter type
        const APPLICATION: DemandeSubvention = { foo: "bar" };

        it("should call OsirisRequestAdapter.rawToApplication", () => {
            osirisService.rawToApplication(RAW_APPLICATION);
            expect(OsirisRequestAdapter.rawToApplication).toHaveBeenCalledWith(RAW_APPLICATION);
        });

        it("should return DemandeSubvention", () => {
            jest.mocked(OsirisRequestAdapter.rawToApplication).mockReturnValueOnce(APPLICATION);
            const expected = APPLICATION;
            const actual = osirisService.rawToApplication(RAW_APPLICATION);
            expect(actual).toEqual(expected);
        });
    });

    describe("getDemandeSubventionBySiren", () => {
        const SIREN = new Siren("123456789");
        const ASSOCIATION_IDENTIFIER = AssociationIdentifier.fromSiren(SIREN);
        const findBySirenMock = jest.spyOn(osirisService, "findBySiren");
        it("should call findBySiren", async () => {
            // @ts-expect-error: mock
            findBySirenMock.mockImplementationOnce(jest.fn(() => [{}]));
            await osirisService.getDemandeSubvention(ASSOCIATION_IDENTIFIER);
            expect(findBySirenMock).toHaveBeenCalledWith(SIREN);
        });
    });

    describe("getRawGrants", () => {
        const DATA = [{ providerInformations: { ej: "EJ" } }];
        const SIREN = new Siren("123456789");
        const ASSOCIATION_IDENTIFIER = AssociationIdentifier.fromSiren(SIREN);
        let findBySirenMock;
        beforeAll(
            () =>
                (findBySirenMock = jest
                    .spyOn(osirisService, "findBySiren")
                    // @ts-expect-error: mock
                    .mockImplementation(jest.fn(() => DATA))),
        );
        afterAll(() => findBySirenMock.mockRestore());

        it("should call findBySiren()", async () => {
            await osirisService.getRawGrants(ASSOCIATION_IDENTIFIER);
            expect(findBySirenMock).toHaveBeenCalledWith(SIREN);
        });

        it("returns raw grant data", async () => {
            const actual = await osirisService.getRawGrants(ASSOCIATION_IDENTIFIER);
            expect(actual).toMatchInlineSnapshot(`
                    [
                      {
                        "data": {
                          "providerInformations": {
                            "ej": "EJ",
                          },
                        },
                        "joinKey": "EJ",
                        "provider": "osiris",
                        "type": "application",
                      },
                    ]
                `);
        });
    });

    describe("rawToCommon", () => {
        const RAW = "RAW";
        const ADAPTED = {};

        beforeAll(() => {
            OsirisRequestAdapter.toCommon
                // @ts-expect-error: mock
                .mockImplementation(input => input.toString());
        });

        afterAll(() => {
            // @ts-expect-error: mock
            OsirisRequestAdapter.toCommon.mockReset();
        });

        it("calls adapter with data from raw grant", () => {
            // @ts-expect-error: mock
            osirisService.rawToCommon({ data: RAW });
            expect(OsirisRequestAdapter.toCommon).toHaveBeenCalledWith(RAW);
        });
        it("returns result from adapter", () => {
            // @ts-expect-error: mock
            OsirisRequestAdapter.toCommon.mockReturnValueOnce(ADAPTED);
            const expected = ADAPTED;
            // @ts-expect-error: mock
            const actual = osirisService.rawToCommon({ data: RAW });
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

    describe("saveFlatFromStream", () => {
        it("calls application flat with stream", async () => {
            const APPLICATIONS = [ENTITY];
            const STREAM = ReadableStream.from(APPLICATIONS);
            await osirisService.saveFlatFromStream(STREAM);
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
        let mockSaveFlatFromStream: jest.SpyInstance;

        beforeEach(() => {
            // @ts-expect-error: mock private method
            mockCreateStream = jest.spyOn(osirisService, "createStream").mockReturnValue(STREAM);
            mockSaveFlatFromStream = jest.spyOn(osirisService, "saveFlatFromStream").mockImplementation(jest.fn());
            jest.spyOn(osirisJoiner, cursorMethod).mockReturnValue(CURSOR);
        });

        afterAll(() => {
            mockCreateStream.mockRestore();
            mockSaveFlatFromStream.mockRestore();
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
            expect(mockSaveFlatFromStream).toHaveBeenCalledWith(STREAM);
        });
    });

    // describe("addApplicationsFlat", () => {
    //     const REQUESTS = [{ ...REQUEST_DBO, actions: [ACTION_ENTITY] }];
    //     beforeEach(() => {
    //         jest.mocked(OsirisRequestAdapter.toApplicationFlat).mockReturnValue(ENTITY);
    //         jest.mocked(applicationFlatService.saveFromStream).mockResolvedValue();
    //     });
    //     it("adapts request with actions to application flat", async () => {
    //         await osirisService.addApplicationsFlat(REQUESTS);
    //         expect(OsirisRequestAdapter.toApplicationFlat).toHaveBeenCalledWith(REQUESTS[0]);
    //     });

    //     it("creates a stream of applications to be transmitted to application flat service", async () => {
    //         await osirisService.addApplicationsFlat(REQUESTS);
    //         const stream = jest.mocked(applicationFlatService.saveFromStream).mock.calls[0][0] as ReadableStream;
    //         const expected = [ENTITY];
    //         const actual: ApplicationFlatEntity[] = [];
    //         for await (const entity of stream) {
    //             actual.push(entity);
    //         }
    //         expect(actual).toEqual(expected);
    //     });

    //     it("passes stream of applications to application flat service", async () => {
    //         await osirisService.addApplicationsFlat(REQUESTS);
    //         expect(jest.mocked(applicationFlatService.saveFromStream).mock.calls[0][0]).toBeInstanceOf(ReadableStream);
    //     });
    // });
});
