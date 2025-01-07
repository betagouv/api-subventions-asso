const findOneAndUpdateMock = jest.fn(async entity => ({ value: {} }));

const mongoMock = jest.mock("../../../../shared/MongoConnection", () => ({
    __esModule: true, // this property makes it work
    default: {
        collection: () => ({
            insertOne: jest.fn(),
            findOneAndUpdate: findOneAndUpdateMock,
        }),
    },
}));
import db from "../../../../shared/MongoConnection";
import OsirisActionEntity from "../../../../modules/providers/osiris/entities/OsirisActionEntity";
import MongoCnxError from "../../../../shared/errors/MongoCnxError";
import OsirisActionAdapter from "./osirisAction.adapter";
import { OsirisActionPort } from "./osiris.action.port";
import { ObjectId, WithId } from "mongodb";

const toDboMock = jest.spyOn(OsirisActionAdapter, "toDbo");
const toEntityMock = jest.spyOn(OsirisActionAdapter, "toEntity");
const findByOsirisIdMock = jest.spyOn(OsirisActionPort.prototype, "findByUniqueId");

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
    const ENTITY_WITH_ID = Object.assign({ _id: new ObjectId("6239dd8a674c33bdf741f56b") }, ENTITY);
    describe("add()", () => {
        it("should insert an OsirisActionEntityDbo and return entity", async () => {
            // @ts-expect-error: mock
            findByOsirisIdMock.mockImplementationOnce(jest.fn(() => ({})));
            toDboMock.mockImplementationOnce(jest.fn());
            const entity = await port.add(ENTITY);
            expect(toDboMock).toHaveBeenCalledWith(ENTITY);
            expect(entity).toEqual(ENTITY);
        });
    });

    describe("update()", () => {
        beforeAll(() => {
            toDboMock.mockImplementation(entity => entity);
            toEntityMock.mockImplementation(entity => entity);
        });

        afterAll(() => {
            toDboMock.mockReset();
            toEntityMock.mockReset();
        });

        it("calls findOneAndUpdate() with given action without id", async () => {
            await port.update(ENTITY_WITH_ID);
            // @ts-expect-error: weird
            expect(findOneAndUpdateMock.mock.calls[0][1].$set).toEqual(ENTITY);
        });

        it("should throw MongoCnxError if connexion is lost", async () => {
            // @ts-expect-error: mock
            findOneAndUpdateMock.mockImplementationOnce(() => ({ value: undefined }));
            const expected = new MongoCnxError();
            let actual;
            try {
                actual = await port.update(ENTITY_WITH_ID);
            } catch (e) {
                actual = e;
            }
            expect(actual).toEqual(expected);
        });
    });
});
