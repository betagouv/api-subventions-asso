import { DemandeSubvention, Etablissement } from "dto";
import etablissementsService from "../../modules/etablissements/etablissements.service";
import { EtablissementHttp, isEtabIdentifierFromAssoMiddleware } from "./Etablissement.http";
import EstablishmentIdentifier from "../../identifierObjects/EstablishmentIdentifier";
import Siren from "../../identifierObjects/Siren";
import AssociationIdentifier from "../../identifierObjects/AssociationIdentifier";
import establishmentIdentifierService from "../../modules/establishment-identifier/establishment-identifier.service";
import grantExtractService from "../../modules/grant/grantExtract.service";
import consumers from "stream/consumers";
import associationHelper from "../../modules/associations/associations.helper";
import { errorHandler } from "../../middlewares/ErrorMiddleware";

jest.mock("../../modules/establishment-identifier/establishment-identifier.service");
jest.mock("../../modules/grant/grantExtract.service");
jest.mock("../../middlewares/ErrorMiddleware");
jest.mock("../../modules/associations/associations.helper");

const controller = new EtablissementHttp();
const ID_STR = "00000000100000";
const SIREN = new Siren("000000001");
const SIRET = SIREN.toSiret("00000");
const ASSOCIATION_ID = AssociationIdentifier.fromSiren(SIREN);
const ESTABLISHMENT_ID = EstablishmentIdentifier.fromSiret(SIRET, ASSOCIATION_ID);

describe("EtablissementHttp", () => {
    const REQ = { params: { identifier: ID_STR }, estabIdentifier: ESTABLISHMENT_ID };

    beforeAll(() => {
        jest.mocked(establishmentIdentifierService.getEstablishmentIdentifiers).mockResolvedValue(ESTABLISHMENT_ID);
    });

    afterAll(() => {
        jest.mocked(establishmentIdentifierService.getEstablishmentIdentifiers).mockRestore();
    });

    describe("getDemandeSubventions", () => {
        const getSubventionsSpy = jest.spyOn(etablissementsService, "getSubventions");
        it("should call service with args", async () => {
            const subventions = [{}] as DemandeSubvention[];
            // @ts-expect-error: mock
            getSubventionsSpy.mockReturnValueOnce(subventions);
            await controller.getDemandeSubventions(SIRET.value, REQ);
            expect(getSubventionsSpy).toHaveBeenCalledWith(ESTABLISHMENT_ID);
        });

        it("should return a grant requests", async () => {
            const subventions = [{}] as DemandeSubvention[];
            // @ts-expect-error: mock
            getSubventionsSpy.mockReturnValueOnce(subventions);
            const expected = { subventions };
            const promise = controller.getDemandeSubventions(SIRET.value, REQ);
            expect(await promise).toEqual(expected);
        });
    });

    describe("getPayments", () => {
        const getSubventionsSpy = jest.spyOn(etablissementsService, "getPayments");
        it("should call service with args", async () => {
            getSubventionsSpy.mockImplementationOnce(jest.fn());
            await controller.getPaymentsEstablishement(SIRET.value, REQ);
            expect(getSubventionsSpy).toHaveBeenCalledWith(ESTABLISHMENT_ID);
        });

        it("should return payments", async () => {
            // @ts-expect-error: mock
            getSubventionsSpy.mockImplementationOnce(() => payments);
            const payments = [{}];
            const expected = { versements: payments };
            const actual = await controller.getPaymentsEstablishement(SIRET.value, REQ);
            expect(actual).toEqual(expected);
        });
    });

    describe("getDocuments", () => {
        const getDocumentsSpy = jest.spyOn(etablissementsService, "getDocuments");
        it("should call service with args", async () => {
            getDocumentsSpy.mockImplementationOnce(jest.fn());
            await controller.getDocuments(SIRET.value, REQ);
            expect(getDocumentsSpy).toHaveBeenCalledWith(ESTABLISHMENT_ID);
        });

        it("should return documents", async () => {
            // @ts-expect-error: mock
            getDocumentsSpy.mockImplementationOnce(() => documents);
            const documents = [{}];
            const expected = { documents };
            const actual = await controller.getDocuments(SIRET.value, REQ);
            expect(actual).toEqual(expected);
        });
    });

    describe("getRibs", () => {
        const getRibsSpy = jest.spyOn(etablissementsService, "getRibs");
        it("should call service with args", async () => {
            getRibsSpy.mockImplementationOnce(jest.fn());
            await controller.getRibs(SIRET.value, REQ);
            expect(getRibsSpy).toHaveBeenCalledWith(ESTABLISHMENT_ID);
        });

        it("should return ribs", async () => {
            const documents = [{}];
            // @ts-expect-error: mock
            getRibsSpy.mockImplementationOnce(() => documents);
            const expected = { documents };
            const actual = await controller.getRibs(SIRET.value, REQ);
            expect(actual).toEqual(expected);
        });
    });

    describe("getEtablissement", () => {
        const getEtablissementSpy = jest.spyOn(etablissementsService, "getEtablissement");
        it("should call service with args", async () => {
            getEtablissementSpy.mockImplementationOnce(async () => ({ siret: SIRET }) as unknown as Etablissement);
            await controller.getEtablissement(SIRET.value, REQ);
            expect(getEtablissementSpy).toHaveBeenCalledWith(ESTABLISHMENT_ID);
        });

        it("should return an establishment", async () => {
            // @ts-expect-error: mock
            getEtablissementSpy.mockImplementationOnce(() => etablissement);
            const etablissement = {};
            const expected = { etablissement };
            const actual = await controller.getEtablissement(SIRET.value, REQ);
            expect(actual).toEqual(expected);
        });
    });

    describe("registerExtract", () => {
        it("should return true", async () => {
            const expected = true;
            const actual = await controller.registerExtract();
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
            await controller.getGrantsExtract(SIRET.value, REQ);
            expect(grantExtractService.buildCsv).toHaveBeenCalledWith(ESTABLISHMENT_ID);
        });

        it("stream contains csv from service", async () => {
            const expected = CSV;
            const streamRes = await controller.getGrantsExtract(SIRET.value, REQ);
            const actual = await consumers.text(streamRes);
            expect(actual).toBe(expected);
        });

        it("stream contains csv from service", async () => {
            const expected = "inline; filename=filename";
            await controller.getGrantsExtract(SIRET.value, REQ);
            // @ts-expect-error -- test private
            const actual = await controller?.headers["Content-Disposition"];
            expect(actual).toBe(expected);
        });
    });
});

describe("isEtabIdentifierFromAssoMiddleware", () => {
    const RES = "RES";
    const NEXT = jest.fn();
    const REQ = { params: { identifier: ID_STR }, estabIdentifier: ESTABLISHMENT_ID };
    const ERROR_HANDLER_RES = jest.fn();

    beforeAll(() => {
        jest.mocked(establishmentIdentifierService.getEstablishmentIdentifiers).mockResolvedValue(ESTABLISHMENT_ID);
        jest.mocked(associationHelper.isIdentifierFromAsso).mockResolvedValue(true);
        jest.mocked(errorHandler).mockReturnValue(ERROR_HANDLER_RES);
    });

    afterAll(() => {
        jest.mocked(establishmentIdentifierService.getEstablishmentIdentifiers).mockRestore();
        jest.mocked(associationHelper.isIdentifierFromAsso).mockRestore();
        jest.mocked(errorHandler).mockRestore();
    });

    it("gets formal id", async () => {
        await isEtabIdentifierFromAssoMiddleware({ ...REQ }, RES, NEXT);
        expect(establishmentIdentifierService.getEstablishmentIdentifiers).toHaveBeenCalledWith(ID_STR);
    });

    it("calls service to check it is from asso", async () => {
        await isEtabIdentifierFromAssoMiddleware({ ...REQ }, RES, NEXT);
        expect(associationHelper.isIdentifierFromAsso).toHaveBeenCalledWith(ASSOCIATION_ID);
    });

    it("sets assoIdentifier in req", async () => {
        const REQ_TMP = { ...REQ };
        await isEtabIdentifierFromAssoMiddleware(REQ_TMP, RES, NEXT);
        expect(REQ_TMP.estabIdentifier).toMatchInlineSnapshot(`
            EstablishmentIdentifier {
              "associationIdentifier": AssociationIdentifier {
                "rna": undefined,
                "siren": Siren {
                  "identifier": "000000001",
                },
              },
              "siret": Siret {
                "identifier": "00000000100000",
              },
            }
        `);
    });

    it("if id not from asso, calls errorHandler", async () => {
        const REQ_TMP = { ...REQ };
        jest.mocked(associationHelper.isIdentifierFromAsso).mockResolvedValueOnce(false);
        await isEtabIdentifierFromAssoMiddleware(REQ_TMP, RES, NEXT);
        expect(ERROR_HANDLER_RES.mock.calls?.[0]).toMatchInlineSnapshot(`
            [
              [Error: Votre recherche pointe vers une entité qui n'est pas une association],
              {
                "estabIdentifier": EstablishmentIdentifier {
                  "associationIdentifier": AssociationIdentifier {
                    "rna": undefined,
                    "siren": Siren {
                      "identifier": "000000001",
                    },
                  },
                  "siret": Siret {
                    "identifier": "00000000100000",
                  },
                },
                "params": {
                  "identifier": "00000000100000",
                },
              },
              "RES",
              [MockFunction] {
                "calls": [
                  [],
                ],
                "results": [
                  {
                    "type": "return",
                    "value": undefined,
                  },
                ],
              },
            ]
        `);
    });

    it("if any error calls errorHandler", async () => {
        const REQ_TMP = { ...REQ };
        jest.mocked(establishmentIdentifierService.getEstablishmentIdentifiers).mockRejectedValueOnce(
            new Error("haha"),
        );
        await isEtabIdentifierFromAssoMiddleware(REQ_TMP, RES, NEXT);
        expect(ERROR_HANDLER_RES.mock.calls?.[0]).toMatchInlineSnapshot(`
            [
              [Error: haha],
              {
                "estabIdentifier": EstablishmentIdentifier {
                  "associationIdentifier": AssociationIdentifier {
                    "rna": undefined,
                    "siren": Siren {
                      "identifier": "000000001",
                    },
                  },
                  "siret": Siret {
                    "identifier": "00000000100000",
                  },
                },
                "params": {
                  "identifier": "00000000100000",
                },
              },
              "RES",
              [MockFunction] {
                "calls": [
                  [],
                ],
                "results": [
                  {
                    "type": "return",
                    "value": undefined,
                  },
                ],
              },
            ]
        `);
    });
});
