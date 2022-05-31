import CliLogger from "./CliLogger";

describe("CliLogger", () => {
    let logger: CliLogger;

    beforeEach(() => {
        logger = new CliLogger();
    })

    describe("log", () => {
        it("should save in logStack", () => {
            const expected = 2;
            logger.log('A', 'B');
            
            // @ts-expect-error logStack is private attribute
            const actual = logger.logStack.length;

            expect(actual).toBe(expected);
        })
    });

    describe("logIC", () => {
        it("should save in logStack", () => {
            const expected = 2;
            jest.spyOn(console, "info").mockImplementationOnce(() => {});
            logger.logIC('A', 'B');
            
            // @ts-expect-error logStack is private attribute
            const actual = logger.logStack.length;

            expect(actual).toBe(expected);
        })

        it("should show in console", () => {
            const expected = ['A', 'B'];
            const logMock = jest.spyOn(console, "info").mockImplementationOnce(() => {});

            logger.logIC(...expected);
            
            expect(logMock).toBeCalledWith(...expected);
        })
    });

    describe("getLogs", () => {
        it("should return log in logStack", () => {
            const expected = 'A B';
            // @ts-expect-error logStack is private attribute
            logger.logStack = expected.split(" ");
            
            const actual = logger.getLogs();

            expect(actual).toEqual(expected);
        })
    });
})
