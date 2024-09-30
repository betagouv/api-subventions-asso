import SubventiaDto from "../@types/subventia.dto";
import SubventiaValidator from "./subventia.validator";

const PARSED_DATA_ROW = {
    "SIRET - Demandeur": "77568879901340",
    "Date - Décision": "60042",
    "Montant voté TTC - Décision": 31164,
    "Montant Ttc": 230,
    "Référence administrative - Demande": "00005478",
    "Statut - Dossier de financement": "VOTE",
    annee_demande: 2023,
} as unknown as SubventiaDto;

const PARSED_DATA_ROW_2 = {
    "SIRET - Demandeur": "77568879601340",
    "Date - Décision": "60042",
    "Montant voté TTC - Décision": 31164,
    "Montant Ttc": 1230,
    "Référence administrative - Demande": "0000578",
    annee_demande: 2023,
} as unknown as SubventiaDto;

const INVALID_DATA_ROW = {
    "SIRET - Demandeur": "77568879901340",
    "Date - Décision": "60042",
    "Montant voté TTC - Décision": 31164,
    "Montant Ttc": "invalidNumber",
    "Référence administrative - Demande": "00005478",
    annee_demande: 2023,
} as unknown as SubventiaDto;

const PARSED_DATA = [PARSED_DATA_ROW, PARSED_DATA_ROW_2, INVALID_DATA_ROW];

describe("SubventiaValidator", () => {
    describe("isSubventiaDtoValid", () => {
        it("should return true and no problems if all the data is valid", () => {
            const expected = { valid: true };
            // @ts-expect-error : test invalid data
            const actual = SubventiaValidator.isSubventiaDtoValid(PARSED_DATA_ROW);
            expect(actual).toEqual(expected);
        });

        it("should return false and problems if the SIRET is invalid", () => {
            const expected = {
                valid: false,
                problems: [
                    {
                        field: "SIRET - Demandeur",
                        value: "invalidSiret",
                        message: "SIRET manquant ou invalid",
                    },
                ],
            };
            // @ts-expect-error : test invalid data
            const actual = SubventiaValidator.isSubventiaDtoValid({
                ...PARSED_DATA_ROW,
                "SIRET - Demandeur": "invalidSiret",
            });
            expect(actual).toEqual(expected);
        });

        it("should return false and problems if the SIRET is null", () => {
            const expected = {
                valid: false,
                problems: [
                    {
                        field: "SIRET - Demandeur",
                        value: undefined,
                        message: "SIRET manquant ou invalid",
                    },
                ],
            };
            // @ts-expect-error : test protected method
            const actual = SubventiaValidator.isSubventiaDtoValid({
                ...PARSED_DATA_ROW,
                // @ts-expect-error : test invalid data
                "SIRET - Demandeur": undefined,
            });
            expect(actual).toEqual(expected);
        });

        it("should return false and problems if the Date - Décision is not a valid date", () => {
            const expected = {
                valid: false,
                problems: [
                    {
                        field: "Date - Décision",
                        value: "invalidDate",
                        message: "Date - Décision n'est pas valid",
                    },
                ],
            };
            // @ts-expect-error : test invalid data
            const actual = SubventiaValidator.isSubventiaDtoValid({
                ...PARSED_DATA_ROW,
                "Date - Décision": "invalidDate",
            });
            expect(actual).toEqual(expected);
        });

        it("should return true if the Date - Décision is null", () => {
            const expected = {
                valid: true,
            };
            // @ts-expect-error : test invalid data
            const actual = SubventiaValidator.isSubventiaDtoValid({ ...PARSED_DATA_ROW, "Date - Décision": undefined });
            expect(actual).toEqual(expected);
        });

        it("should return false and problems if the Montant voté TTC - Décision is not a number", () => {
            const expected = {
                valid: false,
                problems: [
                    {
                        field: "Montant voté TTC - Décision",
                        value: "invalid",
                        message: "Montant voté TTC - Décision n'est pas un nombre",
                    },
                ],
            };
            // @ts-expect-error : test protected method
            const actual = SubventiaValidator.isSubventiaDtoValid({
                ...PARSED_DATA_ROW,
                // @ts-expect-error : test invalid data
                "Montant voté TTC - Décision": "invalid",
            });
            expect(actual).toEqual(expected);
        });

        it("should return true if the Montant voté TTC - Décision is null", () => {
            const expected = { valid: true };
            // @ts-expect-error : test protected method
            const actual = SubventiaValidator.isSubventiaDtoValid({
                ...PARSED_DATA_ROW,
                // @ts-expect-error : test invalid data
                "Montant voté TTC - Décision": undefined,
            });
            expect(actual).toEqual(expected);
        });

        it("should return false and problems if the Montant Ttc is not a number", () => {
            const expected = {
                valid: false,
                problems: [
                    {
                        field: "Montant Ttc",
                        value: "invalidNumber",
                        message: "Montant Ttc n'est pas un nombre",
                    },
                ],
            };
            // @ts-expect-error : test protected method
            const actual = SubventiaValidator.isSubventiaDtoValid({
                ...PARSED_DATA_ROW,
                // @ts-expect-error : test invalid data
                "Montant Ttc": "invalidNumber",
            });
            expect(actual).toEqual(expected);
        });

        it("should return true if the Montant Ttc is null", () => {
            const expected = { valid: true };
            // @ts-expect-error : test invalid data
            const actual = SubventiaValidator.isSubventiaDtoValid({ ...PARSED_DATA_ROW, "Montant Ttc": undefined });
            expect(actual).toEqual(expected);
        });

        it("should return false and problems if the Référence administrative - Demande is null", () => {
            const expected = {
                valid: false,
                problems: [
                    {
                        field: "Référence administrative - Demande",
                        value: null,
                        message: "Référence demande null n'est pas une donnée acceptée",
                    },
                ],
            };
            // @ts-expect-error : test protected method
            const actual = SubventiaValidator.isSubventiaDtoValid({
                ...PARSED_DATA_ROW,
                // @ts-expect-error : test invalid data
                "Référence administrative - Demande": null,
            });
            expect(actual).toEqual(expected);
        });

        it("should return false and problem if the Date - Décision is valid but lower than the year of the request", () => {
            const expected = {
                valid: false,
                problems: [
                    {
                        field: "Date - Décision",
                        value: "50",
                        message: "La date de la décision ne peut pas être inférieure à la date de la demande",
                    },
                ],
            };
            // @ts-expect-error : test invalid data
            const actual = SubventiaValidator.isSubventiaDtoValid({ ...PARSED_DATA_ROW, "Date - Décision": "50" });
            console.log(actual);
            expect(actual).toEqual(expected);
        });

        it("should return false if the Montant voté TTC - Décision is an empty string and status demande VOTE or SOLDE", () => {
            const expected = {
                valid: false,
                problems: [
                    {
                        field: "Montant voté TTC - Décision",
                        value: "",
                        message: `Montant voté TTC - Décision est requis pour les status VOTE et SOLDE`,
                    },
                ],
            };
            // @ts-expect-error : test protected method
            const actual = SubventiaValidator.isSubventiaDtoValid({
                ...PARSED_DATA_ROW,
                // @ts-expect-error : test invalid data
                "Montant voté TTC - Décision": "",
            });
            expect(actual).toEqual(expected);
        });
    });

    describe("sortDataByValidity", () => {
        let mockIsSubventiaDtoValid: jest.SpyInstance;
        let mockFormatInvalids: jest.SpyInstance;

        beforeAll(() => {
            mockIsSubventiaDtoValid = jest
                //@ts-expect-error : test protected method
                .spyOn(SubventiaValidator, "isSubventiaDtoValid")
                .mockReturnValue({ valid: true });
            mockFormatInvalids = jest
                //@ts-expect-error : test protected method
                .spyOn(SubventiaValidator, "formatInvalids")
                .mockReturnValue([
                    {
                        ...INVALID_DATA_ROW,
                        field: "Montant Ttc",
                        value: "invalidNumber",
                        message: "Montant Ttc is not a number",
                    },
                ]);
        });

        afterAll(() => {
            mockIsSubventiaDtoValid.mockRestore();
            mockFormatInvalids.mockRestore();
        });

        it("should call isSubventiaDtoValid", () => {
            SubventiaValidator.sortDataByValidity(PARSED_DATA);
            expect(mockIsSubventiaDtoValid).toHaveBeenCalledTimes(PARSED_DATA.length);
        });

        it("should call formatInvalids", () => {
            SubventiaValidator.sortDataByValidity(PARSED_DATA);
            expect(mockFormatInvalids).toHaveBeenCalledTimes(1);
        });

        it("should return an object with valids and invalids keys", () => {
            mockIsSubventiaDtoValid.mockReturnValueOnce({ valid: true });
            mockIsSubventiaDtoValid.mockReturnValueOnce({ valid: true });
            mockIsSubventiaDtoValid.mockReturnValueOnce({
                valid: false,
                problems: [{ field: "Montant Ttc", value: "invalidNumber", message: "Montant Ttc is not a number" }],
            });

            const expected = {
                valids: [PARSED_DATA_ROW, PARSED_DATA_ROW_2],
                invalids: [
                    {
                        ...INVALID_DATA_ROW,
                        field: "Montant Ttc",
                        value: "invalidNumber",
                        message: "Montant Ttc is not a number",
                    },
                ],
            };
            const actual = SubventiaValidator.sortDataByValidity(PARSED_DATA);
            expect(actual).toEqual(expected);
        });
    });

    describe("formatDate", () => {
        it("should return '' if ExcelDate is null", () => {
            // @ts-expect-error: protected
            expect(SubventiaValidator.formatDate(null)).toEqual("");
        });

        it("should return a Date object if ExcelDate is not null", async () => {
            const EXCEL_DATE = "44327";
            const EXPECTED = "11/05/2021";
            // @ts-expect-error: protected
            expect(SubventiaValidator.formatDate(EXCEL_DATE)).toEqual(EXPECTED);
        });
    });

    describe("formatInvalids", () => {
        it("should return an array of objects with formatted date", () => {
            const invalids = [
                {
                    error: "error",
                    "Date - Décision": "44712",
                    "Date limite de début de réalisation": "44705",
                    "Date limite de fin de réalisation": "44726",
                    "Date - Visa de recevabilité": "44677",
                },
            ];
            const expected = [
                {
                    error: "error",
                    "Date - Décision": "31/05/2022",
                    "Date limite de début de réalisation": "24/05/2022",
                    "Date limite de fin de réalisation": "14/06/2022",
                    "Date - Visa de recevabilité": "26/04/2022",
                },
            ];
            // @ts-expect-error: protected
            expect(SubventiaValidator.formatInvalids(invalids)).toEqual(expected);
        });
    });
});
