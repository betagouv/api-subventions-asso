import Rna from "../../../identifier-objects/Rna";
import Siren from "../../../identifier-objects/Siren";
import Siret from "../../../identifier-objects/Siret";
import osirisService, { InvalidOsirisRequestError, VALID_REQUEST_ERROR_CODE } from "./osiris.service";
import { osirisActionAdapter, osirisRequestAdapter } from "../../../adapters/outputs/db/providers/osiris";
import OsirisActionEntity from "./entities/OsirisActionEntity";
import OsirisRequestEntity from "./entities/OsirisRequestEntity";
import rnaSirenService from "../../rna-siren/rna-siren.service";
import RnaSirenEntity from "../../../entities/RnaSirenEntity";
import { ReadableStream } from "stream/web";
import { APPLICATION_LINK_TO_CHORUS } from "../../application-flat/__fixtures__/application-flat.fixture";
import applicationFlatService from "../../application-flat/application-flat.service";
import { OSIRIS_ID, REQUEST_ENTITY, REQUEST_DBO } from "./__fixtures__/osiris.request.fixtures";
import { ACTION_ENTITY } from "./__fixtures__/osiris.action.fixtures";
import { cursorToStream } from "../../application-flat/application-flat.helper";
import osirisJoiner from "../../../adapters/outputs/db/providers/osiris/osiris.joiner";
import { ApplicationFlatEntity } from "../../../entities/flats/ApplicationFlatEntity";
import DEFAULT_ASSOCIATION from "../../../../tests/__fixtures__/association.fixture";

jest.mock("../../application-flat/application-flat.helper");
jest.mock("../../../adapters/outputs/db/providers/osiris");
jest.mock("../../rna-siren/rna-siren.service");
jest.mock("../../application-flat/application-flat.service");

const SIREN = new Siren(DEFAULT_ASSOCIATION.siren);
const SIRET = new Siret(REQUEST_ENTITY.association?.siret as string);
const RNA = new Rna(REQUEST_ENTITY.association?.rna as string);

describe("OsirisService", () => {
    const VALID_SIRET = SIRET.value;
    const VALID_RNA = RNA.value;
    const VALID_OSIRIS_ID = OSIRIS_ID;

    describe.each`
        method           | identifier
        ${"findBySiret"} | ${SIRET}
        ${"findBySiren"} | ${SIREN}
        ${"findByRna"}   | ${RNA}
    `("$method", ({ method, identifier }) => {
        beforeEach(() => {
            jest.mocked(osirisRequestAdapter[method]).mockResolvedValue([REQUEST_DBO]);

            if (method === "findBySiren") {
                // mock used in findBySiren
                jest.mocked(osirisActionAdapter.findBySiren).mockResolvedValue([ACTION_ENTITY]);
            } else {
                // mock used in findBySiret & findByRna
                jest.mocked(osirisActionAdapter.findByRequestUniqueId).mockResolvedValue([ACTION_ENTITY]);
            }
        });

        it("returns request with actions", async () => {
            const expected = [{ ...REQUEST_DBO, actions: [ACTION_ENTITY] }];
            const actual = await osirisService[method](identifier);
            expect(actual).toEqual(expected);
        });

        it("returns request without actions", async () => {
            if (method === "findBySiren") {
                jest.mocked(osirisActionAdapter.findBySiren).mockResolvedValue([]);
            } else {
                jest.mocked(osirisActionAdapter.findByRequestUniqueId).mockResolvedValue([]);
            }
            const expected = [{ ...REQUEST_DBO, actions: [] }];
            const actual = await osirisService[method](identifier);
            expect(actual).toEqual(expected);
        });
    });

    describe("bulkAddRequest", () => {
        const REQUESTS = [
            { association: { rna: "W000000001", siret: "12345678900001" } },
            { association: { rna: "W000000002", siret: "12345678900002" } },
        ] as unknown as OsirisRequestEntity[];

        it("calls osiris port", async () => {
            await osirisService.bulkAddRequest(REQUESTS);
            expect(osirisRequestAdapter.bulkUpsert).toHaveBeenCalledWith(REQUESTS);
        });

        it("calls rna siren", async () => {
            await osirisService.bulkAddRequest(REQUESTS);
            expect(rnaSirenService.insertMany).toHaveBeenCalledWith([
                { rna: new Rna("W000000001"), siren: new Siren("123456789") },
                { rna: new Rna("W000000002"), siren: new Siren("123456789") },
            ]);
        });
    });

    describe("bulkAddActions", () => {
        const ACTIONS = ["a1", "a2"] as unknown as OsirisActionEntity[];

        it("calls port", async () => {
            await osirisService.bulkAddActions(ACTIONS);
            expect(osirisActionAdapter.bulkUpsert).toHaveBeenCalledWith(ACTIONS);
        });
    });

    describe("validRequest", () => {
        const VALID_CAID = REQUEST_ENTITY.dossier.compteAssoId;
        const VALID_NAME = REQUEST_ENTITY.association!.nom;

        const makeRequest = (overrides: { dossier?: object; association?: object } = {}): OsirisRequestEntity =>
            ({
                dossier: {
                    osirisId: VALID_OSIRIS_ID,
                    compteAssoId: VALID_CAID,
                    exerciceBudgetaire: 2024,
                    ...overrides.dossier,
                },
                association: { siret: VALID_SIRET, rna: VALID_RNA, nom: VALID_NAME, ...overrides.association },
                updateDate: new Date(),
            }) as unknown as OsirisRequestEntity;

        it("returns INVALID_SIRET when siret is invalid", () => {
            const result = osirisService.validRequest(makeRequest({ association: { siret: "NOT-AN-SIRET" } }));
            expect(result).toMatchObject({ code: VALID_REQUEST_ERROR_CODE.INVALID_SIRET });
        });

        it("returns INVALID_OSIRISID when osirisId is invalid", () => {
            const result = osirisService.validRequest(makeRequest({ dossier: { osirisId: "" } }));
            expect(result).toMatchObject({ code: VALID_REQUEST_ERROR_CODE.INVALID_OSIRISID });
        });

        it("returns true when all fields are valid", () => {
            expect(osirisService.validRequest(makeRequest())).toBe(true);
        });

        it.each([
            { label: "present but invalid", rna: "NOT-AN-RNA" },
            { label: "empty string", rna: "" },
            { label: "undefined", rna: undefined },
        ])("returns INVALID_RNA when rna is $label", ({ rna }) => {
            const result = osirisService.validRequest(makeRequest({ association: { rna } }));
            expect(result).toMatchObject({ code: VALID_REQUEST_ERROR_CODE.INVALID_RNA });
        });

        it("returns true when rnaNeeded=false and rna is absent", () => {
            expect(osirisService.validRequest(makeRequest({ association: { rna: undefined } }), false)).toBe(true);
        });

        it("patches association.nom to undefined when empty", () => {
            const req = makeRequest({ association: { nom: "" } });
            osirisService.validRequest(req);
            expect(req.association!.nom).toBeUndefined();
        });

        it("patches dossier.compteAssoId to undefined when malformed", () => {
            const req = makeRequest({ dossier: { compteAssoId: "NOT-AN-CAID" } });
            osirisService.validRequest(req);
            expect(req.dossier.compteAssoId).toBeUndefined();
        });
    });

    describe("validateAndComplete", () => {
        const INVALID_RNA = "NOT-AN-RNA";

        const makeRequest = (overrides: { dossier?: object; association?: object } = {}): OsirisRequestEntity =>
            ({
                dossier: { osirisId: VALID_OSIRIS_ID, exerciceBudgetaire: 2024, ...overrides.dossier },
                association: { siret: VALID_SIRET, ...overrides.association },
                updateDate: new Date(),
            }) as unknown as OsirisRequestEntity;

        let mockValidate: jest.SpyInstance;

        beforeAll(() => {
            mockValidate = jest.spyOn(osirisService, "validRequest").mockReturnValue(true);
        });
        afterAll(() => mockValidate.mockRestore());
        afterEach(() => {
            jest.mocked(rnaSirenService.find).mockResolvedValue([]);
            mockValidate.mockReturnValue(true);
        });

        it("does not look up rna when rna is already valid", async () => {
            await osirisService.validateAndComplete(makeRequest({ association: { rna: VALID_RNA } }));
            expect(rnaSirenService.find).not.toHaveBeenCalled();
        });

        it.each([
            { label: "invalid", rna: INVALID_RNA },
            { label: "absent", rna: undefined },
        ])("looks up rna from siret when rna is $label", async ({ rna }) => {
            await osirisService.validateAndComplete(makeRequest({ association: { rna } }));
            expect(rnaSirenService.find).toHaveBeenCalledWith(SIREN);
        });

        it("sets recovered rna on the entity when found", async () => {
            jest.mocked(rnaSirenService.find).mockResolvedValueOnce([{ rna: RNA }] as unknown as RnaSirenEntity[]);
            const req = makeRequest({ association: { rna: INVALID_RNA } });
            await osirisService.validateAndComplete(req);
            expect(req.association!.rna).toBe(VALID_RNA);
        });

        it("leaves rna unchanged when no match found", async () => {
            const req = makeRequest({ association: { rna: INVALID_RNA } });
            await osirisService.validateAndComplete(req);
            expect(req.association!.rna).toBe(INVALID_RNA);
        });

        it("leaves rna unchanged and does not throw when lookup fails", async () => {
            jest.mocked(rnaSirenService.find).mockRejectedValueOnce(new Error("Request failed with status code 401"));
            const req = makeRequest({ association: { rna: INVALID_RNA } });
            await osirisService.validateAndComplete(req);
            expect(req.association!.rna).toBe(INVALID_RNA);
        });

        it("passes rnaNeeded to validRequest", async () => {
            await osirisService.validateAndComplete(makeRequest(), false);
            expect(mockValidate).toHaveBeenCalledWith(expect.anything(), false);
        });

        it("throws InvalidOsirisRequestError when validRequest returns an error", async () => {
            const validationFailed = { message: "tata", code: VALID_REQUEST_ERROR_CODE.INVALID_OSIRISID, data: {} };
            mockValidate.mockReturnValueOnce(validationFailed);
            await expect(osirisService.validateAndComplete(makeRequest())).rejects.toEqual(
                new InvalidOsirisRequestError(validationFailed),
            );
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
            // @ts-expect-error: test private method with mocked cursor
            expect(osirisService.createStream(CURSOR)).toEqual(STREAM);
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
