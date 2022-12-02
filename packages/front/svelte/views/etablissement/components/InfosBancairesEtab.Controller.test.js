import { InfosBancairesEtabController } from "./InfosBancairesEtab.Controller";

/* jest.mock("../../../../helpers/dataHelper.js", () => ({
    ...jest.requireActual("../../../../helpers/dataHelper.js"),
    valueOrHyphen: jest.fn(v => v),
    formatPhoneNumber: jest.fn(v => v)
})); */

describe("InfosBancairesEtabController", () => {
    const infosBanquairesRaw = [
        [
            {
                value: {
                    iban: "FR1517569000301937696517I48",
                    bic: "BTOTORPPPAA"
                },
                provider: "BASE SIREN <Via API ASSO>",
                last_update: "2021-11-28T00:00:00.000Z",
                type: "object"
            }
        ],
        [
            {
                value: {
                    iban: "FR6312739000403863291458F56",
                    bic: "TOTOFRPPPAA"
                },
                provider: "BASE SIREN <Via API ASSO>",
                last_update: "2021-10-27T00:00:00.000Z",
                type: "object"
            },
            {
                value: {
                    iban: "FR8912739000506746997936N17",
                    bic: "TOTOFRPTOTO"
                },
                provider: "BASE SIREN <Via API ASSO>",
                last_update: "2021-12-01T00:00:00.000Z",
                type: "object"
            }
        ]
    ];
    const flatSourcedInfosBancaires = [
        {
            iban: "FR1517569000301937696517I48",
            bic: "BTOTORPPPAA",
            provider: "BASE SIREN <Via API ASSO>",
            date: "28/11/2021"
        },
        {
            iban: "FR6312739000403863291458F56",
            bic: "TOTOFRPPPAA",
            provider: "BASE SIREN <Via API ASSO>",
            date: "27/10/2021"
        },
        {
            iban: "FR8912739000506746997936N17",
            bic: "TOTOFRPTOTO",
            provider: "BASE SIREN <Via API ASSO>",
            date: "01/12/2021"
        }
    ];

    let controller;

    beforeEach(() => {
        controller = new InfosBancairesEtabController(infosBanquairesRaw);
        jest.clearAllMocks();
    });

    describe("_formatBankElement()", () => {
        it.each`
            raw                   | expected
            ${infosBanquairesRaw} | ${flatSourcedInfosBancaires}
            ${[]}                 | ${[]}
            ${null}               | ${[]}
            ${undefined}          | ${[]}
        `("should work", ({ raw, expected }) => {
            const actual = controller._formatBankElement(raw);
            expect(actual).toStrictEqual(expected);
        });
    });
});
