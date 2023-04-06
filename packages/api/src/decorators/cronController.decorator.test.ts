import axios from "axios";

jest.mock("toad-scheduler", () => {
    return {
        AsyncTask: jest.fn(),
        CronJob: jest.fn(),
        LongIntervalJob: jest.fn(),
        SimpleIntervalJob: jest.fn().mockImplementation(() => {}),
        Task: jest.fn().mockImplementation(() => {})
    };
});

import { AsyncTask, CronJob, LongIntervalJob, SimpleIntervalJob, Task } from "toad-scheduler";
import * as Decorators from "./cronController.decorator";
// about mocking the module : https://github.com/facebook/jest/issues/936#issuecomment-545080082 use arrow functions

describe("cronController decorator", () => {
    const SCHEDULE = {};
    let axiosPostSpy;

    beforeAll(() => (axiosPostSpy = jest.spyOn(axios, "post").mockResolvedValue(undefined)));
    afterAll(() => axiosPostSpy.mockRestore());

    describe("newJob()", () => {
        const JOB = {};
        const TASK = {};
        const JOB_CONSTRUCTOR = SimpleIntervalJob;
        const TASK_CONSTRUCTOR = Task;
        const ATTRIBUTE_TO_FILL = "__intervalJobs__";
        const CLASS_NAME = "ClassName";
        const ERROR_HANDLER_RESULT = "error handled";
        let errorHandlerSpy;

        const TASK_NAME = "ClassName.actionToRepeat";

        beforeAll(
            () =>
                (errorHandlerSpy = jest.spyOn(Decorators, "errorHandler").mockReturnValue(
                    // @ts-expect-error mock
                    ERROR_HANDLER_RESULT
                ))
        );
        afterAll(() => errorHandlerSpy.mockRestore());

        function testResult(
            schedule,
            jobConstructor,
            taskConstructor,
            target: any = { constructor: { name: CLASS_NAME } }
        ) {
            const PROPERTY_KEY = "actionToRepeat";
            const DESCRIPTOR = {
                value: () => {}
            };
            const decoratedFunction = Decorators.newJob(schedule, jobConstructor, taskConstructor);
            decoratedFunction(target, PROPERTY_KEY, DESCRIPTOR);
            return target;
        }

        it.each`
            attributeNameToPopulate | jobConstructor
            ${"__cronJobs__"}       | ${CronJob}
            ${"__intervalJobs__"}   | ${LongIntervalJob}
            ${"__intervalJobs__"}   | ${SimpleIntervalJob}
        `(
            "populates proper attribute name '$attributeNameToPopulate'",
            ({ jobConstructor, attributeNameToPopulate }) => {
                const actual = testResult(SCHEDULE, jobConstructor, TASK_CONSTRUCTOR)[attributeNameToPopulate]?.length;
                expect(actual).toBe(1);
            }
        );

        it("adds job in existing array", () => {
            const actual = testResult(SCHEDULE, JOB_CONSTRUCTOR, TASK_CONSTRUCTOR, {
                [ATTRIBUTE_TO_FILL]: ["something"]
            })[ATTRIBUTE_TO_FILL]?.length;
            expect(actual).toBe(2);
        });

        it("job constructor is called with proper schedule", () => {
            testResult(SCHEDULE, JOB_CONSTRUCTOR, TASK_CONSTRUCTOR);
            expect(JOB_CONSTRUCTOR.prototype.constructor).toBeCalledWith(SCHEDULE, TASK, { preventOverrun: true });
        });

        it("task is constructed with proper task name", () => {
            const expectedTaskName = "ClassName.actionToRepeat";
            testResult(SCHEDULE, JOB_CONSTRUCTOR, TASK_CONSTRUCTOR);
            expect(TASK_CONSTRUCTOR.prototype.constructor).toBeCalledWith(
                TASK_NAME,
                expect.anything(),
                ERROR_HANDLER_RESULT
            );
        });

        it("errorHandler is called with task name", () => {
            testResult(SCHEDULE, JOB_CONSTRUCTOR, TASK_CONSTRUCTOR);
            expect(errorHandlerSpy).toBeCalledWith(TASK_NAME);
        });
    });

    describe("errorHandler", () => {
        const CRON_NAME = "name";
        const errorHandler = Decorators.errorHandler(CRON_NAME);

        it("logs error with proper cron name", () => {
            const expected = "error during cron name";
            const consoleErrorSpy = jest.spyOn(global.console, "error");
            errorHandler(CRON_NAME);
            expect(consoleErrorSpy).toHaveBeenCalledWith(expected);
        });

        it("posts error to mattermost", () => {
            errorHandler({});
            expect(axiosPostSpy).toHaveBeenCalled();
        });
    });

    describe("decorators", () => {
        let newJobSpy;

        beforeAll(() => {
            newJobSpy = jest.spyOn(Decorators, "newJob");
        });
        afterAll(() => {
            newJobSpy.mockRestore();
        });

        it.each`
            decorator               | type        | taskConstructor
            ${Decorators.AsyncCron} | ${" async"} | ${AsyncTask}
            ${Decorators.Cron}      | ${""}       | ${Task}
        `("cron-type$type schedule calls newJob() with proper args", ({ decorator, taskConstructor }) => {
            decorator(SCHEDULE);
            expect(newJobSpy).toBeCalledWith(SCHEDULE, CronJob, taskConstructor);
        });

        describe("interval-type schedule", () => {
            it.each`
                decorator                       | isIntervalLong | type        | jobConstructor       | taskConstructor
                ${Decorators.AsyncIntervalCron} | ${true}        | ${" async"} | ${LongIntervalJob}   | ${AsyncTask}
                ${Decorators.IntervalCron}      | ${true}        | ${""}       | ${LongIntervalJob}   | ${Task}
                ${Decorators.AsyncIntervalCron} | ${false}       | ${" async"} | ${SimpleIntervalJob} | ${AsyncTask}
                ${Decorators.IntervalCron}      | ${false}       | ${""}       | ${SimpleIntervalJob} | ${Task}
            `(
                "cron-type$type schedule calls newJob() with proper args",
                ({ decorator, taskConstructor, isIntervalLong, jobConstructor }) => {
                    decorator(SCHEDULE, isIntervalLong);
                    const expectedSchedule = { runImmediately: true };
                    expect(newJobSpy).toBeCalledWith(expectedSchedule, jobConstructor, taskConstructor);
                }
            );

            it.each`
                decorator                       | taskConstructor
                ${Decorators.AsyncIntervalCron} | ${AsyncTask}
                ${Decorators.IntervalCron}      | ${Task}
            `("overrides runImmediately", ({ decorator, taskConstructor }) => {
                const tweakedSchedule = { runImmediately: false };
                decorator(tweakedSchedule, false);
                expect(newJobSpy).toBeCalledWith(tweakedSchedule, SimpleIntervalJob, taskConstructor);
            });
        });
    });
});
