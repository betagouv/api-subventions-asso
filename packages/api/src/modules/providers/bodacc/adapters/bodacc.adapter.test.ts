import { BodaccDto } from "../dto/BodaccDto";
import BodaccAdapter from "./bodacc.adapter";

describe("Bodacc Adapter", () => {
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
