import rnaSirenPort from "./rna-siren.port";
vi.mock("./rna-siren.port");
const mockedPort = vi.mocked(rnaSirenPort);
import rnaSirenService from "./rna-siren.service";

describe("RnaSirenService", () => {
    const RNA = "W000000000";
    describe("getAssociatedIdentifier()", () => {
        it("should call rnaSirenPort.getRnaSiren()", async () => {
            await rnaSirenService.getAssociatedIdentifier(RNA);
            expect(mockedPort.getRnaSiren).toHaveBeenCalledWith(RNA);
        });

        it("should return promise", () => {
            const expected = new Promise(vi.fn());
            // @ts-expect-error: mock
            mockedPort.getRnaSiren.mockReturnValueOnce(expected);
            const actual = rnaSirenService.getAssociatedIdentifier(RNA);
            expect(actual).toEqual(expected);
        });
    });
});
