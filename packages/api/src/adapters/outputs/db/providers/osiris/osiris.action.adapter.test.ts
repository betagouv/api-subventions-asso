const findOneAndUpdateMock = jest.fn(async () => ({ value: {} }));
const findMock = jest.fn(() => ({ toArray: jest.fn(async () => []) }));

jest.mock("../../../../../shared/MongoConnection", () => ({
    __esModule: true, // this property makes it work
    default: {
        collection: () => ({
            insertOne: jest.fn(),
            findOneAndUpdate: findOneAndUpdateMock,
            find: findMock,
        }),
    },
}));
import OsirisActionEntity from "../../../../../modules/providers/osiris/entities/OsirisActionEntity";
import { MongoCnxError } from "../../../../../shared/errors/MongoCnxError";
import { OsirisActionAdapter } from "./osiris.action.adapter";

describe("OsirisActionPort", () => {
    let port: OsirisActionAdapter;
    beforeEach(() => {
        port = new OsirisActionAdapter();
    });

    const OSIRIS_ACTION_ID = "OSIRIS_ACTION_ID";
    const ENTITY = {
        dossier: {
            osirisActionId: OSIRIS_ACTION_ID,
            uniqueId: "unique-id",
            requestUniqueId: "request-unique-id",
            exerciceBudgetaire: 2022,
        },
        updateDate: new Date(),
    } as OsirisActionEntity;
    describe("add()", () => {
        it("should insert an OsirisActionEntity and return entity", async () => {
            const entity = await port.add(ENTITY);
            expect(entity).toEqual(ENTITY);
        });
    });

    describe("update()", () => {
        it("calls findOneAndUpdate() with given action without id", async () => {
            await port.update(ENTITY);
            // @ts-expect-error: weird
            expect(findOneAndUpdateMock.mock.calls[0][1].$set).toEqual(ENTITY);
        });

        it("should throw MongoCnxError if connexion is lost", async () => {
            // @ts-expect-error: mock
            findOneAndUpdateMock.mockImplementationOnce(() => ({ value: undefined }));
            const expected = new MongoCnxError();
            let actual;
            try {
                actual = await port.update(ENTITY);
            } catch (e) {
                actual = e;
            }
            expect(actual).toEqual(expected);
        });
    });

    describe("findByOsirisId()", () => {
        const OSIRIS_ID = "DR-CENT-21-0002";

        beforeEach(() => {
            findMock.mockClear();
            findMock.mockReturnValue({ toArray: jest.fn(async () => [ENTITY]) });
        });

        it("queries collection with regex matching osirisId", async () => {
            await port.findByOsirisId(OSIRIS_ID);
            const query = findMock.mock.calls[0][0];
            expect(query["dossier.requestUniqueId"]).toBeInstanceOf(RegExp);
            expect(query["dossier.requestUniqueId"].test(`${OSIRIS_ID}-2023`)).toBe(true);
        });

        it("does not match a different osirisId that starts the same", async () => {
            await port.findByOsirisId(OSIRIS_ID);
            const query = findMock.mock.calls[0][0];
            expect(query["dossier.requestUniqueId"].test("DR-CENT-21-0002-EXTRA-2023")).toBe(false);
        });

        it("returns results from collection", async () => {
            const actual = await port.findByOsirisId(OSIRIS_ID);
            expect(actual).toEqual([ENTITY]);
        });
    });

    describe("findByOsirisIds()", () => {
        const OSIRIS_IDS = ["DR-CENT-21-0002", "DR-CENT-22-0001"];

        beforeEach(() => {
            findMock.mockClear();
            findMock.mockReturnValue({ toArray: jest.fn(async () => [ENTITY]) });
        });

        it("queries collection with $in of regexes", async () => {
            await port.findByOsirisIds(OSIRIS_IDS);
            const query = findMock.mock.calls[0][0];
            expect(query["dossier.requestUniqueId"].$in).toHaveLength(OSIRIS_IDS.length);
            expect(query["dossier.requestUniqueId"].$in[0]).toBeInstanceOf(RegExp);
        });

        it("returns results from collection", async () => {
            const actual = await port.findByOsirisIds(OSIRIS_IDS);
            expect(actual).toEqual([ENTITY]);
        });

        it("returns empty array for empty id list", async () => {
            findMock.mockReturnValueOnce({ toArray: jest.fn(async () => []) });
            const actual = await port.findByOsirisIds([]);
            expect(actual).toEqual([]);
        });
    });
});
