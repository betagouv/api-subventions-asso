import axios from "axios";
import AuthController from "@components/Auth/Auth.controller";
import authService from "@resources/auth/auth.service";

describe("AuthController", () => {
    describe("initCurrentUserInApp", () => {
        const authServiceMock = jest.spyOn(authService, "getCurrentUser");

        let controller;

        beforeEach(() => {
            controller = new AuthController();
        });

        it("should be call authService", async () => {
            authServiceMock.mockReturnValueOnce({});

            await controller.initCurrentUserInApp();

            expect(authServiceMock).toHaveBeenCalledTimes(1);
        });

        it("should be axios header", async () => {
            const expected = "FAKE_TOKEN";
            authServiceMock.mockReturnValueOnce({ jwt: { token: expected } });

            await controller.initCurrentUserInApp();
            const actual = axios.defaults.headers.common["x-access-token"];

            expect(actual).toBe(expected);
        });
    });
});
