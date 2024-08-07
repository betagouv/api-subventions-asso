import Flux from "../../shared/Flux";
import FormaterHelper from "../../shared/helpers/FormaterHelper";
import documentsService from "../documents/documents.service";
import { SubventionsFlux } from "../subventions/@types/SubventionsFlux";
import subventionsService from "../subventions/subventions.service";
import paymentService from "../payments/payments.service";
import { EtablissementAdapter } from "./EtablissementAdapter";
import etablissementService from "./etablissements.service";
import { BadRequestError, NotFoundError } from "../../shared/errors/httpErrors";
import grantService from "../grant/grant.service";
import Siren from "../../valueObjects/Siren";
import Siret from "../../valueObjects/Siret";
import EstablishmentIdentifier from "../../valueObjects/EstablishmentIdentifier";
import AssociationIdentifier from "../../valueObjects/AssociationIdentifier";
jest.mock("../grant/grant.service");

type asyncPrivateMock<T> = jest.SpyInstance<Promise<T>>;

const SIREN = new Siren("000000000");
const SIRET = new Siret("00000000000001");
const ASSOCIATION_ID = AssociationIdentifier.fromSiren(SIREN);
const ESTABLISHMENT_ID = EstablishmentIdentifier.fromSiret(SIRET, ASSOCIATION_ID);

describe("EtablissementsService", () => {
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
        it("should throw NotFoundError", async () => {
            let actual;
            const expected = new NotFoundError("Etablissement not found");
            aggregateMock.mockImplementationOnce(async () => ({ data: [] }));
            try {
                actual = await etablissementService.getEtablissement(ESTABLISHMENT_ID);
            } catch (e) {
                actual = e;
            }
            expect(actual).toEqual(expected);
        });
    });

    describe("getGrants", () => {
        it("should call grantService.getGrants()", () => {
            etablissementService.getGrants(ESTABLISHMENT_ID);
            expect(grantService.getGrants).toHaveBeenCalledWith(ESTABLISHMENT_ID);
        });
    });

    describe("getPayments", () => {
        const getPaymentsBySiretMock = jest.spyOn(paymentService, "getPayments");

        it("should call payment service", async () => {
            getPaymentsBySiretMock.mockImplementation(async () => []);

            await etablissementService.getPayments(ESTABLISHMENT_ID);

            expect(getPaymentsBySiretMock).toHaveBeenCalledWith(ESTABLISHMENT_ID);
        });
    });

    describe("getSubventions()", () => {
        const getDemandesByEtablissementMock = jest.spyOn(subventionsService, "getDemandes");

        it("should call DemandeSubventionService.getByAssociation()", async () => {
            getDemandesByEtablissementMock.mockImplementationOnce(() => new Flux<SubventionsFlux>());
            etablissementService.getSubventions(ESTABLISHMENT_ID);
            expect(getDemandesByEtablissementMock).toHaveBeenCalledWith(ESTABLISHMENT_ID);
        });
    });

    describe("getDocuments", () => {
        const getDocumentBySiretMock = jest.spyOn(documentsService, "getDocument");

        it("should call subventions service", async () => {
            getDocumentBySiretMock.mockImplementation(async () => []);

            await etablissementService.getDocuments(ESTABLISHMENT_ID);

            expect(getDocumentBySiretMock).toHaveBeenCalledWith(ESTABLISHMENT_ID);
        });
    });

    describe("getRibs", () => {
        const getRibsBySiretMock = jest.spyOn(documentsService, "getRibs");

        it("should call subventions service", async () => {
            getRibsBySiretMock.mockImplementation(async () => []);

            await etablissementService.getRibs(ESTABLISHMENT_ID);

            expect(getRibsBySiretMock).toHaveBeenCalledWith(ESTABLISHMENT_ID);
        });
    });
});
