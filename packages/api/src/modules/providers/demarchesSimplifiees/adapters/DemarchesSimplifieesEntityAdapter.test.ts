import DemarchesSimplifieesDataEntity from "../entities/DemarchesSimplifieesDataEntity";
import { DemarchesSimplifieesEntityAdapter } from "./DemarchesSimplifieesEntityAdapter";
import DemarchesSimplifieesSchema from "../entities/DemarchesSimplifieesSchema";
import * as providerAdapter from "../../providers.adapter";

const mockAdaptStatus = jest.fn();

jest.mock("../demarchesSimplifiees.service");
jest.mock("../../providers.adapter", () => ({
    toStatusFactory: jest.fn(_conversionArray => mockAdaptStatus),
}));

describe("DemarchesSimplifieesEntityAdapter", () => {
    // @ts-expect-error: mock private method
    const mapMock: jest.SpyInstance = jest.spyOn(DemarchesSimplifieesEntityAdapter, "mapSchema");
    const SIRET = "00000000000000";
    const DEMANDE = {
        siret: SIRET,
        demande: { dateDerniereModification: new Date() },
        toto: ["jedusor"],
    } as unknown as DemarchesSimplifieesDataEntity;

    describe("mapSchema", () => {
        const ENTITY = { before: "a", siret: "SIRET" };
        const SCHEMA = {
            key: [
                { to: "after.nested", from: "before" },
                { to: "after.same", value: "toujoursPareil" },
            ],
        };
        const KEY = "key";

        it("adapts to proper format", () => {
            // @ts-expect-error mock
            const actual = DemarchesSimplifieesEntityAdapter.mapSchema(ENTITY, SCHEMA, KEY);
            expect(actual).toMatchInlineSnapshot(`
                {
                  "after": {
                    "nested": "a",
                    "same": "toujoursPareil",
                  },
                }
            `);
        });
    });

    describe("nestedToProviderValues", () => {
        const TO_PV = jest.fn();

        it("in an array call for each element", () => {
            const ARRAY = [0, 0, 0, 0];
            const expected = [1, 2, 3, 4];
            expected.forEach(v => TO_PV.mockReturnValueOnce(v));
            // @ts-expect-error -- test private method
            const actual = DemarchesSimplifieesEntityAdapter.nestedToProviderValues(ARRAY, TO_PV);
            expect(actual).toEqual(expected);
        });

        it("if neither object nor array return computed providerValue", () => {
            const VALUE = "toto";
            const expected = 1;
            TO_PV.mockReturnValueOnce(expected);
            // @ts-expect-error -- test private method
            const actual = DemarchesSimplifieesEntityAdapter.nestedToProviderValues(VALUE, TO_PV);
            expect(actual).toEqual(expected);
        });

        it("if object, call for each attribute", () => {
            const OBJECT = { a: 23, b: 34 };
            const expected = { a: 1, b: 2 };
            Object.values(expected).forEach(v => TO_PV.mockReturnValueOnce(v));
            // @ts-expect-error -- test private method
            const actual = DemarchesSimplifieesEntityAdapter.nestedToProviderValues(OBJECT, TO_PV);
            expect(actual).toEqual(expected);
        });
    });

    describe("toFlat", () => {
        const SCHEMA = "SCHEMA" as unknown as DemarchesSimplifieesSchema;
        const ADAPTED = {
            beneficiaryEstablishmentId: 12345678901234,
            provider: "producerSlug",
            applicationProviderId: "blablablaHash",
            budgetaryYear: 2024,
            ej: "567",
            depositDate: "2024-09-09",
            status: "statut à adapter",
        };

        beforeAll(() => {
            mapMock.mockReturnValue(ADAPTED);
            mockAdaptStatus.mockReturnValue("statutAdapté");
        });

        afterAll(() => {
            mapMock.mockRestore();
            mockAdaptStatus.mockRestore();
        });

        it("maps schema", () => {
            DemarchesSimplifieesEntityAdapter.toFlat(DEMANDE, SCHEMA);
            expect(mapMock).toHaveBeenCalledWith(DEMANDE, SCHEMA, "flatSchema");
        });

        it("adapts status", () => {
            const expected = ADAPTED.status;
            DemarchesSimplifieesEntityAdapter.toFlat(DEMANDE, SCHEMA);
            expect(providerAdapter.toStatusFactory).toHaveBeenCalledWith(
                // @ts-expect-error -- private attribute
                DemarchesSimplifieesEntityAdapter._statusConversionArray,
            );
            expect(mockAdaptStatus).toHaveBeenCalledWith(expected);
        });

        it("adapts built attributes", () => {
            const ENTITY = { demarcheId: 987 } as DemarchesSimplifieesDataEntity;
            const actual = DemarchesSimplifieesEntityAdapter.toFlat(ENTITY, SCHEMA);
            expect(actual).toMatchSnapshot();
        });
    });
});
