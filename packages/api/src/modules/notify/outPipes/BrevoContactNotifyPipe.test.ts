import {
    AdminTerritorialLevel,
    AgentJobTypeEnum,
    AgentTypeEnum,
    TerritorialScopeEnum,
    RegistrationSrcTypeEnum,
} from "dto";
import { API_BREVO_CONTACT_LIST } from "../../../configurations/apis.conf";
import { NotificationType } from "../@types/NotificationType";
import BrevoContactNotifyPipe, {
    BrevoContactNotifyPipe as BrevoContactNotifyPipeClass,
} from "./BrevoContactNotifyPipe";
import * as Brevo from "@getbrevo/brevo";
jest.mock("@getbrevo/brevo");

describe("BrevoContactNotifyPipe", () => {
    const USER_EMAIL = "user@beta.gouv.fr";

    const mockeRequestContactImport = jest.spyOn(Brevo, "RequestContactImport");
    // @ts-expect-error apiInstance is private attribute
    const mockUpdateContact = jest.spyOn(BrevoContactNotifyPipe.apiInstance, "updateContact");
    // @ts-expect-error apiInstance is private attribute
    const mockDeleteContact = jest.spyOn(BrevoContactNotifyPipe.apiInstance, "deleteContact");
    // @ts-expect-error apiInstance is private attribute
    const mockImportContacts = jest.spyOn(BrevoContactNotifyPipe.apiInstance, "importContacts");

    beforeAll(() => {
        mockUpdateContact.mockResolvedValue({ body: { id: 1 } } as any);
        mockDeleteContact.mockResolvedValue({ body: { id: 1 } } as any);
        mockImportContacts.mockResolvedValue({ body: { id: 1 } } as any);
        mockeRequestContactImport.mockImplementation(() => ({}));
    });

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
                email: USER_EMAIL,
                attributes: {
                    DATE_INSCRIPTION: new Date(),
                    COMPTE_ACTIVE: true,
                    SOURCE_IMPORT: "Data.Subvention",
                    LIEN_ACTIVATION: "TOKEN",
                },
                listIds: [Number(API_BREVO_CONTACT_LIST)],
            };

            // @ts-expect-error userCreated is private method
            await BrevoContactNotifyPipe.userCreated({
                email: expected.email,
                signupAt: expected.attributes.DATE_INSCRIPTION,
                active: expected.attributes.COMPTE_ACTIVE,
                url: expected.attributes.LIEN_ACTIVATION,
            });

            expect(createContactSpy).toHaveBeenCalledWith(expected);
        });
    });

    describe("userActivated", () => {
        it("call updateContact()", async () => {
            // @ts-expect-error userCreated is private method
            await BrevoContactNotifyPipe.userActivated({ email: USER_EMAIL });
            expect(mockUpdateContact).toHaveBeenCalledWith(USER_EMAIL, {
                attributes: { COMPTE_ACTIVE: true, LIEN_ACTIVATION: "" },
                listIds: [Number(API_BREVO_CONTACT_LIST)],
            });
        });
    });

    describe("userLogged", () => {
        it("should call updateContact()", async () => {
            const email = "UserEmail";
            const now = new Date();

            // @ts-expect-error userLogged is private method
            await BrevoContactNotifyPipe.userLogged({ email, date: now });

            expect(mockUpdateContact).toHaveBeenCalledWith(email, {
                attributes: { DERNIERE_CONNEXION: now },
                listIds: [Number(API_BREVO_CONTACT_LIST)],
            });
        });
    });

    describe("userUpdated", () => {
        const UPDATE_PAYLOAD = {
            agentType: AgentTypeEnum.TERRITORIAL_COLLECTIVITY,
            service: "SERVICE",
            phoneNumber: "+33625859685",
            jobType: [AgentJobTypeEnum.ADMINISTRATOR, AgentJobTypeEnum.EXPERT],
            centralStructure: "ADMIN_CENTRALE",
            decentralizedLevel: AdminTerritorialLevel.INTERDEPARTMENTAL,
            decentralizedTerritory: "ECHELON_TERRITORIAL",
            decentralizedStructure: "SERVICE_DECONCENTRE",
            operatorStructure: "OPERATEUR",
            territorialStructure: "COLLECTIVITES",
            territorialScope: TerritorialScopeEnum.DEPARTMENTAL,
            lastName: "NOM",
            firstName: "PRENOM",
            lastActivityDate: new Date("2023-04-06"),
            registrationSrc: [
                RegistrationSrcTypeEnum.DEMO,
                RegistrationSrcTypeEnum.COLLEAGUES_HIERARCHY,
                RegistrationSrcTypeEnum.OTHER,
            ],
            registrationSrcEmail: "test@mail.com",
            registrationSrcDetails: "Autre raison",
        };

        it("should call updateContact()", async () => {
            //@ts-expect-error: private method
            await BrevoContactNotifyPipe.userUpdated({ email: "test@datasubvention.gouv.fr", ...UPDATE_PAYLOAD });
            expect(mockUpdateContact.mock.calls[0]).toMatchSnapshot();
        });
    });

    describe("userDeleted", () => {
        const UPDATE_PAYLOAD = { email: "test@datasubvention.gouv.fr" };

        it("should call deleteContact()", async () => {
            //@ts-expect-error: private method
            await BrevoContactNotifyPipe.userDeleted(UPDATE_PAYLOAD);
            expect(mockDeleteContact.mock.calls[0]).toMatchSnapshot();
        });
    });

    describe("batchUsersDeleted", () => {
        const UPDATE_PAYLOAD = {
            users: [
                {
                    email: "test@datasubvention.gouv.fr",
                },
                {
                    email: "test2@datasubvention.gouv.fr",
                },
            ],
        };

        it("should call deleteContact() for each user", async () => {
            //@ts-expect-error: private method
            await BrevoContactNotifyPipe.batchUsersDeleted(UPDATE_PAYLOAD);
            expect(mockDeleteContact.mock.calls).toMatchSnapshot();
        });
    });

    describe("updateNbRequests", () => {
        it("should create a Brevo RequestContactImport", () => {
            // @ts-expect-error: test private method
            BrevoContactNotifyPipe.updateNbRequests([]);
            expect(jest.mocked(Brevo.RequestContactImport)).toHaveBeenCalledTimes(1);
        });

        it("should call importContacts", () => {
            const data = [
                { email: "john.doe@gouv.fr", nbVisits: 13 },
                { email: "arsene.lupin@gouv.fr", nbVisits: "45" },
            ];
            // @ts-expect-error: test private method
            BrevoContactNotifyPipe.updateNbRequests(data);
            const expected = data.map(d => ({ email: d.email, attributes: { NB_REQUETES: d.nbVisits } }));
            expect(mockImportContacts).toHaveBeenCalledWith({ jsonBody: expected, listIds: [1] });
        });
    });
});
