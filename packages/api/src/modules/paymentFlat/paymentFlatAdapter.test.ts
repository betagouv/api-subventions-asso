import {
    PAYMENT_FLAT_ENTITY,
    PAYMENT_FLAT_ENTITY_WITH_NULLS,
    PAYMENT_FROM_PAYMENT_FLAT,
} from "./__fixtures__/paymentFlatEntity.fixture";
import PaymentFlatAdapter from "./paymentFlatAdapter";
import PaymentFlatEntity from "../../entities/PaymentFlatEntity";
import {
    PAYMENT_FLAT_DBO,
    PAYMENT_FLAT_DBO_WITH_NULLS,
} from "../../dataProviders/db/paymentFlat/__fixtures__/paymentFlatDbo.fixture";

describe("PaymentFlatAdapter", () => {
    describe("rawToPayment", () => {
        //@ts-expect-error: parameter type
        const RAW_PAYMENT: RawPayment<PaymentFlatEntity> = { data: PAYMENT_FLAT_ENTITY };

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
        it("should return partial Payment entity", () => {
            const entity = PAYMENT_FLAT_ENTITY_WITH_NULLS;
            const actual = PaymentFlatAdapter.toPayment(entity);
            expect(actual).toMatchSnapshot();
        });
    });

    describe("toDbo", () => {
        it("given entity without nulls, should return a PaymentFlatDbo without nulls", () => {
            const result = PaymentFlatAdapter.toDbo(PAYMENT_FLAT_ENTITY);
            expect(result).toMatchSnapshot();
        });
        it("given entity with nulls, should return a PaymentFlatDbo with nulls", () => {
            const result = PaymentFlatAdapter.toDbo(PAYMENT_FLAT_ENTITY_WITH_NULLS);
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
