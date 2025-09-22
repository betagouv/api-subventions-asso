import {
    CHORUS_PAYMENT_FLAT_ENTITY,
    CHORUS_PAYMENT_FLAT_ENTITY_WITH_NULLS,
    FONJEP_PAYMENT_FLAT_ENTITY,
    PAYMENT_FROM_PAYMENT_FLAT,
} from "./__fixtures__/paymentFlatEntity.fixture";
import PaymentFlatAdapter from "./paymentFlatAdapter";
import {
    PAYMENT_FLAT_DBO,
    PAYMENT_FLAT_DBO_WITH_NULLS,
} from "../../dataProviders/db/paymentFlat/__fixtures__/paymentFlatDbo.fixture";
import FonjepEntityAdapter from "../providers/fonjep/adapters/FonjepEntityAdapter";
import { RawPayment } from "../grant/@types/rawGrant";

jest.mock("../providers/fonjep/adapters/FonjepEntityAdapter");

describe("PaymentFlatAdapter", () => {
    describe("rawToPayment", () => {
        const RAW_PAYMENT: RawPayment = {
            type: "payment",
            provider: "payment-flat",
            data: CHORUS_PAYMENT_FLAT_ENTITY,
        };

        const mockToPayment = jest.spyOn(PaymentFlatAdapter, "toPayment");
        beforeEach(() => {
            mockToPayment.mockReturnValue(PAYMENT_FROM_PAYMENT_FLAT);
        });

        afterAll(() => {
            mockToPayment.mockRestore();
        });

        it("should call toPayment()", () => {
            PaymentFlatAdapter.rawToPayment(RAW_PAYMENT);
            expect(PaymentFlatAdapter.toPayment).toHaveBeenCalledWith(RAW_PAYMENT.data);
        });

        it("should return Payment", () => {
            const expected = PAYMENT_FROM_PAYMENT_FLAT;
            const actual = PaymentFlatAdapter.rawToPayment(RAW_PAYMENT);
            expect(actual).toEqual(expected);
        });
    });

    describe("toPayment", () => {
        it("should return ChorusPayment", () => {
            const entity = CHORUS_PAYMENT_FLAT_ENTITY;
            const actual = PaymentFlatAdapter.toPayment(entity);
            expect(actual).toMatchSnapshot();
        });
        it("should return partial ChorusPayment", () => {
            const entity = CHORUS_PAYMENT_FLAT_ENTITY_WITH_NULLS;
            const actual = PaymentFlatAdapter.toPayment(entity);
            expect(actual).toMatchSnapshot();
        });

        it("should call fonjep position code when need", () => {
            PaymentFlatAdapter.toPayment(FONJEP_PAYMENT_FLAT_ENTITY);
            expect(FonjepEntityAdapter.extractPositionCode).toHaveBeenCalledWith(FONJEP_PAYMENT_FLAT_ENTITY);
        });

        it("should return FonjepPayment", () => {
            const actual = PaymentFlatAdapter.toPayment(FONJEP_PAYMENT_FLAT_ENTITY);
            expect(actual).toMatchSnapshot();
        });
    });

    describe("toDbo", () => {
        it("given entity without nulls, should return a PaymentFlatDbo without nulls", () => {
            const result = PaymentFlatAdapter.toDbo(CHORUS_PAYMENT_FLAT_ENTITY);
            expect(result).toMatchSnapshot();
        });
        it("given entity with nulls, should return a PaymentFlatDbo with nulls", () => {
            const result = PaymentFlatAdapter.toDbo(CHORUS_PAYMENT_FLAT_ENTITY_WITH_NULLS);
            expect(result).toMatchSnapshot();
        });
    });

    describe("dboToEntity", () => {
        it("given dbo without nulls, should return a PaymentFlatEntity without nulls", () => {
            const result = PaymentFlatAdapter.dboToEntity(PAYMENT_FLAT_DBO);
            expect(result).toMatchSnapshot();
        });
        it("given dbo with nulls, should return a PaymentFlatEntity with nulls", () => {
            const result = PaymentFlatAdapter.dboToEntity(PAYMENT_FLAT_DBO_WITH_NULLS);
            expect(result).toMatchSnapshot();
        });
    });
});
