import {
    DRAFT_ENTITY,
    APPLICATION_LINK_TO_CHORUS,
    APPLICATION_FLAT_DBOS,
} from "./__fixtures__/application-flat.fixture";
import ApplicationFlatMapper from "./application-flat.mapper";
import EstablishmentIdentifier from "../../identifier-objects/EstablishmentIdentifier";

jest.mock("../../identifier-objects/EstablishmentIdentifier");
jest.mock("./application-flat.service");

describe("ApplicationFlatAdapter", () => {
    beforeAll(() => {
        jest.spyOn(EstablishmentIdentifier, "buildIdentifierFromString").mockReturnValue(
            APPLICATION_LINK_TO_CHORUS.beneficiaryEstablishmentId,
        );
    });

    describe("buildEntity", () => {
        it("returns entity with ids", () => {
            const expected = APPLICATION_LINK_TO_CHORUS;
            const actual = ApplicationFlatMapper.buildEntity(DRAFT_ENTITY);
            expect(actual).toEqual(expected);
        });
    });

    describe("dboToEntity", () => {
        it("returns entity", () => {
            const expected = APPLICATION_LINK_TO_CHORUS;
            const actual = ApplicationFlatMapper.dboToEntity(APPLICATION_FLAT_DBOS[0]);
            expect(actual).toEqual(expected);
        });
    });

    describe("entityToDbo", () => {
        it("return dbo", () => {
            const { _id, ...expected } = APPLICATION_FLAT_DBOS[0];
            const actual = ApplicationFlatMapper.entityToDbo(APPLICATION_LINK_TO_CHORUS);
            expect(actual).toEqual(expected);
        });
    });
});
