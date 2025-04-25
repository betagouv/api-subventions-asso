import { Response } from "express";
import * as HttpHelper from "../shared/helpers/HttpHelper";
import StatsAssoVisitMiddleware from "./StatsAssoVisitMiddleware";
import statsSerivce from "../modules/stats/stats.service";
import { IdentifiedRequest } from "../@types";

describe("StatsAssoVisitsMiddleware", () => {
    const addAssociationVisitMock = jest.spyOn(statsSerivce, "addAssociationVisit");
    const isRequestFromAdminMock = jest.spyOn(HttpHelper, "isRequestFromAdmin");

    afterAll(() => {
        addAssociationVisitMock.mockRestore();
    });

    it("should not call addAssociationVisit if request does not have user", async () => {
        const req = {} as IdentifiedRequest;
        await StatsAssoVisitMiddleware(req, {} as Response);
        expect(addAssociationVisitMock).not.toBeCalled();
    });

    it("should not call addAssociationVisit because res status is not 200", async () => {
        const req = {} as IdentifiedRequest;
        await StatsAssoVisitMiddleware(req, { statusCode: 500 } as Response);
        expect(addAssociationVisitMock).not.toBeCalled();
    });

    it("should not call addAssociationVisit because user is admin", async () => {
        const req = {
            user: {
                roles: ["admin"],
            },
        } as IdentifiedRequest;
        isRequestFromAdminMock.mockImplementationOnce(() => true);
        await StatsAssoVisitMiddleware(req, { statusCode: 200 } as Response);
        expect(addAssociationVisitMock).not.toBeCalled();
    });

    it("should not call addAssociationVisit if regex doesn't found", async () => {
        const req = {
            user: {},
            originalUrl: "",
        } as IdentifiedRequest;
        isRequestFromAdminMock.mockImplementationOnce(() => false);
        await StatsAssoVisitMiddleware(req, { statusCode: 200 } as Response);
        expect(addAssociationVisitMock).not.toBeCalled();
    });

    it("should not call addAssociationVisit because regex doesn't find identifier", async () => {
        const req = {
            user: {},
            originalUrl: "/association/TOTO",
        } as IdentifiedRequest;
        isRequestFromAdminMock.mockImplementationOnce(() => false);
        await StatsAssoVisitMiddleware(req, { statusCode: 200 } as Response);
        expect(addAssociationVisitMock).not.toBeCalled();
    });

    it.each`
        identifierType | identifier          | resourceType       | assoIdentifier  | status
        ${"RNA"}       | ${"W123456789"}     | ${"association"}   | ${"W123456789"} | ${200}
        ${"SIREN"}     | ${"123456789"}      | ${"association"}   | ${"123456789"}  | ${200}
        ${"SIRET"}     | ${"12345678912345"} | ${"etablissement"} | ${"123456789"}  | ${200}
        ${"RNA"}       | ${"W123456789"}     | ${"association"}   | ${"W123456789"} | ${201}
    `(
        "should call addAssociationVisit ($identifierType) with status $status",
        async ({ identifier, resourceType, assoIdentifier, status }) => {
            isRequestFromAdminMock.mockImplementationOnce(() => false);
            addAssociationVisitMock.mockImplementationOnce(async () => true);

            const USER_ID = "USER_ID";
            const req = {
                user: {
                    _id: USER_ID,
                },
                originalUrl: `/${resourceType}/${identifier}`,
            } as unknown as IdentifiedRequest;
            await StatsAssoVisitMiddleware(req, { statusCode: status } as Response);

            const expected = {
                userId: USER_ID,
                associationIdentifier: assoIdentifier,
                date: expect.any(Date),
            };

            expect(addAssociationVisitMock).toBeCalledWith(expected);
        },
    );
});
