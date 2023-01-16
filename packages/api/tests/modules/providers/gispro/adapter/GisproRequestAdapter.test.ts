import { ObjectId } from "mongodb";
import GisproRequestAdapter from "../../../../../src/modules/providers/gispro/adapters/GisproRequestAdapter";
import { ProviderValue } from "@api-subventions-asso/dto";
import GisproActionEntity from "../../../../../src/modules/providers/gispro/entities/GisproActionEntity";
import IGisproActionInformations from "../../../../../src/modules/providers/gispro/@types/IGisproActionInformations";

describe("GisproRequestAdapter", () => {
    describe("toDemandeSubvention()", () => {
        it("should return data with specific properties", () => {
            const expected = {
                siret: {} as ProviderValue,
                service_instructeur: {} as ProviderValue,
                status: {} as ProviderValue,
                montants: {} as ProviderValue,
                actions_proposee: {} as ProviderValue
            };
            const providerInformations = {} as IGisproActionInformations;
            const data = {};
            const id = {} as ObjectId;
            const actual = GisproRequestAdapter.toDemandeSubvention([
                new GisproActionEntity(providerInformations, data, id)
            ]);
            expect(Object.keys(actual)).toEqual(Object.keys(expected));
        });
    });
});
