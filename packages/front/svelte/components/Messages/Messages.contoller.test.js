import MessagesController from "./Messages.controller";

describe("MessagesController", () => {
    describe("_isVisibleMessage", () => {
        it("return true", () => {
            const expected = true;
            const controller = new MessagesController();
            const message = {
                startDate: new Date(),
                endDate: new Date(2999, 1)
            };

            const actual = controller._isVisibleMessage(message);
            expect(actual).toBe(expected);
        });

        it("return false, start date > now", () => {
            const expected = false;
            const controller = new MessagesController();
            const message = {
                startDate: new Date(2988, 1),
                endDate: new Date(2999, 1)
            };

            const actual = controller._isVisibleMessage(message);
            expect(actual).toBe(expected);
        });

        it("return false, end date < now", () => {
            const expected = false;
            const controller = new MessagesController();
            const message = {
                startDate: new Date(2000, 1),
                endDate: new Date(2001, 1)
            };

            const actual = controller._isVisibleMessage(message);
            expect(actual).toBe(expected);
        });
    });
});
