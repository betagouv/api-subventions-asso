import { DemandeSubvention, Etablissement } from "dto";
import Flux from "../../shared/Flux";
import etablissementsService from "../../modules/etablissements/etablissements.service";
import { EtablissementHttp } from "./Etablissement.http";
import EstablishmentIdentifier from "../../valueObjects/EstablishmentIdentifier";
import Siren from "../../valueObjects/Siren";
import AssociationIdentifier from "../../valueObjects/AssociationIdentifier";
import establishmentIdentifierService from "../../modules/establishment-identifier/establishment-identifier.service";
import grantExtractService from "../../modules/grant/grantExtract.service";
import consumers from "stream/consumers";

jest.mock("../../modules/grant/grantExtract.service");

const controller = new EtablissementHttp();

describe("EtablissementHttp", () => {
    const SIREN = new Siren("000000001");
    const SIRET = SIREN.toSiret("00000");
    const ASSOCIATION_ID = AssociationIdentifier.fromSiren(SIREN);
    const ESTABLISHMENT_ID = EstablishmentIdentifier.fromSiret(SIRET, ASSOCIATION_ID);

    beforeAll(() => {
        jest.spyOn(establishmentIdentifierService, "getEstablishmentIdentifiers").mockImplementation(
            async () => ESTABLISHMENT_ID,
        );
    });

    describe("getDemandeSubventions", () => {
        const getSubventionsSpy = jest.spyOn(etablissementsService, "getSubventions");
        it("should call service with args", async () => {
            const subventions = [{}] as DemandeSubvention[];
            const flux = new Flux({ subventions });
            flux.close();
            // @ts-expect-error: mock
            getSubventionsSpy.mockImplementationOnce(() => flux);
            await controller.getDemandeSubventions(SIRET.value);
            expect(getSubventionsSpy).toHaveBeenCalledWith(ESTABLISHMENT_ID);
        });

        it("should return a grant requests", async () => {
            const subventions = [{}] as DemandeSubvention[];
            const flux = new Flux({ subventions });

            // @ts-expect-error: mock
            getSubventionsSpy.mockImplementationOnce(() => flux);
            const expected = { subventions };
            const promise = controller.getDemandeSubventions(SIRET.value);
            flux.close();

            expect(await promise).toEqual(expected);
        });
    });

    describe("getPayments", () => {
        const getSubventionsSpy = jest.spyOn(etablissementsService, "getPayments");
        it("should call service with args", async () => {
            getSubventionsSpy.mockImplementationOnce(jest.fn());
            await controller.getPaymentsEstablishement(SIRET.value);
            expect(getSubventionsSpy).toHaveBeenCalledWith(ESTABLISHMENT_ID);
        });

        it("should return payments", async () => {
            // @ts-expect-error: mock
            getSubventionsSpy.mockImplementationOnce(() => payments);
            const payments = [{}];
            const expected = { versements: payments };
            const actual = await controller.getPaymentsEstablishement(SIRET.value);
            expect(actual).toEqual(expected);
        });
    });

    describe("getDocuments", () => {
        const getDocumentsSpy = jest.spyOn(etablissementsService, "getDocuments");
        it("should call service with args", async () => {
            getDocumentsSpy.mockImplementationOnce(jest.fn());
            await controller.getDocuments(SIRET.value);
            expect(getDocumentsSpy).toHaveBeenCalledWith(ESTABLISHMENT_ID);
        });

        it("should return documents", async () => {
            // @ts-expect-error: mock
            getDocumentsSpy.mockImplementationOnce(() => documents);
            const documents = [{}];
            const expected = { documents };
            const actual = await controller.getDocuments(SIRET.value);
            expect(actual).toEqual(expected);
        });
    });

    describe("getRibs", () => {
        const getRibsSpy = jest.spyOn(etablissementsService, "getRibs");
        it("should call service with args", async () => {
            getRibsSpy.mockImplementationOnce(jest.fn());
            await controller.getRibs(SIRET.value);
            expect(getRibsSpy).toHaveBeenCalledWith(ESTABLISHMENT_ID);
        });

        it("should return ribs", async () => {
            const documents = [{}];
            // @ts-expect-error: mock
            getRibsSpy.mockImplementationOnce(() => documents);
            const expected = { documents };
            const actual = await controller.getRibs(SIRET.value);
            expect(actual).toEqual(expected);
        });
    });

    describe("getEtablissement", () => {
        const getEtablissementSpy = jest.spyOn(etablissementsService, "getEtablissement");
        it("should call service with args", async () => {
            getEtablissementSpy.mockImplementationOnce(async () => ({ siret: SIRET } as unknown as Etablissement));
            await controller.getEtablissement(SIRET.value);
            expect(getEtablissementSpy).toHaveBeenCalledWith(ESTABLISHMENT_ID);
        });

        it("should return an establishment", async () => {
            // @ts-expect-error: mock
            getEtablissementSpy.mockImplementationOnce(() => etablissement);
            const etablissement = {};
            const expected = { etablissement };
            const actual = await controller.getEtablissement(SIRET.value);
            expect(actual).toEqual(expected);
        });
    });

    describe("registerExtract", () => {
        it("should return true", async () => {
            const expected = true;
            const actual = await controller.registerExtract(SIRET.value);
            expect(actual).toEqual(expected);
        });
    });

    describe("getGrantExtract", () => {
        const CSV = "csv";
        const FILENAME = "filename";

        beforeAll(() => {
            jest.mocked(grantExtractService.buildCsv).mockResolvedValue({ csv: CSV, fileName: FILENAME });
        });

        afterAll(() => {
            jest.mocked(grantExtractService.buildCsv).mockRestore();
        });

        it("calls grantExtractService.buildCsv", async () => {
            await controller.getGrantsExtract(SIRET.value);
            expect(grantExtractService.buildCsv).toHaveBeenCalledWith(ESTABLISHMENT_ID);
        });

        it("stream contains csv from service", async () => {
            const expected = CSV;
            const streamRes = await controller.getGrantsExtract(SIRET.value);
            const actual = await consumers.text(streamRes);
            expect(actual).toBe(expected);
        });

        it("stream contains csv from service", async () => {
            const expected = "inline; filename=filename";
            await controller.getGrantsExtract(SIRET.value);
            // @ts-expect-error -- test private
            const actual = await controller?.headers["Content-Disposition"];
            expect(actual).toBe(expected);
        });
    });
});
