const CONTACT = "contact@datasubvention.beta.gouv.fr";

const mockGetContact = jest.fn(() => CONTACT);

jest.mock("svelte", () => ({
    __esModule: true, // this property makes it work
    // thanks to https://www.bam.tech/article/fix-jest-mock-cannot-access-before-initialization-error
    getContext: jest.fn().mockImplementation(() => ({
        getContact: mockGetContact
    }))
}));
import { getContext } from "svelte";

jest.mock("@services/router.service");
import ContactController from "./Contact.controller";

describe("ContactController", () => {
    describe("constructor and static values", () => {
        it("gets context", () => {
            new ContactController();
            expect(getContext).toBeCalled();
        });

        it("sets app with return value from context", () => {
            const ctrl = new ContactController();
            const expected = getContext();
            const actual = ctrl.app;
            expect(actual).toEqual(expected);
        });
    });
});
