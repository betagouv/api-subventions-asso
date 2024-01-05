import ApiAssoDtoAdapter from "../adapters/ApiAssoDtoAdapter";

export const RnaDtoDocument = {
    __meta__: {},
    nom: {
        last_update: new Date("2021-01-19T18:42:37.171Z"),
        provider: ApiAssoDtoAdapter.providerNameRna,
        type: "string",
        value: "PV - ididididid",
    },
    type: {
        last_update: new Date("2021-01-19T18:42:37.171Z"),
        provider: ApiAssoDtoAdapter.providerNameRna,
        type: "string",
        value: "PV",
    },
    url: {
        last_update: new Date("2021-01-19T18:42:37.171Z"),
        provider: ApiAssoDtoAdapter.providerNameRna,
        type: "string",
        value: "/document/api_asso/?url=%2Ffake%2Furl",
    },
};

export const DacSiret = "50922194100000";

export const DacDtoDocument = {
    __meta__: {
        siret: DacSiret,
    },
    nom: {
        last_update: new Date("2021-06-18T12:02:00.000Z"),
        provider: ApiAssoDtoAdapter.providerNameLcaDocument,
        type: "string",
        value: "nom fake",
    },
    type: {
        last_update: new Date("2021-06-18T12:02:00.000Z"),
        provider: ApiAssoDtoAdapter.providerNameLcaDocument,
        type: "string",
        value: "BPA",
    },
    url: {
        last_update: new Date("2021-06-18T12:02:00.000Z"),
        provider: ApiAssoDtoAdapter.providerNameLcaDocument,
        type: "string",
        value: "/document/api_asso/?url=%2Ffake%2Furl",
    },
};

export const DtoDocument = [RnaDtoDocument, DacDtoDocument];
