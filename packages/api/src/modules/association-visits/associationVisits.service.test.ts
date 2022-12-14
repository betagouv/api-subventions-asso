import assoVisitsRepository from "../association-visits/repositories/associationVisits.repository";
import associationVisitsService from "./associationsVisits.service";

describe("StatsService", () => {
    describe("getNbUsersByRequestsOnPeriod()", () => {
        const assoVisitRepoMock = jest
            .spyOn(assoVisitsRepository, "updateAssoVisitCountByIncrement")
            .mockImplementation(jest.fn());

        const ASSO_NO_NAME = {};
        const SIREN_NAME = "NOM_SIREN";
        const RNA_NAME = "NOM_RNA";
        const ASSO_SIREN_NAME = { denomination_siren: { value: SIREN_NAME } };
        const ASSO_RNA_NAME = { denomination_rna: { value: RNA_NAME } };
        const ASSO_2_NAMES = { ...ASSO_RNA_NAME, ASSO_SIREN_NAME };

        async function checkArgs(asso, expectedName) {
            const repo = assoVisitsRepository.updateAssoVisitCountByIncrement;
            await associationVisitsService.registerRequest(asso);
            expect(repo).toHaveBeenCalledWith(expectedName);
        }

        it("fails if no name", async () => {
            const repo = assoVisitsRepository.updateAssoVisitCountByIncrement;
            await associationVisitsService.registerRequest(ASSO_NO_NAME);
            expect(repo).toHaveBeenCalledTimes(0);
        });

        it("can use rna name", async () => {
            await checkArgs(ASSO_RNA_NAME, RNA_NAME);
        });

        it("can use siren name", async () => {
            await checkArgs(ASSO_SIREN_NAME, SIREN_NAME);
        });

        it("should use rna's name if both available", async () => {
            await checkArgs(ASSO_2_NAMES, RNA_NAME);
        });
    });
});
