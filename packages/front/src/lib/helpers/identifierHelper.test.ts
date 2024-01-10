import * as IdentifierHelper from "./identifierHelper";
vi.mock("./identifierHelper", async () => ({
    original: await vi.importActual("./identifierHelper"),
    isRna: vi.fn().mockReturnValue(false),
    isSiren: vi.fn().mockReturnValue(false),
    isSiret: vi.fn().mockReturnValue(false),
    isIdentifier: vi.fn(),
}));
const mockedIdentifierHelper = vi.mocked(IdentifierHelper);

describe("IdentifierHelper", () => {
    describe("isIdentifier()", () => {
        beforeAll(async () => {
            // @ts-expect-error: add to mock
            mockedIdentifierHelper.isIdentifier = mockedIdentifierHelper.original.isIdentifier;
            mockedIdentifierHelper.isRna.mockReturnValue(true);
        });

        it("should write test", () => {
            expect(true).toBe(true);
        });

        // find a way to test isIdentifier but with mocked isRna and other named exported methods
    });
});
