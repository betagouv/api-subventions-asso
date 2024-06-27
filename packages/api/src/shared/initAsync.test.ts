import scdlService from "../modules/providers/scdl/scdl.service";
jest.mock("../modules/providers/scdl/scdl.service");
import { initAsync } from "./InitAsync";

describe("InitAsync", () => {
    it.each`
        service
        ${scdlService}
    `("should init $service", async ({ service }) => {
        await initAsync();
        expect(service.init).toHaveBeenCalled();
    });
});
