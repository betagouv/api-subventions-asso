import AnnouncementController from "./Announcement.controller";

describe("AnnouncementController", () => {
    const ANNOUNCEMENT = { id: "A202202272158", jugement: '{"complementJugement": "Judgment has text"}' };

    describe("getter judgment", () => {
        it("should return judgment", () => {
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
        it("should call _splitId()", () => {
            const controller = new AnnouncementController(ANNOUNCEMENT);
            const spySplitId = vi.spyOn(controller, "_splitId");
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            controller.publicationFile;
            expect(spySplitId).toHaveBeenCalledTimes(1);
        });

        it("should return url", () => {
            const controller = new AnnouncementController(ANNOUNCEMENT);
            const actual = controller.publicationFile;
            expect(actual).toMatchSnapshot();
        });
    });
});
