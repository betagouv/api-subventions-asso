import grantExtractService from "./grantExtract.service";
import { Association, Grant, SimplifiedEtablissement } from "dto";
import grantService from "./grant.service";
import associationsService from "../associations/associations.service";
import GrantAdapter from "./grant.adapter";
import csvStringifier = require("csv-stringify/sync");
import { ExtractHeaderLabel, GrantToExtract } from "./@types/GrantToExtract";
import Siret from "../../valueObjects/Siret";
import EstablishmentIdentifier from "../../valueObjects/EstablishmentIdentifier";
import AssociationIdentifier from "../../valueObjects/AssociationIdentifier";
import Siren from "../../valueObjects/Siren";

jest.mock("./grant.service");
jest.mock("../associations/associations.service");
jest.mock("../payments/payments.service");
jest.mock("./grant.adapter");
jest.mock("csv-stringify/sync");
jest.mock("../../shared/Validators");

describe("GrantExtractService", () => {
    describe("buildCsv", () => {
        const SIRET = new Siret("12345678912345");
        const IDENTIFIER = EstablishmentIdentifier.fromSiret(SIRET, AssociationIdentifier.fromSiren(SIRET.toSiren()));
        const GRANTS = [1, 2, 3] as unknown as Grant[];
        const ESTABS = [{ siret: [{ value: SIRET.value }] }] as unknown as SimplifiedEtablissement[];
        const ASSO = { denomination_siren: [{ value: "NomAsso" }] } as unknown as Association;
        const ESTABS_BY_SIRET = { [SIRET.value]: ESTABS[0] };
        let isSirenSpy: jest.SpyInstance;

        beforeAll(() => {
            isSirenSpy = jest.spyOn(Siren, "isSiren").mockReturnValue(true);
            jest.mocked(grantService.handleMultiYearGrants).mockImplementation(v => v); // TODO mock
            jest.mocked(grantService.getGrants).mockResolvedValue(GRANTS);
            jest.mocked(associationsService.getAssociation).mockResolvedValue(ASSO);
            jest.mocked(associationsService.getEstablishments).mockResolvedValue(ESTABS);
        });

        afterAll(() => {
            isSirenSpy.mockRestore();
            jest.mocked(grantService.handleMultiYearGrants).mockRestore();
            jest.mocked(grantService.getGrants).mockRestore();
            jest.mocked(associationsService.getAssociation).mockRestore();
            jest.mocked(associationsService.getEstablishments).mockRestore();
        });

        it("gets grants", async () => {
            await grantExtractService.buildCsv(IDENTIFIER);
            expect(grantService.getGrants).toHaveBeenCalledWith(IDENTIFIER);
        });

        it("gets association", async () => {
            await grantExtractService.buildCsv(IDENTIFIER); // TODO modify to handle estab identifier
            expect(associationsService.getAssociation).toHaveBeenCalledWith(IDENTIFIER.associationIdentifier);
        });

        it("gets establishments", async () => {
            await grantExtractService.buildCsv(IDENTIFIER); // TODO modify to handle estab identifier
            expect(associationsService.getEstablishments).toHaveBeenCalledWith(IDENTIFIER.associationIdentifier);
        });

        it("separates grants", async () => {
            await grantExtractService.buildCsv(IDENTIFIER);
            expect(grantService.handleMultiYearGrants).toHaveBeenCalledWith(GRANTS);
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
                delimiter: ";",
                bom: true,
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
            const expected = "DataSubvention-NomAsso-12345678912345-2022-01-01.csv";
            jest.mocked(csvStringifier.stringify).mockReturnValueOnce(expected);
            const actual = (await grantExtractService.buildCsv(IDENTIFIER)).fileName;
            expect(actual).toBe(expected);
        });
    });
});
