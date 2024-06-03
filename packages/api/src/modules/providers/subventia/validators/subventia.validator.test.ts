import SubventiaDto from "../@types/subventia.dto";
import SubventiaValidator from "./subventia.validator";

const PARSED_DATA_ROW = {
    "SIRET - Demandeur": "77568879901340",
    "Date - Décision": "60042",
    "Montant voté TTC - Décision": 31164,
    "Montant Ttc": 230,
    "Référence administrative - Demande": "00005478",
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
    describe("validateDataRowTypes", () => {
        it("should throw an error if the SIRET is invalid", () => {
            const parsedDataRow = { ...PARSED_DATA_ROW, "SIRET - Demandeur": "invalidSiret" };
            expect(() => SubventiaValidator.validateDataRowTypes(parsedDataRow)).toThrowError(
                "INVALID SIRET FOR invalidSiret",
            );
        });

        it("should throw an error if the Date - Décision is not a valid date", () => {
            const parsedDataRow = { ...PARSED_DATA_ROW, "Date - Décision": "invalidDate" };
            expect(() => SubventiaValidator.validateDataRowTypes(parsedDataRow)).toThrowError(
                "Date - Décision is not a valid date",
            );
        });

        it("should throw an error if the Montant voté TTC - Décision is not a number", () => {
            const parsedDataRow = { ...PARSED_DATA_ROW, "Montant voté TTC - Décision": "invalidNumber" };
            // @ts-expect-error : test invalid data
            expect(() => SubventiaValidator.validateDataRowTypes(parsedDataRow)).toThrowError(
                "Montant voté TTC - Décision is not a number",
            );
        });

        it("should throw an error if the Montant Ttc is not a number", () => {
            const parsedDataRow = { ...PARSED_DATA_ROW, "Montant Ttc": "invalidNumber" };
            console.log(parsedDataRow["Montant Ttc"]);
            // @ts-expect-error : test invalid data
            expect(() => SubventiaValidator.validateDataRowTypes(parsedDataRow)).toThrowError(
                "Montant Ttc is not a number",
            );
        });

        it("should return true if the data types are valid", () => {
            const expected = true;
            const actual = SubventiaValidator.validateDataRowTypes(PARSED_DATA_ROW);
            expect(actual).toEqual(expected);
        });
    });

    describe("validateDataRowCoherence", () => {
        it("should throw an error if the Référence administrative - Demande is null", () => {
            const parsedDataRow = { ...PARSED_DATA_ROW, "Référence administrative - Demande": null };
            // @ts-expect-error : test invalid data
            expect(() => SubventiaValidator.validateDataRowCoherence(parsedDataRow)).toThrowError(
                "Référence demande null is not accepted in data",
            );
        });

        it("should throw an error if the Date - Décision is lower than the year of the request", () => {
            const parsedDataRow = { ...PARSED_DATA_ROW, "Date - Décision": "50" };

            expect(() => SubventiaValidator.validateDataRowCoherence(parsedDataRow)).toThrowError(
                "The year of the decision cannot be lower than the year of the request",
            );
        });

        it("should return true if the data is coherent", () => {
            const expected = true;
            const actual = SubventiaValidator.validateDataRowCoherence(PARSED_DATA_ROW);
            expect(actual).toEqual(expected);
        });
    });

    describe("isDataRowTypesValid", () => {
        let mockValidateDataRowTypes: jest.SpyInstance;
        beforeAll(() => {
            mockValidateDataRowTypes = jest.spyOn(SubventiaValidator, "validateDataRowTypes").mockReturnValue(true);
        });

        afterAll(() => {
            mockValidateDataRowTypes.mockRestore();
        });

        it("should call validateDataRowTypes", () => {
            //@ts-expect-error : test protected method
            SubventiaValidator.isDataRowTypesValid(PARSED_DATA_ROW);
            expect(mockValidateDataRowTypes).toHaveBeenCalledWith(PARSED_DATA_ROW);
        });

        it("should return false if validateDataRowTypes throw an error", () => {
            mockValidateDataRowTypes.mockImplementationOnce(() => {
                throw new Error("error");
            });

            //@ts-expect-error : test protected method
            const actual = SubventiaValidator.isDataRowTypesValid(PARSED_DATA_ROW);
            expect(actual).toEqual(false);
        });

        it("should return true if validateDataRowTypes return true", () => {
            //@ts-expect-error : test protected method
            const actual = SubventiaValidator.isDataRowTypesValid(PARSED_DATA_ROW);
            expect(actual).toEqual(true);
        });
    });

    describe("isDataRowCoherenceValid", () => {
        let mockValidateDataRowCoherence: jest.SpyInstance;
        beforeAll(() => {
            mockValidateDataRowCoherence = jest
                .spyOn(SubventiaValidator, "validateDataRowCoherence")
                .mockReturnValue(true);
        });

        afterAll(() => {
            mockValidateDataRowCoherence.mockRestore();
        });

        it("should call validateDataRowCoherence", () => {
            //@ts-expect-error : test protected method
            SubventiaValidator.isDataRowCoherenceValid(PARSED_DATA_ROW);
            expect(mockValidateDataRowCoherence).toHaveBeenCalledWith(PARSED_DATA_ROW);
        });

        it("should return false if validateDataRowCoherence throw an error", () => {
            mockValidateDataRowCoherence.mockImplementationOnce(() => {
                throw new Error("error");
            });
            //@ts-expect-error : test protected method
            const actual = SubventiaValidator.isDataRowCoherenceValid(PARSED_DATA_ROW);
            expect(actual).toEqual(false);
        });

        it("should return true if validateDataRowCoherence return true", () => {
            //@ts-expect-error : test protected method
            const actual = SubventiaValidator.isDataRowCoherenceValid(PARSED_DATA_ROW);
            expect(actual).toEqual(true);
        });
    });

    describe("sortDataByValidity", () => {
        let mockIsDataRowTypesValid: jest.SpyInstance;
        let mockIsDataRowCoherenceValid: jest.SpyInstance;

        beforeAll(() => {
            //@ts-expect-error : test protected method
            mockIsDataRowTypesValid = jest.spyOn(SubventiaValidator, "isDataRowTypesValid").mockReturnValue(true);

            mockIsDataRowCoherenceValid = jest //@ts-expect-error : test protected method
                .spyOn(SubventiaValidator, "isDataRowCoherenceValid")
                .mockReturnValue(true);
        });

        afterAll(() => {
            mockIsDataRowTypesValid.mockRestore();
            mockIsDataRowCoherenceValid.mockRestore();
        });

        it("should call isDataRowTypesValid", () => {
            SubventiaValidator.sortDataByValidity(PARSED_DATA);
            expect(mockIsDataRowTypesValid).toHaveBeenCalledTimes(PARSED_DATA.length);
        });

        it("should return an object with valids and invalids keys", () => {
            mockIsDataRowTypesValid.mockReturnValueOnce(true);
            mockIsDataRowTypesValid.mockReturnValueOnce(true);
            mockIsDataRowTypesValid.mockReturnValueOnce(false);

            const expected = { valids: [PARSED_DATA_ROW, PARSED_DATA_ROW_2], invalids: [INVALID_DATA_ROW] };
            const actual = SubventiaValidator.sortDataByValidity(PARSED_DATA);
            expect(actual).toEqual(expected);
        });
    });
});
