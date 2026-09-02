import { GrantExtractService } from "./grant-extract.service";
import { Association, EstablishmentSimplifiedWithProviderValues } from "dto";
import grantService from "./grant.service";
import associationsService from "../associations/associations.service";
import GrantMapper from "./grant.mapper";
import * as csvStringifier from "csv-stringify/sync";
import { ExtractHeaderLabel, GrantToExtract } from "./@types/GrantToExtract";
import Siret from "../../identifier-objects/Siret";
import EstablishmentIdentifier from "../../identifier-objects/EstablishmentIdentifier";
import AssociationIdentifier from "../../identifier-objects/AssociationIdentifier";
import { GrantFlatEntity } from "../../entities/GrantFlatEntity";
import { NotFoundError } from "core";
import { GetAssociation } from "../associations/use-cases/get-association";

jest.mock("./grant.service");
jest.mock("../associations/associations.service");
jest.mock("../payments/payments.service");
jest.mock("./grant.mapper");
jest.mock("csv-stringify/sync");
jest.mock("../../shared/Validators");

describe("GrantExtractService", () => {
    describe("buildCsv", () => {
        const SIRET = new Siret("12345678912345");
        const IDENTIFIER = EstablishmentIdentifier.fromSiret(SIRET, AssociationIdentifier.fromSiren(SIRET.toSiren()));
        // @ts-expect-error: we don't care about the structure here
        const GRANTS: GrantFlatEntity[] = [1, 2, 3];
        const ESTABS = [{ siret: [{ value: SIRET.value }] }] as unknown as EstablishmentSimplifiedWithProviderValues[];
        const ASSO = { denomination_siren: [{ value: "NomAsso" }] } as unknown as Association;
        const ESTABS_BY_SIRET = { [SIRET.value]: ESTABS[0] };

        const mockGetAssociation = { execute: jest.fn() } as unknown as GetAssociation;
        let service;

        beforeAll(() => {
            jest.mocked(grantService.getGrants).mockResolvedValue(GRANTS);
            jest.mocked(mockGetAssociation.execute).mockResolvedValue(ASSO);
            jest.mocked(associationsService.getEstablishments).mockResolvedValue(ESTABS);
            service = new GrantExtractService(mockGetAssociation);
        });

        it("gets grants", async () => {
            await service.buildCsv(IDENTIFIER);
            expect(grantService.getGrants).toHaveBeenCalledWith(IDENTIFIER);
        });

        it("gets association", async () => {
            await service.buildCsv(IDENTIFIER); // TODO modify to handle estab identifier
            expect(mockGetAssociation.execute).toHaveBeenCalledWith(IDENTIFIER.associationIdentifier);
        });

        it("gets establishments", async () => {
            await service.buildCsv(IDENTIFIER); // TODO modify to handle estab identifier
            expect(associationsService.getEstablishments).toHaveBeenCalledWith(IDENTIFIER.associationIdentifier);
        });

        it("calls mapper for each separated grant and gotten asso and estabsBySiret", async () => {
            await service.buildCsv(IDENTIFIER);
            expect(GrantMapper.grantToExtractLine).toHaveBeenCalledWith(1, ASSO, ESTABS_BY_SIRET);
            expect(GrantMapper.grantToExtractLine).toHaveBeenCalledWith(2, ASSO, ESTABS_BY_SIRET);
            expect(GrantMapper.grantToExtractLine).toHaveBeenCalledWith(3, ASSO, ESTABS_BY_SIRET);
        });

        it("stringifies adapted grants to csv", async () => {
            jest.mocked(GrantMapper.grantToExtractLine).mockReturnValueOnce("1" as unknown as GrantToExtract);
            jest.mocked(GrantMapper.grantToExtractLine).mockReturnValueOnce("2" as unknown as GrantToExtract);
            jest.mocked(GrantMapper.grantToExtractLine).mockReturnValueOnce("3" as unknown as GrantToExtract);
            await service.buildCsv(IDENTIFIER);
            expect(csvStringifier.stringify).toHaveBeenCalledWith(expect.any(Array), {
                header: true,
                columns: ExtractHeaderLabel,
                delimiter: ";",
                bom: true,
                cast: { number: expect.any(Function) },
            });
        });

        it("converts number to comma style", async () => {
            jest.mocked(grantService.getGrants).mockResolvedValueOnce([1 as unknown as GrantFlatEntity]);
            jest.mocked(GrantMapper.grantToExtractLine).mockReturnValueOnce("1" as unknown as GrantToExtract);

            await service.buildCsv(IDENTIFIER);
            // @ts-expect-error -- ??
            const converter: (n: number) => string =
                jest.mocked(csvStringifier.stringify).mock.calls[0][1]?.cast?.number ?? (() => "");
            const expected = "20000012,3";
            const actual = converter(20000012.3);
            expect(actual).toBe(expected);
        });

        it("returns stringified csv", async () => {
            const expected = "csv";
            jest.mocked(csvStringifier.stringify).mockReturnValueOnce(expected);
            const actual = (await service.buildCsv(IDENTIFIER)).csv;
            expect(actual).toBe(expected);
        });

        it("returns proper filename", async () => {
            const FAKE_NOW = new Date("2022-01-01");
            jest.useFakeTimers().setSystemTime(FAKE_NOW);
            const expected = "DataSubvention-NomAsso-12345678912345-2022-01-01.csv";
            jest.mocked(csvStringifier.stringify).mockReturnValueOnce(expected);
            const actual = (await service.buildCsv(IDENTIFIER)).fileName;
            expect(actual).toBe(expected);
        });

        it("returns csv even if association details are not found", async () => {
            jest.mocked(mockGetAssociation.execute).mockRejectedValueOnce(new NotFoundError());
            jest.mocked(csvStringifier.stringify).mockReturnValueOnce("csv");

            const actual = await service.buildCsv(IDENTIFIER);

            expect(actual).toMatchObject({
                csv: "csv",
                fileName: expect.stringContaining("DataSubvention-12345678912345-"),
            });
        });

        it("returns csv even if establishment details are not found", async () => {
            jest.mocked(associationsService.getEstablishments).mockRejectedValueOnce(new NotFoundError());
            jest.mocked(csvStringifier.stringify).mockReturnValueOnce("csv");

            const actual = await service.buildCsv(IDENTIFIER);

            expect(actual.csv).toBe("csv");
        });
    });
});
