import { RECORDS } from "./__fixtures__/dataBretagne.fixture";
import { ENTITIES } from "../providers/chorus/__fixtures__/ChorusFixtures";
import { PAYMENT_FLAT_ENTITY } from "./__fixtures__/paymentFlatEntity.fixture";
import PaymentFlatAdapter from "./paymentFlatAdapter";
import IChorusIndexedInformations from "../providers/chorus/@types/IChorusIndexedInformations";
import ChorusLineEntity from "../providers/chorus/entities/ChorusLineEntity";
console.error = jest.fn();

const documentDataReturnedValue = {
    programCode: 101,
    activityCode: "3222",
    actionCode: "0101-01-02",
    programEntity: RECORDS["programme"][101],
    ministryEntity: RECORDS["ministry"]["code"],
    domaineFonctEntity: RECORDS["domaineFonct"]["0101-01-02"],
    refProgrammationEntity: RECORDS["refProgrammation"]["3222"],
};

const CHORUS_LINE_ENTITY = ENTITIES[0];

describe("PaymentFlatAdapter", () => {
    describe("toPaymentFlatEntity", () => {
        let mockGetDataBretagneDocumentData: jest.SpyInstance;
        beforeEach(() => {
            //@ts-expect-error : test private method
            mockGetDataBretagneDocumentData = jest.spyOn(PaymentFlatAdapter, "getDataBretagneDocumentData");
            mockGetDataBretagneDocumentData.mockReturnValue(documentDataReturnedValue);
        });
        afterAll(() => {
            mockGetDataBretagneDocumentData.mockRestore();
        });

        it("should return PaymentFlatEntity when data is fully provided", () => {
            const result = PaymentFlatAdapter.toNotAggregatedChorusPaymentFlatEntity(
                CHORUS_LINE_ENTITY,
                RECORDS["programme"],
                RECORDS["ministry"],
                RECORDS["domaineFonct"],
                RECORDS["refProgrammation"],
            );

            const expected = PAYMENT_FLAT_ENTITY;
            expect(result).toEqual(expected);
        });

        it("should return PaymentFlatEntity with null when data is not fully provided", () => {
            mockGetDataBretagneDocumentData.mockReturnValueOnce({
                ...documentDataReturnedValue,
                programEntity: undefined,
            });
            const result = PaymentFlatAdapter.toNotAggregatedChorusPaymentFlatEntity(
                { ...CHORUS_LINE_ENTITY } as unknown as ChorusLineEntity,
                RECORDS["programme"],
                RECORDS["ministry"],
                RECORDS["domaineFonct"],
                RECORDS["refProgrammation"],
            );

            const expected = {
                ...PAYMENT_FLAT_ENTITY,
                programName: null,
                mission: null,
            };
            expect(result).toEqual(expected);
        });
    });

    describe("getDataBretagneDocumentData", () => {
        it("should return DataBretagne Document Data when no null is present", () => {
            //@ts-expect-error : test private method
            const result = PaymentFlatAdapter.getDataBretagneDocumentData(
                CHORUS_LINE_ENTITY.indexedInformations,
                RECORDS["programme"],
                RECORDS["ministry"],
                RECORDS["domaineFonct"],
                RECORDS["refProgrammation"],
            );

            const expected = documentDataReturnedValue;
            expect(result).toEqual(expected);
        });

        it("should return DataBretagne Document Data with undefined when the join did not work", () => {
            //@ts-expect-error : test private method
            const result = PaymentFlatAdapter.getDataBretagneDocumentData(
                {
                    ...CHORUS_LINE_ENTITY.indexedInformations,
                    codeDomaineFonctionnel: "0161AC123",
                },
                RECORDS["programme"],
                RECORDS["ministry"],
                RECORDS["domaineFonct"],
                RECORDS["refProgrammation"],
            );

            expect(result).toEqual({
                programCode: 161,
                activityCode: "3222",
                actionCode: "0161AC123",
                programEntity: undefined,
                ministryEntity: undefined,
                domaineFonctEntity: undefined,
                refProgrammationEntity: RECORDS["refProgrammation"]["3222"],
            });
        });

        it("should console.error twice when program not found", () => {
            // twice because ministry cannot be found neither
            RECORDS["domaineFonct"]["0161AC123"] = { ...RECORDS["domaineFonct"]["0163AC123"], code_programme: 161 };
            //@ts-expect-error : test private method
            const result = PaymentFlatAdapter.getDataBretagneDocumentData(
                {
                    ...CHORUS_LINE_ENTITY.indexedInformations,
                    codeDomaineFonctionnel: "0161AC123",
                } as unknown as IChorusIndexedInformations,
                RECORDS["programme"],
                RECORDS["ministry"],
                RECORDS["domaineFonct"],
                RECORDS["refProgrammation"],
            );

            expect(console.error).toHaveBeenCalledTimes(2);
            delete RECORDS["domaineFonct"]["0161AC123"];
        });

        it.each([
            {
                chorusLineEntity: { ...CHORUS_LINE_ENTITY.indexedInformations, codeDomaineFonctionnel: "0163" },
                codeValue: "0163",
                recordType: "DomaineFonctionnel",
            },
            {
                chorusLineEntity: { ...CHORUS_LINE_ENTITY.indexedInformations, codeActivitee: "code_2" },
                codeValue: "code_2",
                recordType: "RefProgrammation",
            },
            { chorusLineEntity: CHORUS_LINE_ENTITY.indexedInformations, codeValue: "code_2", recordType: "Ministry" },
        ])("should console.error when %s not found", ({ chorusLineEntity, codeValue, recordType }) => {
            RECORDS["programme"][101].code_ministere = codeValue;

            //@ts-expect-error : test private method
            const result = PaymentFlatAdapter.getDataBretagneDocumentData(
                chorusLineEntity as unknown as IChorusIndexedInformations,
                RECORDS["programme"],
                RECORDS["ministry"],
                RECORDS["domaineFonct"],
                RECORDS["refProgrammation"],
            );

            const expectedMessage = new RegExp(`${recordType} not found for .* ${codeValue}`);
            expect(console.error).toHaveBeenCalledWith(expect.stringMatching(expectedMessage));

            RECORDS["programme"][101].code_ministere = "code";
        });
    });
});