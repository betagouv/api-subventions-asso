import { MainInfoBannerDto } from "dto";
import configurationsService from "../../modules/configurations/configurations.service";
import { ConfigurationsHttp } from "./Configurations.http";

describe("ConfigurationsHttp", () => {
    let controller;
    beforeEach(() => {
        controller = new ConfigurationsHttp();
    });
    describe("addDomain()", () => {
        const BODY = { domain: "rhone.fr" };
        const addEmailDomainMock = jest.spyOn(configurationsService, "addEmailDomain");
        it("should return response", async () => {
            addEmailDomainMock.mockImplementationOnce(async domain => domain);
            const expected = { domain: BODY.domain };
            const actual = await controller.addDomain(BODY);
            expect(actual).toEqual(expected);
        });
    });

    describe("getMainInfoBanner", () => {
        const getMainInfoBannerSpy = jest.spyOn(configurationsService, "getMainInfoBanner");
        it("should call service without args", async () => {
            getMainInfoBannerSpy.mockImplementationOnce(jest.fn());
            await controller.getMainInfoBanner();
            expect(getMainInfoBannerSpy).toHaveBeenCalled();
        });

        it("should return banner infos", async () => {
            getMainInfoBannerSpy.mockImplementationOnce(async () => expected);
            const expected = {};
            const actual = await controller.getMainInfoBanner();
            expect(actual).toEqual(expected);
        });
    });

    describe("updateMainInfoBanner", () => {
        const updateMainInfoBannerSpy = jest.spyOn(configurationsService, "updateMainInfoBanner");
        const newBannerInfo = { title: "title", desc: "desc" };
        it("should return response", async () => {
            updateMainInfoBannerSpy.mockImplementationOnce(async newBannerInfo => expected);
            const expected = {};
            const actual = await controller.updateMainInfoBanner(newBannerInfo.title, newBannerInfo.desc);
            expect(actual).toEqual(expected);
        });
    });
});
