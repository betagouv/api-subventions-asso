import path from "path";
import FonjepCliController from "../../../../../../src/modules/providers/fonjep/interfaces/cli/fonjep.cli.controller";
import db from "../../../../../../src/shared/MongoConnection";

describe("FonjepCliController", () => {
    describe("parse", () => {
        it("should be create entity", async () => {
            const pathToFile = path.resolve(__dirname, "../../__fixtures__/fonjep.xlsx");
            const controller = new FonjepCliController();
            await controller.parse(pathToFile);

            expect(await db.collection("fonjep").count()).toBe(1);
        })
    })
});