import { PaymentFlatService } from "./payment-flat.service";
import PaymentFlatMapper from "./payment-flat.mapper";
import {
    LIST_PAYMENT_FLAT_ENTITY,
    CHORUS_PAYMENT_FLAT_ENTITY,
    PAYMENT_FROM_PAYMENT_FLAT,
    FONJEP_PAYMENT_FLAT_ENTITY,
} from "./__fixtures__/payment-flat.fixture";

import paymentFlatAdapter from "../../adapters/outputs/db/payment-flat/payment-flat.adapter";
import Siren from "../../identifier-objects/Siren";
import AssociationIdentifier from "../../identifier-objects/AssociationIdentifier";
import DEFAULT_ASSOCIATION from "../../../tests/__fixtures__/association.fixture";
import { insertStreamByBatch } from "../../shared/helpers/MongoHelper";
import { GetPayments } from "./use-cases/get-payments";

jest.mock("../../shared/helpers/MongoHelper");
jest.mock("./payment-flat.mapper");
jest.mock("../../adapters/outputs/db/payment-flat/payment-flat.adapter");

describe("PaymentFlatService", () => {
    const PAYMENTS_FLAT = [CHORUS_PAYMENT_FLAT_ENTITY, FONJEP_PAYMENT_FLAT_ENTITY];
    const mockGetPayments = {
        execute: jest.fn().mockResolvedValue(PAYMENTS_FLAT),
    } as unknown as GetPayments;
    const service = new PaymentFlatService(mockGetPayments);

    describe("isCollectionInitialized", () => {
        it("calls port.hasBeenInitialized", () => {
            service.isCollectionInitialized();
            expect(paymentFlatAdapter.hasBeenInitialized).toHaveBeenCalledTimes(1);
        });
    });

    describe("upsertMany", () => {
        it("calls port to upsert", async () => {
            const ARRAY = [];
            await service.upsertMany(ARRAY);
            expect(paymentFlatAdapter.upsertMany).toHaveBeenCalledWith(ARRAY);
        });
    });

    describe("rawToPayment", () => {
        it("should call PaymentFlatAdapter", () => {
            // @ts-expect-error: parameter type
            const rawGrant = { data: CHORUS_PAYMENT_FLAT_ENTITY } as RawGrant;
            service.rawToPayment(rawGrant);
            expect(PaymentFlatMapper.rawToPayment).toHaveBeenCalledWith(rawGrant);
        });

        it("should return Payment", () => {
            // @ts-expect-error: parameter type
            const rawGrant = { data: CHORUS_PAYMENT_FLAT_ENTITY } as RawGrant;
            jest.mocked(PaymentFlatMapper.rawToPayment).mockReturnValueOnce(PAYMENT_FROM_PAYMENT_FLAT);
            const expected = PAYMENT_FROM_PAYMENT_FLAT;
            const actual = service.rawToPayment(rawGrant);
            expect(actual).toEqual(expected);
        });
    });

    describe("toPaymentArray", () => {
        it("should call toPayment for each entity", () => {
            // @ts-expect-error: test private method
            service.toPaymentArray(LIST_PAYMENT_FLAT_ENTITY);
            LIST_PAYMENT_FLAT_ENTITY.forEach((entity, index) => {
                expect(PaymentFlatMapper.toPayment).toHaveBeenNthCalledWith(index + 1, entity);
            });
        });
    });

    describe("getPaiements", () => {
        const IDENTIFIER = AssociationIdentifier.fromSiren(new Siren(DEFAULT_ASSOCIATION.siren));
        let mockToPaymentArray;

        beforeEach(() => {
            mockToPaymentArray = jest
                // @ts-expect-error: private method
                .spyOn(service, "toPaymentArray")
                // @ts-expect-error: mock
                .mockImplementation(entity => entity);
        });

        afterAll(() => {
            mockToPaymentArray.mockRestore();
        });

        it("fetches payments flat", async () => {
            await service.getPaiements(AssociationIdentifier.fromSiren(new Siren(DEFAULT_ASSOCIATION.siren)));
            expect(mockGetPayments.execute).toHaveBeenCalledWith(IDENTIFIER);
        });

        it("transforms payments flat to payments", async () => {
            await service.getPaiements(AssociationIdentifier.fromSiren(new Siren(DEFAULT_ASSOCIATION.siren)));
            expect(mockToPaymentArray).toHaveBeenCalledWith(PAYMENTS_FLAT);
        });

        it("returns payments", async () => {
            const expected = PAYMENTS_FLAT;
            const actual = await service.getPaiements(
                AssociationIdentifier.fromSiren(new Siren(DEFAULT_ASSOCIATION.siren)),
            );
            expect(actual).toEqual(expected);
        });
    });

    describe("raw grant", () => {
        describe("getRawGrants", () => {
            const SIREN = new Siren("123456789");
            const IDENTIFIER = AssociationIdentifier.fromSiren(SIREN);

            it("fetches payments", async () => {
                await service.getRawGrants(IDENTIFIER);
                expect(mockGetPayments.execute).toHaveBeenCalledWith(IDENTIFIER);
            });

            it("returns raw grant data", async () => {
                const actual = await service.getRawGrants(IDENTIFIER);
                expect(actual).toMatchSnapshot();
            });
        });
    });

    describe("saveFromStream", () => {
        const STREAM = {} as unknown as ReadableStream;

        it("calls mongo helper", async () => {
            await service.saveFromStream(STREAM);
            expect(insertStreamByBatch).toHaveBeenCalledWith(STREAM, expect.anything(), 10000);
        });

        it("calls mongo helper with flat upsert", async () => {
            await service.saveFromStream(STREAM);
            const methodCalledByHelper = jest.mocked(insertStreamByBatch).mock.calls[0][1];
            await methodCalledByHelper([]);
            expect(paymentFlatAdapter.upsertMany).toHaveBeenCalled();
        });
    });
});
