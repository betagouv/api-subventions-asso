import ExecutionSyncStack from "./ExecutionSyncStack";

describe("ExecutionSyncStack", () => {
    let stack: ExecutionSyncStack<string, string>;

    beforeAll(() => {
        stack = new ExecutionSyncStack(async entity => entity + "_EXECUTED");
    });

    it("should resolve operation", () => {
        expect(stack.addOperation("toto")).resolves.toBe("toto_EXECUTED");
    });

    it("should resolve many operations", () => {
        const promises = [stack.addOperation("toto"), stack.addOperation("tata"), stack.addOperation("tutu")];
        expect(Promise.all(promises)).resolves.toEqual(["toto_EXECUTED", "tata_EXECUTED", "tutu_EXECUTED"]);
    });
});
