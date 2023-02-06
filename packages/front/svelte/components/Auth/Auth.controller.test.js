import axios from "axios";
import AuthController from "@components/Auth/Auth.controller";
import authService from "@resources/auth/auth.service";

describe("AuthController", () => {
    describe("init", () => {
        const authServiceMock = jest.spyOn(authService, "initUserInApp");

        let controller;

        beforeEach(() => {
            controller = new AuthController();
        });

        it("should be call authService", async () => {
            authServiceMock.mockReturnValueOnce({});

            await controller.init();

            expect(authServiceMock).toHaveBeenCalledTimes(1);
        });
    });
});
