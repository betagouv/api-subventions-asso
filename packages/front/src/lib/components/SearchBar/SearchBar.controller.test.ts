import { SearchBarController } from "./SearchBar.controller";
import Dispatch from "$lib/core/Dispatch";
vi.mock("$lib/core/Dispatch");
const mockedDispatch = vi.mocked(Dispatch);

describe("SearchBarController", () => {
    describe("dispatchInput", () => {
        const spyDispatch = vi.fn();
        beforeAll(() => {
            mockedDispatch.getDispatcher.mockReturnValue(spyDispatch);
        });

        it("should dispatch submit", () => {
            const ctrl = new SearchBarController();
            ctrl.dispatchSubmit();
            expect(spyDispatch).toHaveBeenCalledWith("submit");
        });
    });
});
