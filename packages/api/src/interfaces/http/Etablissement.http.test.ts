import { DemandeSubvention, Etablissement } from "dto";
import Flux from "../../shared/Flux";
import etablissementsService from "../../modules/etablissements/etablissements.service";
import { EtablissementHttp } from "./Etablissement.http";
import Siret from "../../valueObjects/Siret";
import EstablishmentIdentifier from "../../valueObjects/EstablishmentIdentifier";
import Siren from "../../valueObjects/Siren";
import AssociationIdentifier from "../../valueObjects/AssociationIdentifier";
import establishmentIdentifierService from "../../modules/establishment-identifier/establishment-identifier.service";

const controller = new EtablissementHttp();

describe("EtablissementHttp", () => {
    const SIREN = new Siren("000000001");
    const IDENTIFIER = SIREN.toSiret("00000");
    const ASSOCIATION_ID = AssociationIdentifier.fromSiren(SIREN);
    const ESTABLISHMENT_ID = EstablishmentIdentifier.fromSiret(IDENTIFIER, ASSOCIATION_ID);

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
            await controller.getDemandeSubventions(IDENTIFIER.value);
            expect(getSubventionsSpy).toHaveBeenCalledWith(ESTABLISHMENT_ID);
        });

        it("should return a grant requests", async () => {
            const subventions = [{}] as DemandeSubvention[];
            const flux = new Flux({ subventions });

            // @ts-expect-error: mock
            getSubventionsSpy.mockImplementationOnce(() => flux);
            const expected = { subventions };
            const promise = controller.getDemandeSubventions(IDENTIFIER.value);
            flux.close();

            expect(await promise).toEqual(expected);
        });
    });

    describe("getPayments", () => {
        const getSubventionsSpy = jest.spyOn(etablissementsService, "getPayments");
        it("should call service with args", async () => {
            getSubventionsSpy.mockImplementationOnce(jest.fn());
            await controller.getPaymentsEstablishement(IDENTIFIER.value);
            expect(getSubventionsSpy).toHaveBeenCalledWith(ESTABLISHMENT_ID);
        });

        it("should return payments", async () => {
            // @ts-expect-error: mock
            getSubventionsSpy.mockImplementationOnce(() => payments);
            const payments = [{}];
            const expected = { versements: payments };
            const actual = await controller.getPaymentsEstablishement(IDENTIFIER.value);
            expect(actual).toEqual(expected);
        });
    });

    describe("getDocuments", () => {
        const getDocumentsSpy = jest.spyOn(etablissementsService, "getDocuments");
        it("should call service with args", async () => {
            getDocumentsSpy.mockImplementationOnce(jest.fn());
            await controller.getDocuments(IDENTIFIER.value);
            expect(getDocumentsSpy).toHaveBeenCalledWith(ESTABLISHMENT_ID);
        });

        it("should return documents", async () => {
            // @ts-expect-error: mock
            getDocumentsSpy.mockImplementationOnce(() => documents);
            const documents = [{}];
            const expected = { documents };
            const actual = await controller.getDocuments(IDENTIFIER.value);
            expect(actual).toEqual(expected);
        });
    });

    describe("getRibs", () => {
        const getRibsSpy = jest.spyOn(etablissementsService, "getRibs");
        it("should call service with args", async () => {
            getRibsSpy.mockImplementationOnce(jest.fn());
            await controller.getRibs(IDENTIFIER.value);
            expect(getRibsSpy).toHaveBeenCalledWith(ESTABLISHMENT_ID);
        });

        it("should return ribs", async () => {
            const documents = [{}];
            // @ts-expect-error: mock
            getRibsSpy.mockImplementationOnce(() => documents);
            const expected = { documents };
            const actual = await controller.getRibs(IDENTIFIER.value);
            expect(actual).toEqual(expected);
        });
    });

    describe("getEtablissement", () => {
        const getEtablissementSpy = jest.spyOn(etablissementsService, "getEtablissement");
        it("should call service with args", async () => {
            getEtablissementSpy.mockImplementationOnce(async () => ({ siret: IDENTIFIER } as unknown as Etablissement));
            await controller.getEtablissement(IDENTIFIER.value);
            expect(getEtablissementSpy).toHaveBeenCalledWith(ESTABLISHMENT_ID);
        });

        it("should return an establishment", async () => {
            // @ts-expect-error: mock
            getEtablissementSpy.mockImplementationOnce(() => etablissement);
            const etablissement = {};
            const expected = { etablissement };
            const actual = await controller.getEtablissement(IDENTIFIER.value);
            expect(actual).toEqual(expected);
        });
    });

    describe("registerExtract", () => {
        it("should return true", async () => {
            const expected = true;
            const actual = await controller.registerExtract(IDENTIFIER.value);
            expect(actual).toEqual(expected);
        });
    });
});
