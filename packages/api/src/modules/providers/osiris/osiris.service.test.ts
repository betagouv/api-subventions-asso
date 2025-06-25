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
import IOsirisRequestInformations from "./@types/IOsirisRequestInformations";
import { ObjectId } from "mongodb";
import IOsirisActionsInformations from "./@types/IOsirisActionsInformations";

jest.mock("./adapters/OsirisRequestAdapter");
jest.mock("../../../dataProviders/db/providers/osiris");
jest.mock("../../rna-siren/rnaSiren.service");

const SIREN = new Siren("123456789");
const SIRET = SIREN.toSiret("00000");
const RNA = new Rna("W123456789");

const REQUEST_ENTITY = new OsirisRequestEntity(
    { siret: SIRET.value, rna: RNA.value, name: "NAME" },
    {
        osirisId: "FAKE_ID_2",
        ej: "",
        amountAwarded: 0,
        dateCommission: new Date(),
        exercise: 2022,
    } as IOsirisRequestInformations,
    {},
    undefined,
    [],
);
const REQUEST_DBO = { _id: new ObjectId("685be74b0d6ac15b4e3ef6e7"), ...REQUEST_ENTITY };

const ACTION_ENTITY = new OsirisActionEntity(
    {
        osirisActionId: "FAKE_ID_2-001",
        exercise: 2022,
    } as unknown as IOsirisActionsInformations,
    {},
);

describe("OsirisService", () => {
    beforeAll(() => {
        // @ts-expect-error: disable adapter
        jest.mocked(OsirisRequestAdapter.toDemandeSubvention).mockReturnValue(entity => entity);
    });

    afterAll(() => {
        jest.mocked(OsirisRequestAdapter.toDemandeSubvention).mockRestore();
    });

    describe("findBySiret", () => {
        beforeEach(() => {
            jest.mocked(osirisRequestPort.findBySiret).mockResolvedValue([REQUEST_DBO]);
            jest.mocked(osirisActionPort.findByRequestUniqueId).mockResolvedValue([ACTION_ENTITY]);
        });

        it("returns request with actions", async () => {
            const expected = [{ ...REQUEST_DBO, actions: [ACTION_ENTITY] }];
            const actual = await osirisService.findBySiret(SIRET);
            expect(actual).toEqual(expected);
        });

        it("returns request without actions", async () => {
            jest.mocked(osirisActionPort.findByRequestUniqueId).mockResolvedValue([]);
            const expected = [{ ...REQUEST_DBO, actions: [] }];
            const actual = await osirisService.findBySiret(SIRET);
            expect(actual).toEqual(expected);
        });
    });

    describe("findBySiren", () => {
        beforeEach(() => {
            jest.mocked(osirisRequestPort.findBySiren).mockResolvedValue([REQUEST_DBO]);
            jest.mocked(osirisActionPort.findBySiren).mockResolvedValue([ACTION_ENTITY]);
        });

        it("returns request with actions", async () => {
            const expected = [{ ...REQUEST_DBO, actions: [ACTION_ENTITY] }];
            const actual = await osirisService.findBySiren(SIREN);
            expect(actual).toEqual(expected);
        });

        it("returns request without actions", async () => {
            jest.mocked(osirisActionPort.findBySiren).mockResolvedValue([]);
            const expected = [{ ...REQUEST_DBO, actions: [] }];
            const actual = await osirisService.findBySiren(SIREN);
            expect(actual).toEqual(expected);
        });
    });

    describe("findByRna", () => {
        beforeEach(() => {
            jest.mocked(osirisRequestPort.findByRna).mockResolvedValue([REQUEST_DBO]);
            jest.mocked(osirisActionPort.findByRequestUniqueId).mockResolvedValue([ACTION_ENTITY]);
        });

        it("returns request with actions", async () => {
            const expected = [{ ...REQUEST_DBO, actions: [ACTION_ENTITY] }];
            const actual = await osirisService.findByRna(RNA);
            expect(actual).toEqual(expected);
        });

        it("returns request without actions", async () => {
            jest.mocked(osirisActionPort.findByRequestUniqueId).mockResolvedValue([]);
            const expected = [{ ...REQUEST_DBO, actions: [] }];
            const actual = await osirisService.findByRna(RNA);
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
});
