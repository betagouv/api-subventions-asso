import { API_SENDINBLUE_CONTACT_LIST } from "../../../configurations/apis.conf";
import { NotificationType } from "../@types/NotificationType";
import BrevoContactNotifyPipe from "./BrevoContactNotifyPipe";

describe("BrevoContactNotifyPipe", () => {
    describe("notify", () => {
        let userCreatedSpy: jest.SpyInstance;

        beforeAll(() => {
            // @ts-expect-error userCreated is private methode
            userCreatedSpy = jest.spyOn(BrevoContactNotifyPipe, "userCreated").mockResolvedValue(true);
        });

        afterAll(() => {
            userCreatedSpy.mockRestore();
        });

        it("should call userCreated", () => {
            BrevoContactNotifyPipe.notify(NotificationType.USER_CREATED, {});

            expect(userCreatedSpy).toBeCalled();
        });

        it("should not call userCreated", () => {
            BrevoContactNotifyPipe.notify(NotificationType.TEST_EMAIL, {});

            expect(userCreatedSpy).not.toBeCalled();
        });
    });

    describe("userCreated", () => {
        let createContactSpy: jest.SpyInstance;

        beforeAll(() => {
            createContactSpy = jest
                // @ts-expect-error apiInstance is private attribute
                .spyOn(BrevoContactNotifyPipe.apiInstance, "createContact")
                .mockResolvedValue({ body: { id: 1 } } as any);
        });

        afterAll(() => {
            createContactSpy.mockRestore();
        });

        it("should call create data", async () => {
            const expected = {
                email: "UserEmail",
                attributes: {
                    DATE_INSCRIPTION: new Date(),
                    COMPTE_ACTIVE: true,
                    SOURCE_IMPORT: "Data.Subvention",
                    LIEN_ACTIVATION: "TOKEN",
                },
                listIds: [Number(API_SENDINBLUE_CONTACT_LIST)],
            };

            // @ts-expect-error userCreated is private method
            await BrevoContactNotifyPipe.userCreated({
                email: expected.email,
                signupAt: expected.attributes.DATE_INSCRIPTION,
                active: expected.attributes.COMPTE_ACTIVE,
                token: expected.attributes.LIEN_ACTIVATION,
            });

            expect(createContactSpy).toHaveBeenCalledWith(expected);
        });
    });
});
