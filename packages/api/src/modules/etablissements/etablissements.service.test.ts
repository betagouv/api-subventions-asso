import Flux from "../../shared/Flux";
import FormaterHelper from "../../shared/helpers/FormaterHelper";
import documentsService from "../documents/documents.service";
import { SubventionsFlux } from "../subventions/@types/SubventionsFlux";
import subventionsService from "../subventions/subventions.service";
import paymentService from "../payments/payments.service";
import { EtablissementAdapter } from "./EtablissementAdapter";
import etablissementService from "./etablissements.service";
import { BadRequestError, NotFoundError } from "../../shared/errors/httpErrors";

type asyncPrivateMock<T> = jest.SpyInstance<Promise<T>>;

const SIREN = "000000000";
const SIRET = "000000000000001";
const ETABLISSEMENT_1 = {
    siret: [
        {
            value: SIRET,
            provider: "BASE SIREN <Via API ASSO>",
            last_update: "2022-08-29T00:00:00.000Z" as unknown as Date,
            type: "string",
        },
    ],
    nic: [],
    payments: [],
    demandes_subventions: [],
};
const ETABLISSEMENT_2 = {
    siret: [
        {
            value: "000000000000002",
            provider: "BASE SIREN <Via API ASSO>",
            last_update: "2022-08-29T00:00:00.000Z" as unknown as Date,
            type: "string",
        },
    ],
    nic: [],
    payments: [],
    demandes_subventions: [],
};

describe("EtablissementsService", () => {
    const toSimplifiedEtablissementMock = jest.spyOn(EtablissementAdapter, "toSimplifiedEtablissement");

    //@ts-expect-error: mock private method
    const aggregateMock = jest.spyOn(etablissementService, "aggregate") as asyncPrivateMock<Etablissement>;

    (
        jest
            //@ts-expect-error: mock private method
            .spyOn(etablissementService, "scoreEtablisement") as asyncPrivateMock<number>
    ).mockResolvedValue(1);

    // @ts-ignore because formatHelper does black magic
    jest.spyOn(FormaterHelper, "formatData").mockImplementation((data, providerScore) => data);

    describe("getEtablissement()", () => {
        it("should throw BadRequestError", async () => {
            let actual;
            const expected = new BadRequestError("You must provide a valid SIRET");
            try {
                actual = await etablissementService.getEtablissement(SIRET.substring(0, 3));
            } catch (e) {
                actual = e;
            }
            expect(actual).toEqual(expected);
        });

        it("should throw NotFoundError", async () => {
            let actual;
            const expected = new NotFoundError("Etablissement not found");
            aggregateMock.mockImplementationOnce(async () => ({ data: [] }));
            try {
                actual = await etablissementService.getEtablissement(SIRET);
            } catch (e) {
                actual = e;
            }
            expect(actual).toEqual(expected);
        });
    });

    describe("getPayments", () => {
        const getPaymentsBySiretMock = jest.spyOn(paymentService, "getPaymentsBySiret");

        it("should call payment service", async () => {
            getPaymentsBySiretMock.mockImplementation(async () => []);

            await etablissementService.getPayments(SIRET);

            expect(getPaymentsBySiretMock).toHaveBeenCalledWith(SIRET);
        });
    });

    describe("getSubventions()", () => {
        const getDemandesByEtablissementMock = jest.spyOn(subventionsService, "getDemandesByEtablissement");

        it("should call DemandeSubventionService.getByAssociation()", async () => {
            getDemandesByEtablissementMock.mockImplementationOnce(() => new Flux<SubventionsFlux>());
            etablissementService.getSubventions(SIREN);
            expect(getDemandesByEtablissementMock).toHaveBeenCalledWith(SIREN);
        });
    });

    describe("getDocuments", () => {
        const getDocumentBySiretMock = jest.spyOn(documentsService, "getDocumentBySiret");

        it("should call subventions service", async () => {
            getDocumentBySiretMock.mockImplementation(async () => []);

            await etablissementService.getDocuments(SIRET);

            expect(getDocumentBySiretMock).toHaveBeenCalledWith(SIRET);
        });
    });

    describe("getRibs", () => {
        const getRibsBySiretMock = jest.spyOn(documentsService, "getRibsBySiret");

        it("should call subventions service", async () => {
            getRibsBySiretMock.mockImplementation(async () => []);

            await etablissementService.getRibs(SIRET);

            expect(getRibsBySiretMock).toHaveBeenCalledWith(SIRET);
        });
    });

    describe("getEtablissementsBySiren", () => {
        it("should call toSimplifiedEtablissement", async () => {
            aggregateMock.mockResolvedValueOnce([ETABLISSEMENT_1, ETABLISSEMENT_2]);
            toSimplifiedEtablissementMock.mockImplementationOnce(etablissement => etablissement);
            await etablissementService.getEtablissementsBySiren(SIREN);
            expect(toSimplifiedEtablissementMock).toHaveBeenCalledTimes(2);
        });

        it("should throw a not found error", async () => {
            aggregateMock.mockResolvedValueOnce([]);
            await expect(() => etablissementService.getEtablissementsBySiren(SIREN)).rejects.toThrowError(
                NotFoundError,
            );
        });
    });
});
