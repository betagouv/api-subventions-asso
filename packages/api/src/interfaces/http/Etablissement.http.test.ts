import { DemandeSubvention, Etablissement } from "dto";
import Flux from "../../shared/Flux";
import etablissementsService from "../../modules/etablissements/etablissements.service";
import { EtablissementHttp } from "./Etablissement.http";
import grantExtractService from "../../modules/grant/grantExtract.service";
import consumers from "stream/consumers";

jest.mock("../../modules/grant/grantExtract.service");

const controller = new EtablissementHttp();

describe("EtablissementHttp", () => {
    const IDENTIFIER = "00000000100000";

    describe("getDemandeSubventions", () => {
        const getSubventionsSpy = jest.spyOn(etablissementsService, "getSubventions");
        it("should call service with args", () => {
            const subventions = [{}] as DemandeSubvention[];
            const flux = new Flux({ subventions });

            // @ts-expect-error: mock
            getSubventionsSpy.mockImplementationOnce(() => flux);
            controller.getDemandeSubventions(IDENTIFIER);
            expect(getSubventionsSpy).toHaveBeenCalledWith(IDENTIFIER);
        });

        it("should return a grant requests", async () => {
            const subventions = [{}] as DemandeSubvention[];
            const flux = new Flux({ subventions });

            // @ts-expect-error: mock
            getSubventionsSpy.mockImplementationOnce(() => flux);
            const expected = { subventions };
            const promise = controller.getDemandeSubventions(IDENTIFIER);
            flux.close();

            expect(await promise).toEqual(expected);
        });
    });

    describe("getPayments", () => {
        const getSubventionsSpy = jest.spyOn(etablissementsService, "getPayments");
        it("should call service with args", async () => {
            getSubventionsSpy.mockImplementationOnce(jest.fn());
            await controller.getPayments(IDENTIFIER);
            expect(getSubventionsSpy).toHaveBeenCalledWith(IDENTIFIER);
        });

        it("should return payments", async () => {
            // @ts-expect-error: mock
            getSubventionsSpy.mockImplementationOnce(() => payments);
            const payments = [{}];
            const expected = { versements: payments };
            const actual = await controller.getPayments(IDENTIFIER);
            expect(actual).toEqual(expected);
        });
    });

    describe("getDocuments", () => {
        const getDocumentsSpy = jest.spyOn(etablissementsService, "getDocuments");
        it("should call service with args", async () => {
            getDocumentsSpy.mockImplementationOnce(jest.fn());
            await controller.getDocuments(IDENTIFIER);
            expect(getDocumentsSpy).toHaveBeenCalledWith(IDENTIFIER);
        });

        it("should return documents", async () => {
            // @ts-expect-error: mock
            getDocumentsSpy.mockImplementationOnce(() => documents);
            const documents = [{}];
            const expected = { documents };
            const actual = await controller.getDocuments(IDENTIFIER);
            expect(actual).toEqual(expected);
        });
    });

    describe("getRibs", () => {
        const getRibsSpy = jest.spyOn(etablissementsService, "getRibs");
        it("should call service with args", async () => {
            getRibsSpy.mockImplementationOnce(jest.fn());
            await controller.getRibs(IDENTIFIER);
            expect(getRibsSpy).toHaveBeenCalledWith(IDENTIFIER);
        });

        it("should return ribs", async () => {
            const documents = [{}];
            // @ts-expect-error: mock
            getRibsSpy.mockImplementationOnce(() => documents);
            const expected = { documents };
            const actual = await controller.getRibs(IDENTIFIER);
            expect(actual).toEqual(expected);
        });
    });

    describe("getEtablissement", () => {
        const getEtablissementSpy = jest.spyOn(etablissementsService, "getEtablissement");
        it("should call service with args", async () => {
            getEtablissementSpy.mockImplementationOnce(async () => ({ siret: IDENTIFIER } as unknown as Etablissement));
            await controller.getEtablissement(IDENTIFIER);
            expect(getEtablissementSpy).toHaveBeenCalledWith(IDENTIFIER);
        });

        it("should return an establishment", async () => {
            // @ts-expect-error: mock
            getEtablissementSpy.mockImplementationOnce(() => etablissement);
            const etablissement = {};
            const expected = { etablissement };
            const actual = await controller.getEtablissement(IDENTIFIER);
            expect(actual).toEqual(expected);
        });
    });

    describe("registerExtract", () => {
        it("should return true", async () => {
            const expected = true;
            const actual = await controller.registerExtract(IDENTIFIER);
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
            await controller.getGrantsExtract(IDENTIFIER);
            expect(grantExtractService.buildCsv).toHaveBeenCalledWith(IDENTIFIER);
        });

        it("stream contains csv from service", async () => {
            const expected = CSV;
            const streamRes = await controller.getGrantsExtract(IDENTIFIER);
            const actual = await consumers.text(streamRes);
            expect(actual).toBe(expected);
        });

        it("stream contains csv from service", async () => {
            const expected = "inline; filename=filename";
            await controller.getGrantsExtract(IDENTIFIER);
            // @ts-expect-error -- test private
            const actual = await controller?.headers["Content-Disposition"];
            expect(actual).toBe(expected);
        });
    });
});
