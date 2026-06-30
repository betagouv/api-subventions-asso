import { GrantService } from "./grant.service";
import { SIRET_STR } from "../../../tests/__fixtures__/association.fixture";
import AssociationIdentifier from "../../identifier-objects/AssociationIdentifier";
import Siret from "../../identifier-objects/Siret";
import {
    APPLICATION_LINK_TO_CHORUS,
    APPLICATION_LINK_TO_FONJEP,
} from "../application-flat/__fixtures__/application-flat.fixture";
import {
    CHORUS_PAYMENT_FLAT_ENTITY,
    FONJEP_PAYMENT_FLAT_ENTITY,
    FONJEP_PAYMENT_FLAT_ENTITY_2,
    LONELY_CHORUS_PAYMENT,
} from "../payment-flat/__fixtures__/payment-flat.fixture";
import { GetApplications } from "../application-flat/use-cases/get-applications";
import { GetPayments } from "../payment-flat/use-cases/get-payments";

describe("GrantService", () => {
    const SIRET = new Siret(SIRET_STR);

    const mockGetApplications = { execute: jest.fn() } as unknown as GetApplications;
    const mockGetPayments = { execute: jest.fn() } as unknown as GetPayments;
    const service = new GrantService(mockGetApplications, mockGetPayments);

    describe("getGrants", () => {
        const ASSOCIATION_IDENTIFIER = AssociationIdentifier.fromSiren(SIRET.toSiren());

        beforeEach(() => {
            jest.mocked(mockGetApplications.execute).mockResolvedValue([
                APPLICATION_LINK_TO_CHORUS,
                APPLICATION_LINK_TO_FONJEP,
            ]);
            jest.mocked(mockGetPayments.execute).mockResolvedValue([
                CHORUS_PAYMENT_FLAT_ENTITY,
                LONELY_CHORUS_PAYMENT,
                FONJEP_PAYMENT_FLAT_ENTITY,
                FONJEP_PAYMENT_FLAT_ENTITY_2,
            ]);
        });

        it("fetches applications", async () => {
            await service.getGrants(ASSOCIATION_IDENTIFIER);
            expect(mockGetApplications.execute).toHaveBeenCalledWith(ASSOCIATION_IDENTIFIER);
        });

        it("fetches payments", async () => {
            await service.getGrants(ASSOCIATION_IDENTIFIER);
            expect(mockGetPayments.execute).toHaveBeenCalledWith(ASSOCIATION_IDENTIFIER);
        });

        it("return grants", async () => {
            const expected = [
                {
                    application: APPLICATION_LINK_TO_CHORUS,
                    payments: [CHORUS_PAYMENT_FLAT_ENTITY],
                },
                {
                    application: APPLICATION_LINK_TO_FONJEP,
                    payments: [FONJEP_PAYMENT_FLAT_ENTITY, FONJEP_PAYMENT_FLAT_ENTITY_2],
                },
                { application: null, payments: [LONELY_CHORUS_PAYMENT] },
            ];
            const actual = await service.getGrants(ASSOCIATION_IDENTIFIER);
            expect(actual).toEqual(expected);
        });
    });
});
