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

        beforeEach(() => {
            // @ts-expect-error: mock axios response
            vi.mocked(requestsService.get).mockResolvedValue({ data: { details: DETAILS } });
        });

        it("calls the correct endpoint", async () => {
            await grantPort.getApplicationProviderDetails(APPLICATION_FLAT);
            expect(requestsService.get).toHaveBeenCalledWith(
                `/subvention/details/${APPLICATION_FLAT.fournisseur}/${APPLICATION_FLAT.idSubventionProvider}`,
            );
        });

        it("returns details", async () => {
            const expected = DETAILS;
            const actual = await grantPort.getApplicationProviderDetails(APPLICATION_FLAT);
            expect(actual).toEqual(expected);
        });

        it("returns null without calling API for an unsupported provider", async () => {
            // @ts-expect-error: mock dto
            const unsupported: ApplicationFlatDto = {
                fournisseur: "demarches-simplifiees",
                idSubventionProvider: "id",
            };
            const actual = await grantPort.getApplicationProviderDetails(unsupported);
            expect(actual).toBeNull();
            expect(requestsService.get).not.toHaveBeenCalled();
        });
    });
});
