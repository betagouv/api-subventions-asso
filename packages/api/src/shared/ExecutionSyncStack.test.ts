import ExecutionSyncStack from "./ExecutionSyncStack";

describe("ExecutionSyncStack", () => {
    let stack: ExecutionSyncStack<string, string>;

    beforeAll(() => {
        stack = new ExecutionSyncStack(async entity => entity);
    });

    describe("addOperation", () => {
        let executeOperationsMock: jest.SpyInstance;

        beforeAll(() => {
            // @ts-ignore executeOperations is private method
            executeOperationsMock = jest.spyOn(stack, "executeOperations").mockReturnValue();
        });

        afterAll(() => {
            executeOperationsMock.mockRestore();
            // @ts-ignore stackLines is private attribue
            stack.stackLines.length = 0;
        });

        it("should add in stack array", async () => {
            stack.addOperation("hello");

            // @ts-ignore stackLines is private attribue
            expect(stack.stackLines).toHaveLength(1);
        });

        it("should call executeOperations", () => {
            stack.addOperation("hello");

            expect(executeOperationsMock).toHaveBeenCalledTimes(1);
        });

        it("should multiple call on executeOperations", () => {
            stack.addOperation("hello");
            stack.addOperation("hello");
            stack.addOperation("hello");

            expect(executeOperationsMock).toHaveBeenCalledTimes(3);
        });
    });

    describe("executeOperations", () => {
        let operationExecutorMock: jest.SpyInstance;

        beforeAll(() => {
            // @ts-ignore operationExecutor is private method
            operationExecutorMock = jest.spyOn(stack, "operationExecutor");
        });

        beforeEach(() => {
            // @ts-ignore inProgress is private attribue
            stack.inProgress = false;
            operationExecutorMock.mockClear();
        });

        it("should dont call operationExecutor", async () => {
            // @ts-ignore inProgress is private attribue
            stack.inProgress = true;

            // @ts-ignore executeOperations is private method
            await stack.executeOperations();

            expect(operationExecutorMock).toBeCalledTimes(0);
        });

        it("should call operationExecutor", async () => {
            // @ts-ignore stackLines is private attribut
            stack.stackLines.push({
                entity: "hello",
                rejecter: jest.fn(),
                resolver: jest.fn()
            });
            // @ts-ignore executeOperations is private method
            await stack.executeOperations();

            expect(operationExecutorMock).toBeCalledTimes(1);
        });

        it("should 3 call operationExecutor", async () => {
            // @ts-ignore stackLines is private attribut
            stack.stackLines.push(
                {
                    entity: "hello",
                    rejecter: jest.fn(),
                    resolver: jest.fn()
                },
                {
                    entity: "hello",
                    rejecter: jest.fn(),
                    resolver: jest.fn()
                },
                {
                    entity: "hello",
                    rejecter: jest.fn(),
                    resolver: jest.fn()
                }
            );
            // @ts-ignore executeOperations is private method
            await stack.executeOperations();

            expect(operationExecutorMock).toBeCalledTimes(3);
        });
    });
});
