import GetProviderDetailsUseCase from "./get-provider-details.use-case";
import GetOsirisDetailsUseCase from "../../providers/osiris/use-cases/get-osiris-details.use-case";
import osirisActionAdapter from "../../../adapters/outputs/db/providers/osiris/osiris.action.adapter";

jest.mock("../../providers/osiris/use-cases/get-osiris-details.use-case");

describe("GetProviderDetailsUseCase", () => {
    const OSIRIS_RESULT = { details: { actions: [{ intitule: "Action", description: "Desc" }] } };
    let getOsirisDetailsMock: jest.Mocked<GetOsirisDetailsUseCase>;
    let useCase: GetProviderDetailsUseCase;

    beforeEach(() => {
        getOsirisDetailsMock = new GetOsirisDetailsUseCase(osirisActionAdapter) as jest.Mocked<GetOsirisDetailsUseCase>;
        getOsirisDetailsMock.execute = jest.fn().mockResolvedValue(OSIRIS_RESULT);
        useCase = new GetProviderDetailsUseCase(getOsirisDetailsMock);
    });

    describe("osiris provider", () => {
        it("delegates to GetOsirisDetailsUseCase", async () => {
            await useCase.execute("osiris", "DR-CENT-21-0002");
            expect(getOsirisDetailsMock.execute).toHaveBeenCalledWith("DR-CENT-21-0002");
        });

        it("returns osiris details", async () => {
            const result = await useCase.execute("osiris", "DR-CENT-21-0002");
            expect(result).toEqual(OSIRIS_RESULT);
        });
    });

    describe("uncovered provider", () => {
        it("throws NotFoundError", async () => {
            await expect(useCase.execute("demarches-simplifiees", "id")).rejects.toThrow(
                "Uncovered provider: demarches-simplifiees",
            );
        });
    });
});
