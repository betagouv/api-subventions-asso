export const RnaDtoDocument = {
    "__meta__": {},
    "nom": {
        "last_update": new Date("2021-01-19T18:42:37.171Z"),
        "provider": "BASE RNA <Via API ASSO>",
        "type": "string",
        "value": "ididididid",
    },
    "type": {
        "last_update": new Date("2021-01-19T18:42:37.171Z"),
        "provider": "BASE RNA <Via API ASSO>",
        "type": "string",
        "value": "PV",
    },
    "url": {
        "last_update": new Date("2021-01-19T18:42:37.171Z"),
        "provider": "BASE RNA <Via API ASSO>",
        "type": "string",
        "value": "/fake/url",
    },
}

export const DacSiret = "50922194100000";

export const DacDtoDocument = {
    "__meta__": {
        "siret": DacSiret,
    },
    "nom": {
        "last_update": new Date("2021-06-18T12:02:00.000Z"),
        "provider": "Document déposer dans le comtpe asso <Via API ASSO>",
        "type": "string",
        "value": "nom fake",
    },
    "type": {
        "last_update": new Date("2021-06-18T12:02:00.000Z"),
        "provider": "Document déposer dans le comtpe asso <Via API ASSO>",
        "type": "string",
        "value": "BPA",
    },
    "url": {
        "last_update": new Date("2021-06-18T12:02:00.000Z"),
        "provider": "Document déposer dans le comtpe asso <Via API ASSO>",
        "type": "string",
        "value": "/fake/url",
    },
}

export const DtoDocument = [
    RnaDtoDocument,
    DacDtoDocument
]