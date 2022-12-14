import assoVisitsRepository from "../association-visits/repositories/associationVisits.repository";
import associationVisitsService from "./associationVisits.service";

describe("AssociationVisitsService", () => {
    describe("registerRequest()", () => {
        const assoVisitRepoMock = jest
            .spyOn(assoVisitsRepository, "updateAssoVisitCountByIncrement")
            .mockImplementation(jest.fn());

        const ASSO_NO_NAME = {};
        const SIREN_NAME = "NOM_SIREN";
        const RNA_NAME = "NOM_RNA";
        const ASSO_SIREN_NAME = { denomination_siren: [{ value: SIREN_NAME }] };
        const ASSO_RNA_NAME = { denomination_rna: [{ value: RNA_NAME }] };
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

    describe("getTopAssociations()", () => {
        const repoMock = jest.spyOn(assoVisitsRepository, "selectMostRequestsAssos");

        const LIMIT = 5;
        const mockedValue = [
            { name: "Asso 1", nbRequests: 42 },
            { name: "Asso 2", nbRequests: 41 },
            { name: "Asso 3", nbRequests: 40 },
            { name: "Asso 4", nbRequests: 39 },
            { name: "Asso 5", nbRequests: 38 }
        ];

        beforeEach(() => {
            repoMock.mockResolvedValueOnce(mockedValue);
        });

        it("should call repository", async () => {
            await associationVisitsService.getTopAssociations(LIMIT);
            expect(repoMock).toHaveBeenCalledWith(LIMIT);
        });

        it("should return result of service function", async () => {
            const actual = await associationVisitsService.getTopAssociations(LIMIT);
            expect(actual).toStrictEqual(mockedValue);
        });
    });
});
