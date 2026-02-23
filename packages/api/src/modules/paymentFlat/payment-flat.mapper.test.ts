import {
    CHORUS_PAYMENT_FLAT_ENTITY,
    CHORUS_PAYMENT_FLAT_ENTITY_WITH_NULLS,
    FONJEP_PAYMENT_FLAT_ENTITY,
    PAYMENT_FROM_PAYMENT_FLAT,
} from "./__fixtures__/paymentFlatEntity.fixture";
import PaymentFlatMapper from "./payment-flat.mapper";
import {
    PAYMENT_FLAT_DBO,
    PAYMENT_FLAT_DBO_WITH_NULLS,
} from "../../dataProviders/db/paymentFlat/__fixtures__/paymentFlatDbo.fixture";
import FonjepEntityMapper from "../providers/fonjep/mappers/fonjep-entity.mapper";
import { RawPayment } from "../grant/@types/rawGrant";

jest.mock("../providers/fonjep/mappers/fonjep-entity.mapper");

describe("PaymentFlatAdapter", () => {
    describe("rawToPayment", () => {
        const RAW_PAYMENT: RawPayment = {
            type: "payment",
            provider: "payment-flat",
            data: CHORUS_PAYMENT_FLAT_ENTITY,
        };

        const mockToPayment = jest.spyOn(PaymentFlatMapper, "toPayment");
        beforeEach(() => {
            mockToPayment.mockReturnValue(PAYMENT_FROM_PAYMENT_FLAT);
        });

        afterAll(() => {
            mockToPayment.mockRestore();
        });

        it("should call toPayment()", () => {
            PaymentFlatMapper.rawToPayment(RAW_PAYMENT);
            expect(PaymentFlatMapper.toPayment).toHaveBeenCalledWith(RAW_PAYMENT.data);
        });

        it("should return Payment", () => {
            const expected = PAYMENT_FROM_PAYMENT_FLAT;
            const actual = PaymentFlatMapper.rawToPayment(RAW_PAYMENT);
            expect(actual).toEqual(expected);
        });
    });

    describe("toPayment", () => {
        it("should return ChorusPayment", () => {
            const entity = CHORUS_PAYMENT_FLAT_ENTITY;
            const actual = PaymentFlatMapper.toPayment(entity);
            expect(actual).toMatchSnapshot();
        });
        it("should return partial ChorusPayment", () => {
            const entity = CHORUS_PAYMENT_FLAT_ENTITY_WITH_NULLS;
            const actual = PaymentFlatMapper.toPayment(entity);
            expect(actual).toMatchSnapshot();
        });

        it("should call fonjep position code when need", () => {
            PaymentFlatMapper.toPayment(FONJEP_PAYMENT_FLAT_ENTITY);
            expect(FonjepEntityMapper.extractPositionCode).toHaveBeenCalledWith(FONJEP_PAYMENT_FLAT_ENTITY);
        });

        it("should return FonjepPayment", () => {
            const actual = PaymentFlatMapper.toPayment(FONJEP_PAYMENT_FLAT_ENTITY);
            expect(actual).toMatchSnapshot();
        });
    });

    describe("toDbo", () => {
        it("given entity without nulls, should return a PaymentFlatDbo without nulls", () => {
            const result = PaymentFlatMapper.toDbo(CHORUS_PAYMENT_FLAT_ENTITY);
            expect(result).toMatchSnapshot();
        });
        it("given entity with nulls, should return a PaymentFlatDbo with nulls", () => {
            const result = PaymentFlatMapper.toDbo(CHORUS_PAYMENT_FLAT_ENTITY_WITH_NULLS);
            expect(result).toMatchSnapshot();
        });
    });

    describe("dboToEntity", () => {
        it("given dbo without nulls, should return a PaymentFlatEntity without nulls", () => {
            const result = PaymentFlatMapper.dboToEntity(PAYMENT_FLAT_DBO);
            expect(result).toMatchSnapshot();
        });
        it("given dbo with nulls, should return a PaymentFlatEntity with nulls", () => {
            const result = PaymentFlatMapper.dboToEntity(PAYMENT_FLAT_DBO_WITH_NULLS);
            expect(result).toMatchSnapshot();
        });
    });
});
