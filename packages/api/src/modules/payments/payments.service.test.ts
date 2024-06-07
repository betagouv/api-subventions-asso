import { StructureIdentifiersEnum } from "../../@enums/StructureIdentifiersEnum";
import AssociationIdentifierError from "../../shared/errors/AssociationIdentifierError";
import { NotFoundError } from "../../shared/errors/httpErrors";
import * as IdentifierHelper from "../../shared/helpers/IdentifierHelper";
import RnaSirenEntity from "../../entities/RnaSirenEntity";
import rnaSirenService from "../rna-siren/rnaSiren.service";
import paymentService from "./payments.service";

describe("PaymentsService", () => {
    const PAYMENT_KEY = "J00034";
    describe("getPaymentsByAssociation", () => {
        const getIdentifierTypeMock = jest.spyOn(IdentifierHelper, "getIdentifierType");
        const findOneMock = jest.spyOn(rnaSirenService, "find");
        // @ts-expect-error getPaymentsBySiren is private methode
        const getPaymentsMock = jest.spyOn<any>(paymentService, "getPaymentsBySiren");

        it("should throw error because indentifier is not valid", async () => {
            getIdentifierTypeMock.mockImplementationOnce(() => null);

            await expect(() => paymentService.getPaymentsByAssociation("test")).rejects.toThrowError(
                AssociationIdentifierError,
            );
        });

        it("should throw not found error because siren not found", async () => {
            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.rna);
            getPaymentsMock.mockImplementationOnce(async () => []);
            findOneMock.mockImplementationOnce(async () => null);

            await expect(() => paymentService.getPaymentsByAssociation("test")).rejects.toThrowError(NotFoundError);
        });

        it("should call rnaSirenService", async () => {
            const expected = "test";

            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.rna);
            getPaymentsMock.mockImplementationOnce(async () => []);
            findOneMock.mockResolvedValueOnce([new RnaSirenEntity("", "FAKE_SIREN")]);

            await paymentService.getPaymentsByAssociation("test");

            expect(findOneMock).toHaveBeenCalledWith(expected);
        });

        it("should call getPaymentsBySiren with founded siren", async () => {
            const expected = "FAKE_SIREN";

            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.rna);
            getPaymentsMock.mockImplementationOnce(async () => []);
            findOneMock.mockResolvedValueOnce([new RnaSirenEntity("", expected)]);

            await paymentService.getPaymentsByAssociation("test");

            expect(getPaymentsMock).toHaveBeenCalledWith(expected);
        });

        it("should call getPaymentsBySiren", async () => {
            const expected = "FAKE_SIREN";

            getIdentifierTypeMock.mockImplementationOnce(() => StructureIdentifiersEnum.siren);
            getPaymentsMock.mockImplementationOnce(async () => []);

            await paymentService.getPaymentsByAssociation(expected);

            expect(getPaymentsMock).toHaveBeenCalledWith(expected);
        });
    });

    describe("hasPayments()", () => {
        it("should return false", () => {
            const expected = false;
            const actual = paymentService.hasPayments({
                // @ts-expect-error: test
                versementKey: { value: undefined },
            });
            expect(actual).toEqual(expected);
        });

        it("should return true", () => {
            const expected = true;
            const actual = paymentService.hasPayments({
                // @ts-expect-error: test
                versementKey: { value: PAYMENT_KEY },
            });
            expect(actual).toEqual(expected);
        });
    });

    describe("filterPaymentsByKey()", () => {
        it("should return null if payment undefined", () => {
            const expected = null;
            const actual = paymentService.filterPaymentsByKey(undefined, {
                value: PAYMENT_KEY,
            });
            expect(actual).toEqual(expected);
        });

        it("should filter payments with EJ", () => {
            const payments = [{ ej: { value: PAYMENT_KEY } }, { ej: { value: "J00001" } }];
            const expected = [payments[0]];
            const actual = paymentService.filterPaymentsByKey(payments, PAYMENT_KEY);
            expect(actual).toEqual(expected);
        });

        it("should filter payments with CodePoste", () => {
            const payments = [{ codePoste: { value: PAYMENT_KEY } }, { codePoste: { value: "J00001" } }];
            const expected = [payments[0]];
            const actual = paymentService.filterPaymentsByKey(payments, PAYMENT_KEY);
            expect(actual).toEqual(expected);
        });
    });
});
