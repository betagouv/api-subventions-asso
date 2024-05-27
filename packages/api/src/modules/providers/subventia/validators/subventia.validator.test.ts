import SubventiaValidator from "./subventia.validator";

const PARSEDDATAROW = {
    "SIRET - Demandeur": "77568879901340",
    "Date - Décision": 60042,
    "Montant voté TTC - Décision": 31164,
    "Montant Ttc": 230,
    "Référence administrative - Demande": "00005478",
    annee_demande: 2023,
};

const PARSEDDATAROW_2 = {
    "SIRET - Demandeur": "77568879601340",
    "Date - Décision": 60042,
    "Montant voté TTC - Décision": 31164,
    "Montant Ttc": 1230,
    "Référence administrative - Demande": "0000578",
    annee_demande: 2023,
};

const INVALIDDATAROW = {
    "SIRET - Demandeur": "77568879901340",
    "Date - Décision": 60042,
    "Montant voté TTC - Décision": 31164,
    "Montant Ttc": "invalidNumber",
    "Référence administrative - Demande": "00005478",
    annee_demande: 2023,
};

const PARSEDDATA = [PARSEDDATAROW, PARSEDDATAROW_2, INVALIDDATAROW];

describe("SubventiaValidator", () => {
    describe("validateDataRowTypes", () => {
        it("should throw an error if the SIRET is invalid", () => {
            const parsedDataRow = { ...PARSEDDATAROW, "SIRET - Demandeur": "invalidSiret" };
            expect(() => SubventiaValidator.validateDataRowTypes(parsedDataRow)).toThrowError(
                "INVALID SIRET FOR invalidSiret",
            );
        });

        it("should throw an error if the Date - Décision is not a valid date", () => {
            const parsedDataRow = { ...PARSEDDATAROW, "Date - Décision": "invalidDate" };
            expect(() => SubventiaValidator.validateDataRowTypes(parsedDataRow)).toThrowError(
                "Date - Décision is not a valid date",
            );
        });

        it("should throw an error if the Montant voté TTC - Décision is not a number", () => {
            const parsedDataRow = { ...PARSEDDATAROW, "Montant voté TTC - Décision": "invalidNumber" };

            expect(() => SubventiaValidator.validateDataRowTypes(parsedDataRow)).toThrowError(
                "Montant voté TTC - Décision is not a number",
            );
        });

        it("should throw an error if the Montant Ttc is not a number", () => {
            const parsedDataRow = { ...PARSEDDATAROW, "Montant Ttc": "invalidNumber" };
            console.log(parsedDataRow["Montant Ttc"]);
            expect(() => SubventiaValidator.validateDataRowTypes(parsedDataRow)).toThrowError(
                "Montant Ttc is not a number",
            );
        });

        it("should return true if the data types are valid", () => {
            const expected = true;
            const actual = SubventiaValidator.validateDataRowTypes(PARSEDDATAROW);
            expect(actual).toEqual(expected);
        });
    });

    describe("validateDataRowCoherence", () => {
        it("should throw an error if the Référence administrative - Demande is null", () => {
            const parsedDataRow = { ...PARSEDDATAROW, "Référence administrative - Demande": null };
            expect(() => SubventiaValidator.validateDataRowCoherence(parsedDataRow)).toThrowError(
                "Référence demande null is not accepted in data",
            );
        });

        it("should throw an error if the Date - Décision is lower than the year of the request", () => {
            const parsedDataRow = { ...PARSEDDATAROW, "Date - Décision": 50 };
            expect(() => SubventiaValidator.validateDataRowCoherence(parsedDataRow)).toThrowError(
                "The year of the decision cannot be lower than the year of the request",
            );
        });

        it("should return true if the data is coherent", () => {
            const expected = true;
            const actual = SubventiaValidator.validateDataRowCoherence(PARSEDDATAROW);
            expect(actual).toEqual(expected);
        });
    });

    describe("isDataRowTypesValid", () => {
        let mockValidateDataRowTypes: jest.SpyInstance;
        beforeEach(() => {
            mockValidateDataRowTypes = jest.spyOn(SubventiaValidator, "validateDataRowTypes").mockReturnValue(true);
        });

        afterAll(() => {
            mockValidateDataRowTypes.mockRestore();
        });

        it("should call validateDataRowTypes", () => {
            //@ts-expect-error : test protected method
            SubventiaValidator.isDataRowTypesValid(PARSEDDATAROW);
            expect(mockValidateDataRowTypes).toHaveBeenCalledWith(PARSEDDATAROW);
        });

        it("should return false if validateDataRowTypes throw an error", () => {
            mockValidateDataRowTypes.mockImplementation(() => {
                throw new Error("error");
            });
            //@ts-expect-error : test protected method
            const actual = SubventiaValidator.isDataRowTypesValid(PARSEDDATAROW);
            expect(actual).toEqual(false);
        });

        it("should return true if validateDataRowTypes return true", () => {
            //@ts-expect-error : test protected method
            const actual = SubventiaValidator.isDataRowTypesValid(PARSEDDATAROW);
            expect(actual).toEqual(true);
        });
    });

    describe("isDataRowCoherenceValid", () => {
        let mockValidateDataRowCoherence: jest.SpyInstance;
        beforeEach(() => {
            mockValidateDataRowCoherence = jest
                .spyOn(SubventiaValidator, "validateDataRowCoherence")
                .mockReturnValue(true);
        });

        afterAll(() => {
            mockValidateDataRowCoherence.mockRestore();
        });

        it("should call validateDataRowCoherence", () => {
            //@ts-expect-error : test protected method
            SubventiaValidator.isDataRowCoherenceValid(PARSEDDATAROW);
            expect(mockValidateDataRowCoherence).toHaveBeenCalledWith(PARSEDDATAROW);
        });

        it("should return false if validateDataRowCoherence throw an error", () => {
            mockValidateDataRowCoherence.mockImplementation(() => {
                throw new Error("error");
            });
            //@ts-expect-error : test protected method
            const actual = SubventiaValidator.isDataRowCoherenceValid(PARSEDDATAROW);
            expect(actual).toEqual(false);
        });

        it("should return true if validateDataRowCoherence return true", () => {
            //@ts-expect-error : test protected method
            const actual = SubventiaValidator.isDataRowCoherenceValid(PARSEDDATAROW);
            expect(actual).toEqual(true);
        });
    });

    describe("sortDataByValidity", () => {
        let mockIsDataRowTypesValid: jest.SpyInstance;
        let mockIsDataRowCoherenceValid: jest.SpyInstance;

        beforeEach(() => {
            //@ts-expect-error : test protected method
            mockIsDataRowTypesValid = jest.spyOn(SubventiaValidator, "isDataRowTypesValid").mockReturnValue(true);
            //@ts-expect-error : test protected method
            mockIsDataRowCoherenceValid = jest
                .spyOn(SubventiaValidator, "isDataRowCoherenceValid")
                .mockReturnValue(true);
        });

        afterAll(() => {
            mockIsDataRowTypesValid.mockReset();
            mockIsDataRowCoherenceValid.mockReset();
        });

        it("should call isDataRowTypesValid", () => {
            SubventiaValidator.sortDataByValidity(PARSEDDATA);
            expect(mockIsDataRowTypesValid).toHaveBeenCalledTimes(PARSEDDATA.length);
        });

        it("should return an object with valids and invalids keys", () => {
            mockIsDataRowTypesValid.mockImplementation(() => {
                if (mockIsDataRowTypesValid.mock.calls.length < 3) {
                    return true;
                } else {
                    return false;
                }
            });

            const expected = { valids: [PARSEDDATAROW, PARSEDDATAROW_2], invalids: [INVALIDDATAROW] };
            const actual = SubventiaValidator.sortDataByValidity(PARSEDDATA);
            expect(actual).toEqual(expected);
        });
    });
});
