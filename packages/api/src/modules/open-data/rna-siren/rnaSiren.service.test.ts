import rnaSirenService from "./rnaSiren.service";
import { NotFoundError } from "../../../shared/errors/httpErrors";

const mockToSiren = jest.fn(identifier => "000000000");

jest.mock("../../../shared/helpers/SirenHelper", () => ({
    __esModule: true,
    siretToSiren: identifier => mockToSiren(identifier)
}));

describe("rnaSirenService", () => {
    describe("findMatch", () => {
        const SIREN = "000000000";
        const SIRET = "000000000000001";
        const RNA = "W123456789";
        const mockGetSiren = jest.spyOn(rnaSirenService, "getSiren");
        const mockGetRna = jest.spyOn(rnaSirenService, "getRna");

        beforeAll(() => {
            mockGetSiren.mockResolvedValue(SIREN);
            mockGetRna.mockResolvedValue(RNA);
        });

        afterAll(() => {
            mockGetSiren.mockRestore();
            mockGetRna.mockRestore();
        });

        it.each`
            methodName        | spy             | identifierType | identifier
            ${"getSiren"}     | ${mockGetSiren} | ${"rna"}       | ${RNA}
            ${"getRna"}       | ${mockGetRna}   | ${"siren"}     | ${SIREN}
            ${"getRna"}       | ${mockGetRna}   | ${"siret"}     | ${SIRET}
            ${"siretToSiren"} | ${mockToSiren}  | ${"siret"}     | ${SIRET}
        `("calls $methodName if is $identifierType", async ({ spy, identifier }) => {
            await rnaSirenService.findMatch(identifier);
            expect(spy).toBeCalledWith(identifier);
        });

        it.each`
            mock            | identifierType | identifier
            ${mockGetSiren} | ${"rna"}       | ${RNA}
            ${mockGetRna}   | ${"siren"}     | ${SIREN}
        `("fails if not $identifierType are found", async ({ mock, identifier }) => {
            mock.mockResolvedValueOnce(null);
            const test = () => rnaSirenService.findMatch(identifier);
            const expectedMsg = "Nous n'avons pas réussi à trouver une correspondance RNA-Siren";
            await expect(test).rejects.toThrowError(new NotFoundError(expectedMsg));
        });

        it.each`
            identifierType | identifier
            ${"rna"}       | ${RNA}
            ${"siren"}     | ${SIREN}
            ${"siret"}     | ${SIRET}
        `("returns expected res from $identifierType", async ({ identifier }) => {
            const expected = { siren: SIREN, rna: RNA };
            const actual = await rnaSirenService.findMatch(identifier);
            expect(actual).toEqual(expected);
        });
    });
});
