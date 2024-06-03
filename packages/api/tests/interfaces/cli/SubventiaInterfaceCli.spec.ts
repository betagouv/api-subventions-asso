import path from "node:path";
import SubventiaCli from "../../../src/interfaces/cli/Subventia.cli";
import subventiaRepository from "../../../src/modules/providers/subventia/repositories/subventia.repository";
import { ObjectId } from "mongodb";

describe("Subventia Cli", () => {
    let cli: SubventiaCli;

    beforeAll(() => {
        cli = new SubventiaCli();
    });

    describe("_parse()", () => {
        it("should add entities", async () => {
            // @ts-expect-error protected method
            await cli._parse(
                path.resolve(__dirname, "../../../src/modules/providers/subventia/__fixtures__/SUBVENTIA.xlsx"),
            );
            const entities = await subventiaRepository.findAll();
            console.log(typeof entities[0]._id);
            const expectedAny = entities.map(_entity => ({
                _id: expect.any(ObjectId),
            }));

            expect(entities).toMatchSnapshot(expectedAny);
        });
    });
});
