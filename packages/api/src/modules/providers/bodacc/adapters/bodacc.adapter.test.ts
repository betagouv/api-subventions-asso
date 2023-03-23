import { BodaccDto } from "../dto/BodaccDto";
import BodaccAdapter from "./bodacc.adapter";

describe("Bodacc Adapter", () => {
    jest.useFakeTimers().setSystemTime(new Date("2022-01-01"));

    const SIREN = "123456789";
    const RECORD = {
        record: {
            fields: {
                registre: ["", SIREN]
            }
        }
    };
    const BODACC_DTO = {
        records: [RECORD]
    } as BodaccDto;

    describe("toAssociation", () => {
        it("should return SIREN and BODACC", () => {
            const actual = BodaccAdapter.toAssociation(BODACC_DTO);
            expect(actual).toMatchSnapshot();
        });
    });
});
