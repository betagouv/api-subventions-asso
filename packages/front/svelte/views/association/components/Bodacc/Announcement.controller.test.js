import AnnouncementController from "./Announcement.controller";

describe("AnnouncementController", () => {
    const ANNOUNCEMENT = { id: "A202202272158", jugement: '{"complementJugement": "Judgment has text"}' };

    describe("getter judgment", () => {
        it("should return judgment", () => {
            const controller = new AnnouncementController(ANNOUNCEMENT);
            const actual = controller.judgment;
            console.log(actual);
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
