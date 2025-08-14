const findOneAndUpdateMock = jest.fn(async () => ({ value: {} }));

jest.mock("../../../../shared/MongoConnection", () => ({
    __esModule: true, // this property makes it work
    default: {
        collection: () => ({
            insertOne: jest.fn(),
            findOneAndUpdate: findOneAndUpdateMock,
        }),
    },
}));
import OsirisActionEntity from "../../../../modules/providers/osiris/entities/OsirisActionEntity";
import { MongoCnxError } from "../../../../shared/errors/MongoCnxError";
import { OsirisActionPort } from "./osiris.action.port";

describe("OsirisActionPort", () => {
    let port: OsirisActionPort;
    beforeEach(() => {
        port = new OsirisActionPort();
    });

    const OSIRIS_ACTION_ID = "OSIRIS_ACTION_ID";
    const ENTITY = {
        indexedInformations: { osirisActionId: OSIRIS_ACTION_ID },
        data: {},
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
});
