import {
    PAYMENT_FLAT_ENTITY,
    PAYMENT_FLAT_ENTITY_WITH_NULLS,
} from "../../paymentFlat/__fixtures__/paymentFlatEntity.fixture";
import {
    AMOUNTS_VS_PROGRAM_REGION_DBOS,
    AMOUNTS_VS_PROGRAM_REGION_ENTITIES,
} from "./__fixtures__/amountsVSProgramRegion.fixture";
import AmountsVsProgramRegionAdapter from "./amountsVsProgramRegion.adapter";

const EXPECTED_WITHOUT_NULLS = {
    exerciceBudgetaire: PAYMENT_FLAT_ENTITY.exerciceBudgetaire,
    programme: `${PAYMENT_FLAT_ENTITY.programNumber} - ${PAYMENT_FLAT_ENTITY.programName}`,
    mission: PAYMENT_FLAT_ENTITY.mission,
    montant: PAYMENT_FLAT_ENTITY.amount,
    regionAttachementComptable: PAYMENT_FLAT_ENTITY.regionAttachementComptable,
};

const EXPECTED_WITH_NULLS = {
    exerciceBudgetaire: PAYMENT_FLAT_ENTITY_WITH_NULLS.exerciceBudgetaire,
    programme: String(PAYMENT_FLAT_ENTITY_WITH_NULLS.programNumber),
    mission: PAYMENT_FLAT_ENTITY_WITH_NULLS.mission,
    montant: PAYMENT_FLAT_ENTITY_WITH_NULLS.amount,
    regionAttachementComptable: PAYMENT_FLAT_ENTITY_WITH_NULLS.regionAttachementComptable,
};

describe("AmountsVsProgramRegionAdapter", () => {
    describe("toDbo", () => {
        it("should return right mapping", () => {
            const actual = AmountsVsProgramRegionAdapter.toDbo(AMOUNTS_VS_PROGRAM_REGION_ENTITIES[0]);
            const expected = { ...AMOUNTS_VS_PROGRAM_REGION_DBOS[0] };
            expect(actual).toEqual(expected);
        });
    });

    describe("toEntity", () => {
        it("should return right mapping", () => {
            const actual = AmountsVsProgramRegionAdapter.toEntity({
                ...AMOUNTS_VS_PROGRAM_REGION_DBOS[0],
                // @ts-expect-error: _id ObjectId
                _id: "object-id",
            });
            const expected = AMOUNTS_VS_PROGRAM_REGION_ENTITIES[0];
            expect(actual).toEqual(expected);
        });
    });

    describe("toNotAggregatedEntity", () => {
        it("should return right mapping when paymentFlat is without nulls", () => {
            const actual = AmountsVsProgramRegionAdapter.toNotAggregatedEntity(PAYMENT_FLAT_ENTITY);
            const expected = EXPECTED_WITHOUT_NULLS;
            expect(actual).toEqual(expected);
        });

        it("should return right mapping when paymentFlat is with nulls", () => {
            const actual = AmountsVsProgramRegionAdapter.toNotAggregatedEntity(PAYMENT_FLAT_ENTITY_WITH_NULLS);
            const expected = EXPECTED_WITH_NULLS;
            expect(actual).toEqual(expected);
        });
    });
});
