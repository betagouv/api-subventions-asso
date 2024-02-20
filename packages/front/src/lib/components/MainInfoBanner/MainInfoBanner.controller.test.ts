import { MainInfoBannerController } from "./MainInfoBanner.controller";

describe("MainInfoBannerController", () => {
    let controller;

    beforeEach(() => {
        controller = new MainInfoBannerController();
    });
    describe("define props", () => {
        it("should have startTitle", () => {
            const expected = "Certaines informations de votre profil sont manquantes. N’oubliez pas de ";
            const actual = controller.startTitle;
            expect(actual).toEqual(expected);
        });

        it("should have endTitle", () => {
            const expected = ".";
            const actual = controller.endTitle;
            expect(actual).toEqual(expected);
        });

        it("should have linkLabel", () => {
            const expected = "compléter vos informations ici";
            const actual = controller.linkLabel;
            expect(actual).toEqual(expected);
        });

        it("should have linkUrl", () => {
            const expected = "/user/profile";
            const actual = controller.linkUrl;
            expect(actual).toEqual(expected);
        });

        it("should have closeMsg", () => {
            const expected = "Ne plus afficher ce message";
            const actual = controller.closeMsg;
            expect(actual).toEqual(expected);
        });
    });
});
