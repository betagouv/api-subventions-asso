import OsirisRequestMapper from "./osiris-request.mapper";
import OSIRIS_REQUEST_DTO, {
    OSIRIS_REQUEST_RAW_DATA,
    OSIRIS_REQUEST_RAW_DATA_DOSSIER_ACTION,
} from "./__fixtures__/osiris-request.fixture";

describe("OsirisRequestMapper", () => {
    describe("toDto", () => {
        it("converts raw OSIRIS XLSX rows to a semantic camelCase DTO", () => {
            expect(OsirisRequestMapper.toDto(OSIRIS_REQUEST_RAW_DATA)).toMatchSnapshot();
        });

        it("folds the legacy 'Dossier' and post-2024 'Dossier/action' headers into a single dossier", () => {
            expect(OsirisRequestMapper.toDto(OSIRIS_REQUEST_RAW_DATA_DOSSIER_ACTION)).toMatchSnapshot();
        });

        it("ignores unknown raw categories", () => {
            expect(OsirisRequestMapper.toDto({ Inconnu: { Foo: "bar" } })).toEqual({});
        });

        it("ignores unknown raw fields within a known category", () => {
            expect(OsirisRequestMapper.toDto({ Dossier: { Foo: "bar" } })).toEqual({ dossier: {} });
        });
    });

    describe("toEntity", () => {
        beforeAll(() => {
            jest.useFakeTimers().setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
        });

        afterAll(() => {
            jest.useRealTimers();
        });

        it("composes a complete OSIRIS request entity from a DTO", () => {
            expect(OsirisRequestMapper.toEntity(OSIRIS_REQUEST_DTO, 2024)).toMatchSnapshot();
        });
    });
});
