import { Versement } from "@api-subventions-asso/dto";
import { StructureIdentifiersEnum } from "../../@enums/StructureIdentifiersEnum";
import AssociationIdentifierError from "../../shared/errors/AssociationIdentifierError";
import * as IdentifierHelper from "../../shared/helpers/IdentifierHelper";
import rnaSirenService from "../open-data/rna-siren/rnaSiren.service";
import versementsService from "./versements.service";


describe("VersementsService", () => {
    describe("getVersementsByAssociation", () => {
        const getIdentifierTypeMock = jest.spyOn(IdentifierHelper, "getIdentifierType");
        const getSirenMock = jest.spyOn(rnaSirenService, "getSiren");
        // @ts-expect-error getVersementsBySiren is private methode
        const getVersementsMock = jest.spyOn<any>(versementsService, "getVersementsBySiren");

        it("should throw error because indentifier is not valid", async () => {
            getIdentifierTypeMock.mockImplementationOnce(() => null);

            await expect(() => versementsService.getVersementsByAssociation("test")).rejects.toThrowError(new AssociationIdentifierError());
        });

        it("should call rnaSirenService", async () => {
            const expected = "test";

            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.rna);
            getVersementsMock.mockImplementationOnce(async () => []);
            getSirenMock.mockImplementationOnce(async () => "FAKE_SIREN")

            await versementsService.getVersementsByAssociation("test");

            expect(getSirenMock).toHaveBeenCalledWith(expected);
        });

        it("should call getVersementsBySiren with founded siren", async () => {
            const expected = "FAKE_SIREN";

            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.rna);
            getVersementsMock.mockImplementationOnce(async () => []);
            getSirenMock.mockImplementationOnce(async () => expected)

            await versementsService.getVersementsByAssociation("test");

            expect(getVersementsMock).toHaveBeenCalledWith(expected);
        });

        it("should call getVersementsBySiren", async () => {
            const expected = "FAKE_SIREN";

            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.siren);
            getVersementsMock.mockImplementationOnce(async () => []);

            await versementsService.getVersementsByAssociation(expected);

            expect(getVersementsMock).toHaveBeenCalledWith(expected);
        });
    });
});