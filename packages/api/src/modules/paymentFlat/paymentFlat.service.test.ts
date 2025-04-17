import { DATA_BRETAGNE_RECORDS } from "../providers/dataBretagne/__fixtures__/dataBretagne.fixture";

import paymentFlatService from "./paymentFlat.service";
import PaymentFlatAdapter from "./paymentFlatAdapter";
import {
    LIST_PAYMENT_FLAT_ENTITY,
    PAYMENT_FLAT_ENTITY,
    PAYMENT_FROM_PAYMENT_FLAT,
} from "./__fixtures__/paymentFlatEntity.fixture";

import paymentFlatPort from "../../dataProviders/db/paymentFlat/paymentFlat.port";
import Siren from "../../valueObjects/Siren";
import AssociationIdentifier from "../../valueObjects/AssociationIdentifier";

jest.mock("./paymentFlatAdapter");
jest.mock("../../dataProviders/db/paymentFlat/paymentFlat.port");

describe("PaymentFlatService", () => {
    describe("isCollectionInitialized", () => {
        it("calls port.hasBeenInitialized", () => {
            paymentFlatService.isCollectionInitialized();
            expect(paymentFlatPort.hasBeenInitialized).toHaveBeenCalledTimes(1);
        });
    });

    describe("rawToPayment", () => {
        it("should call PaymentFlatAdapter", () => {
            // @ts-expect-error: parameter type
            const rawGrant = { data: PAYMENT_FLAT_ENTITY } as RawGrant;
            paymentFlatService.rawToPayment(rawGrant);
            expect(PaymentFlatAdapter.rawToPayment).toHaveBeenCalledWith(rawGrant);
        });

        it("should return Payment", () => {
            // @ts-expect-error: parameter type
            const rawGrant = { data: PAYMENT_FLAT_ENTITY } as RawGrant;
            jest.mocked(PaymentFlatAdapter.rawToPayment).mockReturnValueOnce(PAYMENT_FROM_PAYMENT_FLAT);
            const expected = PAYMENT_FROM_PAYMENT_FLAT;
            const actual = paymentFlatService.rawToPayment(rawGrant);
            expect(actual).toEqual(expected);
        });
    });

    describe("toPaymentArray", () => {
        it("should call toPayment for each entity", () => {
            // @ts-expect-error: test private method
            paymentFlatService.toPaymentArray(LIST_PAYMENT_FLAT_ENTITY);
            LIST_PAYMENT_FLAT_ENTITY.forEach((entity, index) => {
                expect(PaymentFlatAdapter.toPayment).toHaveBeenNthCalledWith(index + 1, entity);
            });
        });
    });

    describe("raw grant", () => {
        const DATA = [{ ej: "EJ", provider: "chorus", idVersement: "EJ" }];

        describe("getRawGrants", () => {
            const SIREN = new Siren("123456789");
            const IDENTIFIER = AssociationIdentifier.fromSiren(SIREN);
            let findBySirenMock;
            beforeAll(
                () =>
                    (findBySirenMock = jest
                        .spyOn(paymentFlatPort, "findBySiren")
                        // @ts-expect-error: mock
                        .mockImplementation(jest.fn(() => DATA))),
            );
            afterAll(() => findBySirenMock.mockRestore());

            it("should call findBySiren()", async () => {
                await paymentFlatService.getRawGrants(IDENTIFIER);
                expect(findBySirenMock).toHaveBeenCalledWith(SIREN);
            });

            it("returns raw grant data", async () => {
                const actual = await paymentFlatService.getRawGrants(IDENTIFIER);
                expect(actual).toMatchSnapshot();
            });
        });
    });
});
