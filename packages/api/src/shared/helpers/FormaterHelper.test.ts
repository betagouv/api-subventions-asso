import ApiAssoDtoMapper from "../../modules/providers/apiAsso/mappers/api-asso-dto.mapper";
import ApiEntrepriseMapper from "../../modules/providers/apiEntreprise/mappers/api-entreprise.mapper";
import FonjepEntityMapper from "../../modules/providers/fonjep/mappers/fonjep-entity.mapper";
import OsirisRequestMapper from "../../modules/providers/osiris/mappers/osiris-request.mapper";
import ProviderValueMapper from "../mappers/provider-value.mapper";
import FormaterHelper from "./FormaterHelper";

const PROVIDER_SCORE = {
    [ApiAssoDtoMapper.providerNameSiren]: 1,
    [ApiEntrepriseMapper.PROVIDER_NAME]: 1,
    [OsirisRequestMapper.PROVIDER_NAME]: 0.5,
    [FonjepEntityMapper.PROVIDER_NAME]: 0.5,
};

describe("FormaterHelper", () => {
    const DATA_ONE_PROVIDER = [
        {
            siret: [
                {
                    value: "77566314900273",
                    provider: "BASE SIREN <Via API ASSO>",
                    last_update: new Date(),
                    type: "string",
                },
            ],
            nic: [
                {
                    value: "00273",
                    provider: "BASE SIREN <Via API ASSO>",
                    last_update: new Date(),
                    type: "string",
                },
            ],
            information_banquaire: [
                [
                    {
                        value: {
                            iban: "FR7630004027900001024273548",
                            bic: "BNPAFRPPXXX",
                        },
                        provider: "BASE SIREN <Via API ASSO>",
                        last_update: new Date(),
                        type: "object",
                    },
                ],
                [
                    {
                        value: {
                            iban: "FR4420041000012559290T02060",
                            bic: "PSSTFRPPPAR",
                        },
                        provider: "BASE SIREN <Via API ASSO>",
                        last_update: new Date(),
                        type: "object",
                    },
                ],
            ],
        },
    ];
    const DATA_TWO_PROVIDER = [
        {
            siret: [
                {
                    value: "77566314900273",
                    provider: "BASE SIREN <Via API ASSO>",
                    last_update: new Date(),
                    type: "string",
                },
            ],
            nic: [
                {
                    value: "00273",
                    provider: "BASE SIREN <Via API ASSO>",
                    last_update: new Date(),
                    type: "string",
                },
            ],
            information_banquaire: [
                [
                    {
                        value: {
                            iban: "FR7630004027900001024273548",
                            bic: "BNPAFRPPXXX",
                        },
                        provider: "BASE SIREN <Via API ASSO>",
                        last_update: new Date(),
                        type: "object",
                    },
                ],
                [
                    {
                        value: {
                            iban: "FR4420041000012559290T02060",
                            bic: "PSSTFRPPPAR",
                        },
                        provider: "BASE SIREN <Via API ASSO>",
                        last_update: new Date(),
                        type: "object",
                    },
                ],
            ],
        },
        {
            siret: [
                {
                    value: "77566314900273",
                    provider: "BASE SIREN <Via API ASSO>",
                    last_update: new Date(),
                    type: "string",
                },
            ],
            nic: [
                {
                    value: "00273",
                    provider: "BASE SIREN <Via API ASSO>",
                    last_update: new Date(),
                    type: "string",
                },
            ],
            information_banquaire: [
                [
                    {
                        value: {
                            iban: "FR7630004027900001027843148",
                            bic: "BNPAFRPPXXX",
                        },
                        provider: "BASE SIREN <Via API ASSO>",
                        last_update: new Date(),
                        type: "object",
                    },
                ],
                [
                    {
                        value: {
                            iban: "FR7630004027900001000673448",
                            bic: "BNPAFRPPPAA",
                        },
                        provider: "BASE SIREN <Via API ASSO>",
                        last_update: new Date(),
                        type: "object",
                    },
                ],
            ],
        },
    ];

    describe("formatData", () => {
        it.each`
            data                 | expected
            ${DATA_ONE_PROVIDER} | ${true}
            ${DATA_TWO_PROVIDER} | ${true}
        `("should return an object of ProviderValues", ({ data, expected }) => {
            const result = FormaterHelper.formatData(data, PROVIDER_SCORE);
            const actual = Object.values(result).every(ProviderValueMapper.isProviderValues);
            expect(actual).toEqual(expected);
        });
    });
});
