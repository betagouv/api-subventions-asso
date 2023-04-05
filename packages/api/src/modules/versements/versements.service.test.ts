import { StructureIdentifiersEnum } from "../../@enums/StructureIdentifiersEnum";
import AssociationIdentifierError from "../../shared/errors/AssociationIdentifierError";
import { NotFoundError } from "../../shared/errors/httpErrors";
import * as IdentifierHelper from "../../shared/helpers/IdentifierHelper";
import rnaSirenService from "../open-data/rna-siren/rnaSiren.service";
import versementsService from "./versements.service";

describe("VersementsService", () => {
    const VERSEMENT_KEY = "J00034";
    describe("getVersementsByAssociation", () => {
        const getIdentifierTypeMock = jest.spyOn(IdentifierHelper, "getIdentifierType");
        const getSirenMock = jest.spyOn(rnaSirenService, "getSiren");
        // @ts-expect-error getVersementsBySiren is private methode
        const getVersementsMock = jest.spyOn<any>(versementsService, "getVersementsBySiren");

        it("should throw error because indentifier is not valid", async () => {
            getIdentifierTypeMock.mockImplementationOnce(() => null);

            await expect(() => versementsService.getVersementsByAssociation("test")).rejects.toThrowError(
                AssociationIdentifierError,
            );
        });

        it("should throw not found error because siren not found", async () => {
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.rna);
            getVersementsMock.mockImplementationOnce(async () => []);
            getSirenMock.mockImplementationOnce(async () => null);

            await expect(() => versementsService.getVersementsByAssociation("test")).rejects.toThrowError(
                NotFoundError,
            );
        });

        it("should call rnaSirenService", async () => {
            const expected = "test";

            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.rna);
            getVersementsMock.mockImplementationOnce(async () => []);
            getSirenMock.mockImplementationOnce(async () => "FAKE_SIREN");

            await versementsService.getVersementsByAssociation("test");

            expect(getSirenMock).toHaveBeenCalledWith(expected);
        });

        it("should call getVersementsBySiren with founded siren", async () => {
            const expected = "FAKE_SIREN";

            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.rna);
            getVersementsMock.mockImplementationOnce(async () => []);
            getSirenMock.mockImplementationOnce(async () => expected);

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

    describe("hasVersements()", () => {
        it("should return false", () => {
            const expected = false;
            const actual = versementsService.hasVersements({
                // @ts-expect-error: test
                versementKey: { value: undefined },
            });
            expect(actual).toEqual(expected);
        });

        it("should return true", () => {
            const expected = true;
            const actual = versementsService.hasVersements({
                // @ts-expect-error: test
                versementKey: { value: VERSEMENT_KEY },
            });
            expect(actual).toEqual(expected);
        });
    });

    describe("filterVersementByKey()", () => {
        it("should return null if versement undefined", () => {
            const expected = null;
            const actual = versementsService.filterVersementByKey(undefined, {
                value: VERSEMENT_KEY,
            });
            expect(actual).toEqual(expected);
        });

        it("should filter versements with EJ", () => {
            const versements = [{ ej: { value: VERSEMENT_KEY } }, { ej: { value: "J00001" } }];
            const expected = [versements[0]];
            const actual = versementsService.filterVersementByKey(versements, VERSEMENT_KEY);
            expect(actual).toEqual(expected);
        });

        it("should filter versements with CodePoste", () => {
            const versements = [{ codePoste: { value: VERSEMENT_KEY } }, { codePoste: { value: "J00001" } }];
            const expected = [versements[0]];
            const actual = versementsService.filterVersementByKey(versements, VERSEMENT_KEY);
            expect(actual).toEqual(expected);
        });
    });
});
