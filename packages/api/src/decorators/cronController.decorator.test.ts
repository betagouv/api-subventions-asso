import axios from "axios";

jest.mock("toad-scheduler", () => {
    return {
        AsyncTask: jest.fn(),
        CronJob: jest.fn(),
        LongIntervalJob: jest.fn(),
        SimpleIntervalJob: jest.fn().mockImplementation(() => {}),
        Task: jest.fn().mockImplementation(() => {}),
    };
});
jest.mock("../modules/notify/notify.service", () => ({ notify: jest.fn() }));

import { AsyncTask, CronJob, LongIntervalJob, SimpleIntervalJob, Task } from "toad-scheduler";
import * as Decorators from "./cronController.decorator";
import notifyService from "../modules/notify/notify.service";
import { NotificationType } from "../modules/notify/@types/NotificationType";
// about mocking the module : https://github.com/facebook/jest/issues/936#issuecomment-545080082 use arrow functions

describe("cronController decorator", () => {
    const SCHEDULE = {};
    let axiosPostSpy;

    beforeAll(() => (axiosPostSpy = jest.spyOn(axios, "post").mockResolvedValue(undefined)));
    afterAll(() => axiosPostSpy.mockRestore());

    describe("newJob()", () => {
        const TASK = {};
        const JOB_CLASS = SimpleIntervalJob;
        const TASK_CLASS = Task;
        const ATTRIBUTE_TO_FILL = "__intervalJobs__";
        const CLASS_NAME = "ClassName";
        const ERROR_HANDLER_RESULT = "error handled";
        let errorHandlerFactorySpy;

        const TASK_NAME = "ClassName.actionToRepeat";

        beforeAll(
            () =>
                (errorHandlerFactorySpy = jest.spyOn(Decorators, "errorHandlerFactory").mockReturnValue(
                    // @ts-expect-error mock
                    ERROR_HANDLER_RESULT,
                )),
        );
        afterAll(() => errorHandlerFactorySpy.mockRestore());

        function testResult(schedule, JobClass, TaskClass, target: object = { constructor: { name: CLASS_NAME } }) {
            const PROPERTY_KEY = "actionToRepeat";
            const DESCRIPTOR = {
                value: () => {},
            };
            const decoratedFunction = Decorators.newJob(schedule, JobClass, TaskClass);
            decoratedFunction(target, PROPERTY_KEY, DESCRIPTOR);
            return target;
        }

        it.each`
            attributeNameToPopulate | JobClass
            ${"__cronJobs__"}       | ${CronJob}
            ${"__intervalJobs__"}   | ${LongIntervalJob}
            ${"__intervalJobs__"}   | ${SimpleIntervalJob}
        `("populates proper attribute name '$attributeNameToPopulate'", ({ JobClass, attributeNameToPopulate }) => {
            const actual = testResult(SCHEDULE, JobClass, TASK_CLASS)[attributeNameToPopulate]?.length;
            expect(actual).toBe(1);
        });

        it("adds job in existing array", () => {
            const actual = testResult(SCHEDULE, JOB_CLASS, TASK_CLASS, {
                [ATTRIBUTE_TO_FILL]: ["something"],
            })[ATTRIBUTE_TO_FILL]?.length;
            expect(actual).toBe(2);
        });

        it("job constructor is called with proper schedule", () => {
            testResult(SCHEDULE, JOB_CLASS, TASK_CLASS);
            expect(JOB_CLASS.prototype.constructor).toBeCalledWith(SCHEDULE, TASK, { preventOverrun: true });
        });

        it("task is constructed with proper task name", () => {
            testResult(SCHEDULE, JOB_CLASS, TASK_CLASS);
            expect(TASK_CLASS.prototype.constructor).toBeCalledWith(TASK_NAME, expect.anything(), ERROR_HANDLER_RESULT);
        });

        it("errorHandlerFactory is called with task name", () => {
            testResult(SCHEDULE, JOB_CLASS, TASK_CLASS);
            expect(errorHandlerFactorySpy).toBeCalledWith(TASK_NAME);
        });
    });

    describe("errorHandlerFactory's result", () => {
        const CRON_NAME = "name";
        const errorHandler = Decorators.errorHandlerFactory(CRON_NAME);
        const ERROR = new Error();

        it("logs error with proper cron name", () => {
            const expected = "error during cron name";
            const consoleErrorSpy = jest.spyOn(global.console, "error");
            errorHandler(ERROR);
            expect(consoleErrorSpy).toHaveBeenCalledWith(expected);
        });

        it("notifies error", () => {
            errorHandler(ERROR);
            expect(notifyService.notify).toHaveBeenCalledWith(NotificationType.FAILED_CRON, {
                cronName: CRON_NAME,
                error: ERROR,
            });
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
            decorator               | type        | TaskClass
            ${Decorators.AsyncCron} | ${" async"} | ${AsyncTask}
            ${Decorators.Cron}      | ${""}       | ${Task}
        `("cron-type$type schedule calls newJob() with proper args", ({ decorator, TaskClass }) => {
            decorator(SCHEDULE);
            expect(newJobSpy).toBeCalledWith(SCHEDULE, CronJob, TaskClass);
        });

        describe("interval-type schedule", () => {
            it.each`
                decorator                       | isIntervalLong | type        | JobClass             | TaskClass
                ${Decorators.AsyncIntervalCron} | ${true}        | ${" async"} | ${LongIntervalJob}   | ${AsyncTask}
                ${Decorators.IntervalCron}      | ${true}        | ${""}       | ${LongIntervalJob}   | ${Task}
                ${Decorators.AsyncIntervalCron} | ${false}       | ${" async"} | ${SimpleIntervalJob} | ${AsyncTask}
                ${Decorators.IntervalCron}      | ${false}       | ${""}       | ${SimpleIntervalJob} | ${Task}
            `(
                "cron-type$type schedule calls newJob() with proper args",
                ({ decorator, TaskClass, isIntervalLong, JobClass }) => {
                    decorator(SCHEDULE, isIntervalLong);
                    const expectedSchedule = { runImmediately: true };
                    expect(newJobSpy).toBeCalledWith(expectedSchedule, JobClass, TaskClass);
                },
            );

            it.each`
                decorator                       | TaskClass
                ${Decorators.AsyncIntervalCron} | ${AsyncTask}
                ${Decorators.IntervalCron}      | ${Task}
            `("overrides runImmediately", ({ decorator, TaskClass }) => {
                const tweakedSchedule = { runImmediately: false };
                decorator(tweakedSchedule, false);
                expect(newJobSpy).toBeCalledWith(tweakedSchedule, SimpleIntervalJob, TaskClass);
            });
        });
    });
});
