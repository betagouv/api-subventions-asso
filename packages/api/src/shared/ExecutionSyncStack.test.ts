import ExecutionSyncStack from "./ExecutionSyncStack";
import { waitPromise } from "./helpers/WaitHelper";
jest.mock("./helpers/WaitHelper");

describe("ExecutionSyncStack", () => {
    let stack: ExecutionSyncStack<string, string>;

    beforeAll(() => {
        stack = new ExecutionSyncStack(async entity => entity);
    });

    describe("addOperation", () => {
        let executeOperationsMock: jest.SpyInstance;

        beforeAll(() => {
            // @ts-expect-error executeOperations is private method
            executeOperationsMock = jest.spyOn(stack, "executeOperations").mockReturnValue();
        });

        afterAll(() => {
            executeOperationsMock.mockRestore();
            // @ts-expect-error stackLines is private attribue
            stack.stackLines.length = 0;
        });

        it("should add in stack array", async () => {
            stack.addOperation("hello");

            // @ts-expect-error stackLines is private attribue
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
            // @ts-expect-error operationExecutor is private method
            operationExecutorMock = jest.spyOn(stack, "operationExecutor");
        });

        beforeEach(() => {
            // @ts-expect-error inProgress is private attribue
            stack.inProgress = false;
        });

        it("should not call operationExecutor", async () => {
            // @ts-expect-error inProgress is private attribue
            stack.inProgress = true;

            // @ts-expect-error executeOperations is private method
            await stack.executeOperations();

            expect(operationExecutorMock).toBeCalledTimes(0);
        });

        it("should call operationExecutor", async () => {
            // @ts-expect-error stackLines is private attribut
            stack.stackLines.push({
                entity: "hello",
                rejecter: jest.fn(),
                resolver: jest.fn(),
            });
            // @ts-expect-error executeOperations is private method
            await stack.executeOperations();

            expect(operationExecutorMock).toBeCalledTimes(1);
        });

        it("should 3 call operationExecutor", async () => {
            // @ts-expect-error stackLines is private attribut
            stack.stackLines.push(
                {
                    entity: "hello",
                    rejecter: jest.fn(),
                    resolver: jest.fn(),
                },
                {
                    entity: "hello",
                    rejecter: jest.fn(),
                    resolver: jest.fn(),
                },
                {
                    entity: "hello",
                    rejecter: jest.fn(),
                    resolver: jest.fn(),
                },
            );
            // @ts-expect-error executeOperations is private method
            await stack.executeOperations();

            expect(operationExecutorMock).toBeCalledTimes(3);
        });

        it("should check if all promise as been resolved", async () => {
            const resolver = jest.fn();
            // @ts-expect-error stackLines is private attribute
            stack.stackLines.push(
                {
                    entity: "hello",
                    rejecter: jest.fn(),
                    resolver,
                },
                {
                    entity: "hello",
                    rejecter: jest.fn(),
                    resolver,
                },
                {
                    entity: "hello",
                    rejecter: jest.fn(),
                    resolver,
                },
            );
            // @ts-expect-error executeOperations is private method
            await stack.executeOperations();

            expect(resolver).toBeCalledTimes(3);
        });

        it("waits between each task", async () => {
            const TIME = 10;
            const timedStack = new ExecutionSyncStack(async entity => entity, TIME);
            // @ts-expect-error stackLines is private attribute
            timedStack.stackLines.push(
                {
                    entity: "hello",
                    rejecter: jest.fn(),
                    resolver: jest.fn(),
                },
                {
                    entity: "hello",
                    rejecter: jest.fn(),
                    resolver: jest.fn(),
                },
                {
                    entity: "hello",
                    rejecter: jest.fn(),
                    resolver: jest.fn(),
                },
            );
            // @ts-expect-error executeOperations is private method
            await timedStack.executeOperations();

            expect(waitPromise).toHaveBeenCalledTimes(3);
            expect(waitPromise).toHaveBeenLastCalledWith(10);
        });
    });
});
