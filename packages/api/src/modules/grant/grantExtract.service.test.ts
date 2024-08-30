import paymentService from "../payments/payments.service";
import grantExtractService from "./grantExtract.service";
import { Association, Grant, SimplifiedEtablissement } from "dto";
import grantService from "./grant.service";
import associationsService from "../associations/associations.service";
import GrantAdapter from "./grant.adapter";
import csvStringifier = require("csv-stringify/sync");
import { ExtractHeaderLabel, GrantToExtract } from "./@types/GrantToExtract";
import { isSiren } from "../../shared/Validators";

jest.mock("./grant.service");
jest.mock("../associations/associations.service");
jest.mock("../payments/payments.service");
jest.mock("./grant.adapter");
jest.mock("csv-stringify/sync");
jest.mock("../../shared/Validators");

describe("GrantExtractService", () => {
    describe("buildCsv", () => {
        const IDENTIFIER = "A";
        const GRANTS = [1, 2, 3] as unknown as Grant[];
        const ESTABS = [{ siret: [{ value: "1234567890" }] }] as unknown as SimplifiedEtablissement[];
        const ASSO = { denomination_siren: [{ value: "NomAsso" }] } as unknown as Association;
        const ESTABS_BY_SIRET = { 1234567890: ESTABS[0] };

        let separateByExerciseSpy: jest.SpyInstance;

        beforeAll(() => {
            separateByExerciseSpy = jest.spyOn(grantExtractService, "separateByExercise").mockImplementation(v => v); // TODO mock
            jest.mocked(grantService.getGrants).mockResolvedValue(GRANTS);
            jest.mocked(associationsService.getAssociation).mockResolvedValue(ASSO);
            jest.mocked(associationsService.getEstablishments).mockResolvedValue(ESTABS);
            jest.mocked(isSiren).mockReturnValue(true);
        });

        afterAll(() => {
            separateByExerciseSpy.mockRestore();
            jest.mocked(grantService.getGrants).mockRestore();
            jest.mocked(associationsService.getAssociation).mockRestore();
            jest.mocked(associationsService.getEstablishments).mockRestore();
            jest.mocked(isSiren).mockRestore();
        });

        it("gets grants", async () => {
            await grantExtractService.buildCsv(IDENTIFIER);
            expect(grantService.getGrants).toHaveBeenCalledWith(IDENTIFIER);
        });

        it("gets association", async () => {
            await grantExtractService.buildCsv(IDENTIFIER); // TODO modify to handle estab identifier
            expect(associationsService.getAssociation).toHaveBeenCalledWith(IDENTIFIER);
        });

        it("gets establishments", async () => {
            await grantExtractService.buildCsv(IDENTIFIER); // TODO modify to handle estab identifier
            expect(associationsService.getEstablishments).toHaveBeenCalledWith(IDENTIFIER);
        });

        it("separates grants", async () => {
            await grantExtractService.buildCsv(IDENTIFIER);
            expect(separateByExerciseSpy).toHaveBeenCalledWith(GRANTS);
        });

        it("calls adapter for each separated grant and gotten asso and estabsBySiret", async () => {
            await grantExtractService.buildCsv(IDENTIFIER);
            expect(GrantAdapter.grantToExtractLine).toHaveBeenCalledWith(1, ASSO, ESTABS_BY_SIRET);
            expect(GrantAdapter.grantToExtractLine).toHaveBeenCalledWith(2, ASSO, ESTABS_BY_SIRET);
            expect(GrantAdapter.grantToExtractLine).toHaveBeenCalledWith(3, ASSO, ESTABS_BY_SIRET);
        });

        it("stringifies adapted grants to csv", async () => {
            jest.mocked(GrantAdapter.grantToExtractLine).mockReturnValueOnce("1" as unknown as GrantToExtract);
            jest.mocked(GrantAdapter.grantToExtractLine).mockReturnValueOnce("2" as unknown as GrantToExtract);
            jest.mocked(GrantAdapter.grantToExtractLine).mockReturnValueOnce("3" as unknown as GrantToExtract);
            await grantExtractService.buildCsv(IDENTIFIER);
            expect(csvStringifier.stringify).toHaveBeenCalledWith(expect.any(Array), {
                header: true,
                columns: ExtractHeaderLabel,
            });
        });

        it("returns stringified csv", async () => {
            const expected = "csv";
            jest.mocked(csvStringifier.stringify).mockReturnValueOnce(expected);
            const actual = (await grantExtractService.buildCsv(IDENTIFIER)).csv;
            expect(actual).toBe(expected);
        });

        it("returns proper filename", async () => {
            const FAKE_NOW = new Date("2022-01-01");
            jest.useFakeTimers().setSystemTime(FAKE_NOW);
            const expected = "DataSubvention-NomAsso-A-2022-01-01";
            jest.mocked(csvStringifier.stringify).mockReturnValueOnce(expected);
            const actual = (await grantExtractService.buildCsv(IDENTIFIER)).fileName;
            expect(actual).toBe(expected);
        });
    });

    describe("separateByExercise", () => {
        let separateOneBy: jest.SpyInstance;

        beforeAll(() => {
            separateOneBy = jest.spyOn(grantExtractService, "separateOneByExercise").mockReturnValue([]);
        });

        afterAll(() => {
            separateOneBy.mockRestore();
        });

        it("calls separateOneByExercise for each grant", () => {
            grantExtractService.separateByExercise([1, 2, 3] as unknown as Grant[]);
            expect(separateOneBy).toHaveBeenCalledTimes(3);
        });

        it("returns flattened result from separateOneByExercise", () => {
            separateOneBy.mockReturnValueOnce([1, 2]);
            separateOneBy.mockReturnValueOnce([3]);
            separateOneBy.mockReturnValueOnce([4, 5]);
            const expected = [1, 2, 3, 4, 5];
            const actual = grantExtractService.separateByExercise([1, 2, 3] as unknown as Grant[]);
            expect(actual).toEqual(expected);
        });
    });

    describe("separateOneByExercise", () => {
        const APPLICATION = { id: 1, annee_demande: { value: 2022 } };
        const PAYMENT = (annee = 2022) => ({ annee });
        const mockGetPaymentYear = jest.fn(payment => payment.annee);
        const DISPARATE_PAYMENTS = [PAYMENT(2022), PAYMENT(2023), PAYMENT(2022)];

        beforeAll(() => {
            jest.mocked(paymentService.getPaymentExercise).mockImplementation(mockGetPaymentYear);
        });

        it("calls getPaymentExercise for each payment", () => {
            // @ts-expect-error -- mocked args
            grantExtractService.separateOneByExercise({ application: null, payments: DISPARATE_PAYMENTS });
            expect(mockGetPaymentYear).toHaveBeenCalledTimes(3);
        });

        it("separates application and payments from different years", () => {
            const expected = [
                {
                    application: APPLICATION,
                    payments: [PAYMENT(2022), PAYMENT(2022)],
                },
                { application: null, payments: [PAYMENT(2023)] },
            ];
            const actual = grantExtractService.separateOneByExercise({
                // @ts-expect-error -- mocked args
                application: APPLICATION,
                // @ts-expect-error -- mocked args
                payments: DISPARATE_PAYMENTS,
            });
            expect(actual).toEqual(expected);
        });
    });
});
