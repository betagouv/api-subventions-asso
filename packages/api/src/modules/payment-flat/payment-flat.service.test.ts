import paymentFlatService from "./payment-flat.service";
import PaymentFlatMapper from "./payment-flat.mapper";
import {
    LIST_PAYMENT_FLAT_ENTITY,
    CHORUS_PAYMENT_FLAT_ENTITY,
    PAYMENT_FROM_PAYMENT_FLAT,
} from "./__fixtures__/payment-flat.fixture";

import paymentFlatAdapter from "../../adapters/outputs/db/payment-flat/payment-flat.adapter";
import Siren from "../../identifier-objects/Siren";
import AssociationIdentifier from "../../identifier-objects/AssociationIdentifier";
import DEFAULT_ASSOCIATION from "../../../tests/__fixtures__/association.fixture";
import EstablishmentIdentifier from "../../identifier-objects/EstablishmentIdentifier";
import Siret from "../../identifier-objects/Siret";
import Rna from "../../identifier-objects/Rna";
import { PAYMENTS } from "../providers/chorus/__fixtures__/ChorusFixtures";
import PaymentFlatEntity from "../../entities/flats/PaymentFlatEntity";
import { insertStreamByBatch } from "../../shared/helpers/MongoHelper";

jest.mock("../../shared/helpers/MongoHelper");
jest.mock("./payment-flat.mapper");
jest.mock("../../adapters/outputs/db/payment-flat/payment-flat.adapter");

describe("PaymentFlatService", () => {
    describe("isCollectionInitialized", () => {
        it("calls port.hasBeenInitialized", () => {
            paymentFlatService.isCollectionInitialized();
            expect(paymentFlatAdapter.hasBeenInitialized).toHaveBeenCalledTimes(1);
        });
    });

    describe("upsertMany", () => {
        it("calls port to upsert", async () => {
            const ARRAY = [];
            await paymentFlatService.upsertMany(ARRAY);
            expect(paymentFlatAdapter.upsertMany).toHaveBeenCalledWith(ARRAY);
        });
    });

    describe("rawToPayment", () => {
        it("should call PaymentFlatAdapter", () => {
            // @ts-expect-error: parameter type
            const rawGrant = { data: CHORUS_PAYMENT_FLAT_ENTITY } as RawGrant;
            paymentFlatService.rawToPayment(rawGrant);
            expect(PaymentFlatMapper.rawToPayment).toHaveBeenCalledWith(rawGrant);
        });

        it("should return Payment", () => {
            // @ts-expect-error: parameter type
            const rawGrant = { data: CHORUS_PAYMENT_FLAT_ENTITY } as RawGrant;
            jest.mocked(PaymentFlatMapper.rawToPayment).mockReturnValueOnce(PAYMENT_FROM_PAYMENT_FLAT);
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
                expect(PaymentFlatMapper.toPayment).toHaveBeenNthCalledWith(index + 1, entity);
            });
        });
    });

    describe("getPayments", () => {
        const IDENTIFIER = AssociationIdentifier.fromSiren(new Siren(DEFAULT_ASSOCIATION.siren));
        const PAYMENTS_FLAT: PaymentFlatEntity[] = [CHORUS_PAYMENT_FLAT_ENTITY];
        let mockgetEntitiesByIdentifier;
        let mockToPaymentArray;

        beforeEach(() => {
            mockgetEntitiesByIdentifier = jest
                .spyOn(paymentFlatService, "getEntitiesByIdentifier")
                .mockResolvedValue([CHORUS_PAYMENT_FLAT_ENTITY]);
            // @ts-expect-error: mock private method
            mockToPaymentArray = jest.spyOn(paymentFlatService, "toPaymentArray").mockReturnValue([PAYMENTS[0]]);
        });

        afterAll(() => {
            mockgetEntitiesByIdentifier.mockRestore();
            mockToPaymentArray.mockRestore();
        });

        it("fetches payments flat", async () => {
            await paymentFlatService.getPayments(AssociationIdentifier.fromSiren(new Siren(DEFAULT_ASSOCIATION.siren)));
            expect(mockgetEntitiesByIdentifier).toHaveBeenCalledWith(IDENTIFIER);
        });

        it("transforms payments flat to payments", async () => {
            await paymentFlatService.getPayments(AssociationIdentifier.fromSiren(new Siren(DEFAULT_ASSOCIATION.siren)));
            expect(mockToPaymentArray).toHaveBeenCalledWith(PAYMENTS_FLAT);
        });

        it("returns payments", async () => {
            const expected = [PAYMENTS[0]];
            const actual = await paymentFlatService.getPayments(
                AssociationIdentifier.fromSiren(new Siren(DEFAULT_ASSOCIATION.siren)),
            );
            expect(actual).toEqual(expected);
        });
    });

    describe("raw grant", () => {
        const DATA = [{ ej: "EJ", provider: "chorus", paymentId: "EJ" }];

        describe("getRawGrants", () => {
            const SIREN = new Siren("123456789");
            const IDENTIFIER = AssociationIdentifier.fromSiren(SIREN);
            let findBySirenMock;
            beforeAll(
                () =>
                    (findBySirenMock = jest
                        .spyOn(paymentFlatAdapter, "findBySiren")
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

    describe("getEntitiesByIdentifier", () => {
        const ASSO_IDENTIFIER = AssociationIdentifier.fromSiren(new Siren(DEFAULT_ASSOCIATION.siren));
        const ESTAB_IDENTIFIER = EstablishmentIdentifier.fromSiret(
            new Siret(DEFAULT_ASSOCIATION.siret),
            ASSO_IDENTIFIER,
        );

        it.each`
            identifierName | identifier          | fnCalled
            ${"siret"}     | ${ESTAB_IDENTIFIER} | ${paymentFlatAdapter.findBySiret}
            ${"siren"}     | ${ASSO_IDENTIFIER}  | ${paymentFlatAdapter.findBySiren}
        `("gets payments from $identifierName", async ({ identifierName, identifier, fnCalled }) => {
            fnCalled.mockReturnValue([]);
            await paymentFlatService.getEntitiesByIdentifier(identifier);
            expect(fnCalled).toHaveBeenCalledWith(identifier[identifierName]);
        });

        it.each`
            value
            ${AssociationIdentifier.fromRna(new Rna(DEFAULT_ASSOCIATION.rna))}
            ${{}}
            ${""}
            ${null}
            ${undefined}
        `(
            "returns empty array if identifier is neither AssociationIdentifier.siren or EstablishmentIdentifier.siret",
            async ({ value }) => {
                const expected = [];
                const actual = await paymentFlatService.getEntitiesByIdentifier(value);
                expect(actual).toEqual(expected);
            },
        );
    });

    describe("saveFromStream", () => {
        const STREAM = {} as unknown as ReadableStream;

        it("calls mongo helper", async () => {
            await paymentFlatService.saveFromStream(STREAM);
            expect(insertStreamByBatch).toHaveBeenCalledWith(STREAM, expect.anything(), 10000);
        });

        it("calls mongo helper with flat upsert", async () => {
            await paymentFlatService.saveFromStream(STREAM);
            const methodCalledByHelper = jest.mocked(insertStreamByBatch).mock.calls[0][1];
            await methodCalledByHelper([]);
            expect(paymentFlatAdapter.upsertMany).toHaveBeenCalled();
        });
    });
});
