import paymentFlatService from "./paymentFlat.service";
import PaymentFlatAdapter from "./paymentFlatAdapter";
import {
    LIST_PAYMENT_FLAT_ENTITY,
    CHORUS_PAYMENT_FLAT_ENTITY,
    PAYMENT_FROM_PAYMENT_FLAT,
} from "./__fixtures__/paymentFlatEntity.fixture";

import paymentFlatPort from "../../dataProviders/db/paymentFlat/paymentFlat.port";
import Siren from "../../identifierObjects/Siren";
import AssociationIdentifier from "../../identifierObjects/AssociationIdentifier";
import DEFAULT_ASSOCIATION from "../../../tests/__fixtures__/association.fixture";
import EstablishmentIdentifier from "../../identifierObjects/EstablishmentIdentifier";
import Siret from "../../identifierObjects/Siret";
import Rna from "../../identifierObjects/Rna";
import { PAYMENTS } from "../providers/chorus/__fixtures__/ChorusFixtures";
import PaymentFlatEntity from "../../entities/PaymentFlatEntity";

jest.mock("./paymentFlatAdapter");
jest.mock("../../dataProviders/db/paymentFlat/paymentFlat.port");

describe("PaymentFlatService", () => {
    describe("isCollectionInitialized", () => {
        it("calls port.hasBeenInitialized", () => {
            paymentFlatService.isCollectionInitialized();
            expect(paymentFlatPort.hasBeenInitialized).toHaveBeenCalledTimes(1);
        });
    });

    describe("upsertMany", () => {
        it("calls port to upsert", async () => {
            const ARRAY = [];
            await paymentFlatService.upsertMany(ARRAY);
            expect(paymentFlatPort.upsertMany).toHaveBeenCalledWith(ARRAY);
        });
    });

    describe("rawToPayment", () => {
        it("should call PaymentFlatAdapter", () => {
            // @ts-expect-error: parameter type
            const rawGrant = { data: CHORUS_PAYMENT_FLAT_ENTITY } as RawGrant;
            paymentFlatService.rawToPayment(rawGrant);
            expect(PaymentFlatAdapter.rawToPayment).toHaveBeenCalledWith(rawGrant);
        });

        it("should return Payment", () => {
            // @ts-expect-error: parameter type
            const rawGrant = { data: CHORUS_PAYMENT_FLAT_ENTITY } as RawGrant;
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

    describe("getPayments", () => {
        const IDENTIFIER = AssociationIdentifier.fromSiren(new Siren(DEFAULT_ASSOCIATION.siren));
        const PAYMENTS_FLAT: PaymentFlatEntity[] = [CHORUS_PAYMENT_FLAT_ENTITY];
        let mockGetPaymentFlat;
        let mockToPaymentArray;

        beforeEach(() => {
            mockGetPaymentFlat = jest
                .spyOn(paymentFlatService, "getPaymentFlat")
                .mockResolvedValue([CHORUS_PAYMENT_FLAT_ENTITY]);
            // @ts-expect-error: mock private method
            mockToPaymentArray = jest.spyOn(paymentFlatService, "toPaymentArray").mockReturnValue([PAYMENTS[0]]);
        });

        afterAll(() => {
            mockGetPaymentFlat.mockRestore();
            mockToPaymentArray.mockRestore();
        });

        it("fetches payments flat", async () => {
            await paymentFlatService.getPayments(AssociationIdentifier.fromSiren(new Siren(DEFAULT_ASSOCIATION.siren)));
            expect(mockGetPaymentFlat).toHaveBeenCalledWith(IDENTIFIER);
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

    // TODO: unskip when grant part is relevant or remove if not needed anymore
    describe.skip("raw grant", () => {
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

    describe("getPaymentFlat", () => {
        const ASSO_IDENTIFIER = AssociationIdentifier.fromSiren(new Siren(DEFAULT_ASSOCIATION.siren));
        const ESTAB_IDENTIFIER = EstablishmentIdentifier.fromSiret(
            new Siret(DEFAULT_ASSOCIATION.siret),
            ASSO_IDENTIFIER,
        );

        it.each`
            identifierName | identifier          | fnCalled
            ${"siret"}     | ${ESTAB_IDENTIFIER} | ${paymentFlatPort.findBySiret}
            ${"siren"}     | ${ASSO_IDENTIFIER}  | ${paymentFlatPort.findBySiren}
        `("gets payments from $identifierName", async ({ identifierName, identifier, fnCalled }) => {
            fnCalled.mockReturnValue([]);
            await paymentFlatService.getPaymentFlat(identifier);
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
                const actual = await paymentFlatService.getPaymentFlat(value);
                expect(actual).toEqual(expected);
            },
        );
    });
});
