import { Ridet } from "../../../identifier-objects";
import { APPLICATION_LINK_TO_CHORUS } from "../__fixtures__/application-flat.fixture";
import { TransformToDemandeSubvention } from "./transform-to-demande-subvention";

describe("TransformToDemandeSubvention Use Case", () => {
    const useCase = new TransformToDemandeSubvention();

    it("returns null if no siret", () => {
        const expected = null;
        const actual = useCase.execute({
            ...APPLICATION_LINK_TO_CHORUS,
            beneficiaryEstablishmentId: new Ridet("1234567890"),
        });
        expect(actual).toEqual(expected);
    });

    it("adapts properly", () => {
        const actual = useCase.execute(APPLICATION_LINK_TO_CHORUS);
        expect(actual).toMatchSnapshot();
    });
});
