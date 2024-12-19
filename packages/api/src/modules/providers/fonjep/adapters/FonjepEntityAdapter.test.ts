import { POSTE_DTOS, TIER_DTOS, VERSEMENT_DTOS, TYPE_POSTE_DTOS, DISPOSITIF_DTOS } from "../__fixtures__/fonjepDtos";
import {
    POSTE_ENTITIES,
    TIER_ENTITIES,
    VERSEMENT_ENTITIES,
    TYPE_POSTE_ENTITIES,
    DISPOSITIF_ENTITIES,
} from "../__fixtures__/fonjepEntities";
import FonjepTiersEntity from "../entities/FonjepTiersEntity";
import FonjepPosteEntity from "../entities/FonjepPosteEntity";
import FonjepVersementEntity from "../entities/FonjepVersementEntity";
import FonjepTypePosteEntity from "../entities/FonjepTypePosteEntity";
import FonjepDispositifEntity from "../entities/FonjepDispositifEntity";
import FonjepEntityAdapter from "./FonjepEntityAdapter";

const TIER_INDICES = Array.from({ length: TIER_DTOS.length }, (_, i) => i);
const POSTE_INDICES = Array.from({ length: POSTE_DTOS.length }, (_, i) => i);
const VERSEMENT_INDICES = Array.from({ length: VERSEMENT_DTOS.length }, (_, i) => i);
const TYPE_POSTE_INDICES = Array.from({ length: TYPE_POSTE_DTOS.length }, (_, i) => i);
const DISPOSITIF_INDICES = Array.from({ length: DISPOSITIF_DTOS.length }, (_, i) => i);

describe("FonjepEntityAdapter", () => {
    describe("toFonjepTierEntity()", () => {
        it.each(TIER_INDICES)("should return FonjepTiersEntity", index => {
            const actual = FonjepEntityAdapter.toFonjepTierEntity(TIER_DTOS[index]);
            const expected = TIER_ENTITIES[index];
            expect(actual).toBeInstanceOf(FonjepTiersEntity);
            expect(actual).toEqual(expected);
        });
    });

    describe("toFonjepPosteEntity()", () => {
        it.each(POSTE_INDICES)("should return FonjepPosteEntity", index => {
            const actual = FonjepEntityAdapter.toFonjepPosteEntity(POSTE_DTOS[index]);
            const expected = POSTE_ENTITIES[index];
            expect(actual).toBeInstanceOf(FonjepPosteEntity);
            expect(actual).toEqual(expected);
        });
    });

    describe("toFonjepVersementEntity()", () => {
        it.each(VERSEMENT_INDICES)("should return FonjepVersementEntity", index => {
            const actual = FonjepEntityAdapter.toFonjepVersementEntity(VERSEMENT_DTOS[index]);
            const expected = VERSEMENT_ENTITIES[index];
            expect(actual).toBeInstanceOf(FonjepVersementEntity);
            expect(actual).toEqual(expected);
        });
    });

    describe("toFonjepTypePosteEntity()", () => {
        it.each(TYPE_POSTE_INDICES)("should return FonjepTypePosteEntity", index => {
            const actual = FonjepEntityAdapter.toFonjepTypePosteEntity(TYPE_POSTE_DTOS[index]);
            const expected = TYPE_POSTE_ENTITIES[index];
            expect(actual).toBeInstanceOf(FonjepTypePosteEntity);
            expect(actual).toEqual(expected);
        });
    });

    describe("toFonjepDispositifEntity()", () => {
        it.each(DISPOSITIF_INDICES)("should return FonjepDispositifEntity", index => {
            const actual = FonjepEntityAdapter.toFonjepDispositifEntity(DISPOSITIF_DTOS[index]);
            const expected = DISPOSITIF_ENTITIES[index];
            expect(actual).toBeInstanceOf(FonjepDispositifEntity);
            expect(actual).toEqual(expected);
        });
    });
});
