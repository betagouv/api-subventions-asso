import configurationsService from "../../modules/configurations/configurations.service";
import { ConfigurationsHttp } from "./Configurations.http";

jest.mock("../../modules/configurations/configurations.service");

describe("ConfigurationsHttp", () => {
    let controller;
    beforeEach(() => {
        controller = new ConfigurationsHttp();
    });
    describe("addDomain()", () => {
        const BODY = { domain: "rhone.fr" };
        it("should return response", async () => {
            jest.mocked(configurationsService.addEmailDomain).mockImplementationOnce(async domain => domain);
            const expected = { domain: BODY.domain };
            const actual = await controller.addDomain(BODY);
            expect(actual).toEqual(expected);
        });
    });

    describe("getMainInfoBanner", () => {
        it("should call service without args", async () => {
            jest.mocked(configurationsService.getMainInfoBanner).mockImplementationOnce(jest.fn());
            await controller.getMainInfoBanner();
            expect(configurationsService.getMainInfoBanner).toHaveBeenCalled();
        });

        it("should return banner infos", async () => {
            const expected = {};
            jest.mocked(configurationsService.getMainInfoBanner).mockResolvedValueOnce(expected);
            const actual = await controller.getMainInfoBanner();
            expect(actual).toEqual(expected);
        });
    });

    describe("updateMainInfoBanner", () => {
        const newBannerInfo = { title: "title", desc: "desc" };
        it("should return response", async () => {
            const expected = {};
            jest.mocked(configurationsService.updateMainInfoBanner).mockResolvedValueOnce(expected);
            const actual = await controller.updateMainInfoBanner(newBannerInfo.title, newBannerInfo.desc);
            expect(actual).toEqual(expected);
        });
    });
});
