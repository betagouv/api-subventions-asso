const CONTACT = "contact@datasubvention.beta.gouv.fr";

const mockGetContact = vi.fn(() => CONTACT);

vi.mock("svelte", () => ({
    __esModule: true, // this property makes it work
    // thanks to https://www.bam.tech/article/fix-vi-mock-cannot-access-before-initialization-error
    getContext: vi.fn().mockImplementation(() => ({
        getContact: mockGetContact,
    })),
}));
import { getContext } from "svelte";

vi.mock("$lib/services/router.service");
import NotFoundController from "./NotFound.controller";

describe("NotFoundController", () => {
    describe("constructor and static values", () => {
        it("gets context", () => {
            new NotFoundController();
            expect(getContext).toBeCalled();
        });

        it("sets app with return value from context", () => {
            const ctrl = new NotFoundController();
            const expected = getContext("");
            const actual = ctrl.app;
            expect(actual).toEqual(expected);
        });
    });
});
