import { ObjectId } from "mongodb";
import StateBudgetProgramAdapter from "./stateBudgetProgram.adapter";
import { DataBretagneProgrammeDto } from "../../api/dataBretagne/DataBretagneDto";

describe("StateBudgetProgram Adapter", () => {
    const PROGRAM: DataBretagneProgrammeDto = {
        label_theme: "Justice",
        label: "Accès au droit et à la justice",
        code_ministere: "MIN10",
        code: "101",
    };

    describe("toDbo()", () => {
        it("should return StateBudgetProgramDbo", () => {
            const actual = StateBudgetProgramAdapter.toDbo(PROGRAM);
            expect(actual).toMatchSnapshot({ _id: expect.any(ObjectId) });
        });
    });
});
