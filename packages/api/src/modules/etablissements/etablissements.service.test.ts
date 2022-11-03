import { Etablissement, LightEtablissement } from "@api-subventions-asso/dto";
import FormaterHelper from "../../shared/helpers/FormaterHelper";
import documentsService from "../documents/documents.service";
import subventionsService from "../subventions/subventions.service";
import versementsService from "../versements/versements.service";
import etablissementService from "./etablissements.service";

const SIREN = "000000000"
const SIRET = '000000000000001';
const ETABLISSEMENT_1 = {
    siret: [{ value: SIRET }],
    nic: [{}],
    versements: {},
    demandes_subventions: {}
}
const ETABLISSEMENT_2 = {
    siret: [{ value: '000000000000002' }],
    nic: [{}],
    versements: {},
    demandes_subventions: {}
}


describe("EtablissementsService", () => {
    const toLightEtablissementMock = jest.spyOn(etablissementService, "toLightEtablissement");
    //@ts-expect-error: mock private method
    const aggregateMock = jest.spyOn(etablissementService, "aggregate");
    //@ts-expect-error: mock private method
    jest.spyOn(etablissementService, "scoreEtablisement").mockImplementation(() => 1);
    //@ts-expect-error: mock
    jest.spyOn(FormaterHelper, "formatData").mockImplementation(data => data);


    describe("getVersements", () => {
        const getVersementsBySiretMock = jest.spyOn(versementsService, "getVersementsBySiret");

        it('should call versement service', async () => {
            getVersementsBySiretMock.mockImplementation(async () => []);

            await etablissementService.getVersements(SIRET);

            expect(getVersementsBySiretMock).toHaveBeenCalledWith(SIRET);
        })
    });

    describe("getSubventions", () => {
        const getDemandesByEtablissementMock = jest.spyOn(subventionsService, "getDemandesByEtablissement");
        const SIRET = '000000000000000';

        it('should call subventions service', async () => {
            getDemandesByEtablissementMock.mockImplementation(async () => []);

            await etablissementService.getSubventions(SIRET);

            expect(getDemandesByEtablissementMock).toHaveBeenCalledWith(SIRET);
        })
    });

    describe("getDocuments", () => {
        const getDocumentBySiretMock = jest.spyOn(documentsService, "getDocumentBySiret");
        const SIRET = '000000000000000';

        it('should call subventions service', async () => {
            getDocumentBySiretMock.mockImplementation(async () => []);

            await etablissementService.getDocuments(SIRET);

            expect(getDocumentBySiretMock).toHaveBeenCalledWith(SIRET);
        })
    });

    describe("toLightEtablissement", () => {
        it("return a LightEtablissement", () => {
            const expected = { siret: ETABLISSEMENT_1.siret, nic: ETABLISSEMENT_1.nic };
            // @ts-expect-error: private method
            const actual = etablissementService.toLightEtablissement(ETABLISSEMENT_1);
            expect(actual).toEqual(expected);
        })
    })

    describe("getEtablissementsBySiren", () => {
        it("should call toLightEtablissement", async () => {
            // @ts-expect-error: mock private method
            aggregateMock.mockImplementationOnce(async () => [ETABLISSEMENT_1, ETABLISSEMENT_2]);
            toLightEtablissementMock.mockImplementationOnce(etablissement => etablissement)
            await etablissementService.getEtablissementsBySiren(SIREN);
            expect(toLightEtablissementMock).toHaveBeenCalledTimes(2);
        })
    })
})