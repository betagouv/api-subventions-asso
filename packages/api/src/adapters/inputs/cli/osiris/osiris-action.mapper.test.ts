import OsirisActionMapper from "./osiris-action.mapper";
import OSIRIS_ACTION_DTO, { OSIRIS_ACTION_RAW_DATA } from "./__fixtures__/osiris-action.fixture";

describe("OsirisActionMapper", () => {
    describe("toDto", () => {
        it("converts raw OSIRIS XLSX rows to a semantic camelCase DTO", () => {
            expect(OsirisActionMapper.toDto(OSIRIS_ACTION_RAW_DATA)).toMatchSnapshot();
        });

        it("ignores unknown raw categories", () => {
            expect(OsirisActionMapper.toDto({ Inconnu: { Foo: "bar" } })).toEqual({});
        });

        it("ignores unknown raw fields within a known category", () => {
            expect(OsirisActionMapper.toDto({ "Dossier/action": { Foo: "bar" } })).toEqual({ dossier: {} });
        });
    });

    describe("toEntity", () => {
        beforeAll(() => {
            jest.useFakeTimers().setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
        });

        afterAll(() => {
            jest.useRealTimers();
        });

        it("composes a complete OSIRIS action entity from a DTO", () => {
            expect(OsirisActionMapper.toEntity(OSIRIS_ACTION_DTO, 2024)).toMatchSnapshot();
        });
    });
});
