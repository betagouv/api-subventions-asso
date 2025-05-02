import ApplicationFlatCli from "./ApplicationFlat.cli";
import applicationsFlatService from "../../modules/applicationFlat/applicationFlat.service";

jest.mock("../../modules/applicationFlat/applicationFlat.service");

describe("ApplicationFlatCli", () => {
    let cli: ApplicationFlatCli;

    beforeAll(() => {
        cli = new ApplicationFlatCli();
    });

    describe("resyncExercice", () => {
        it("throws if no exercise given", async () => {
            const test = cli.resyncExercice(undefined as unknown as number);
            await expect(test).rejects.toMatchInlineSnapshot(`[Error: Argument 'exercice budgetaire' is required]`);
        });

        it("calls service to update with given exercise", async () => {
            const YEAR = 2023;
            await cli.resyncExercice(YEAR);
            expect(applicationsFlatService.updateApplicationsFlatCollection).toHaveBeenCalledWith(YEAR);
        });
    });

    describe("init", () => {
        it("checks if collection is initialized", async () => {
            await cli.init();
            expect(applicationsFlatService.isCollectionInitialized).toHaveBeenCalled();
        });

        it("throws if db already created", async () => {
            jest.mocked(applicationsFlatService.isCollectionInitialized).mockResolvedValueOnce(true);
            const promise = cli.init();
            await expect(promise).rejects.toMatchInlineSnapshot(
                `[Error: DB already initialized, use resyncExercice instead]`,
            );
        });

        it("calls service to update with no exercise", async () => {
            await cli.init();
            expect(applicationsFlatService.updateApplicationsFlatCollection).toHaveBeenCalledWith();
        });
    });
});
