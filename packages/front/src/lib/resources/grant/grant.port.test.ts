import requestsService from "$lib/services/requests.service";
import type { ApplicationFlatDto } from "dto";
import grantPort from "./grant.port";
vi.mock("$lib/services/requests.service");

describe("Grant Port", () => {
    // @ts-expect-error: mock dto
    const APPLICATION_FLAT: ApplicationFlatDto = {
        fournisseur: "osiris",
        idSubventionProvider: "osiris-id-provider",
    };

    describe("getApplicationProviderDetails", () => {
        const DETAILS = { foo: "bar" };
        it("returns details", async () => {
            // @ts-expect-error: mock axios response
            vi.mocked(requestsService.get).mockResolvedValue({ data: { details: DETAILS } });
            const expected = DETAILS;
            const actual = await grantPort.getApplicationProviderDetails(APPLICATION_FLAT);
            expect(actual).toEqual(expected);
        });
    });
});
