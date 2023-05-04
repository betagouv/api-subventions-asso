import AnnouncementController from "./Announcement.controller";

describe("AnnouncementController", () => {
    const ANNOUNCEMENT = { id: "A202202272158", jugement: '{"foo": "bar"}' };

    describe("getter judgment", () => {
        it("should parse judgment in JSON", () => {
            const controller = new AnnouncementController(ANNOUNCEMENT);
            const actual = controller.judgment;
            expect(actual).toMatchSnapshot();
        });
    });

    describe("getter url", () => {
        it("should return url", () => {
            const controller = new AnnouncementController(ANNOUNCEMENT);
            const actual = controller.url;
            expect(actual).toMatchSnapshot();
        });
    });

    describe("getter publication", () => {
        it("should return url", () => {
            const controller = new AnnouncementController(ANNOUNCEMENT);
            const actual = controller.publication;
            expect(actual).toMatchSnapshot();
        });
    });
});
