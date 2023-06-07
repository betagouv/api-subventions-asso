import { Response, Request } from "express";
import rnaSirenService from "../modules/_open-data/rna-siren/rnaSiren.service";
import { siretToSiren } from "../shared/helpers/SirenHelper";
import * as HttpHelper from "../shared/helpers/HttpHelper";
import * as SirenHelper from "../shared/helpers/SirenHelper";
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

    it("should call addAssociationVisit (RNA)", async () => {
        isRequestFromAdminMock.mockImplementationOnce(() => false);
        addAssociationVisitMock.mockImplementationOnce(async () => true);

        const RNA = "W123456789";
        const USER_ID = "USER_ID";
        const req = {
            user: {
                _id: USER_ID,
            },
            originalUrl: `/association/${RNA}`,
        } as unknown as IdentifiedRequest;
        await StatsAssoVisitMiddleware(req, { statusCode: 200 } as Response);

        const expected = {
            userId: USER_ID,
            associationIdentifier: RNA,
            date: expect.any(Date),
        };

        expect(addAssociationVisitMock).toBeCalledWith(expected);
    });

    it("should call addAssociationVisit (SIREN)", async () => {
        isRequestFromAdminMock.mockImplementationOnce(() => false);
        addAssociationVisitMock.mockImplementationOnce(async () => true);

        const SIREN = "123456789";
        const USER_ID = "USER_ID";
        const req = {
            user: {
                _id: USER_ID,
            },
            originalUrl: `/association/${SIREN}`,
        } as unknown as IdentifiedRequest;
        await StatsAssoVisitMiddleware(req, { statusCode: 200 } as Response);

        const expected = {
            userId: USER_ID,
            associationIdentifier: SIREN,
            date: expect.any(Date),
        };

        expect(addAssociationVisitMock).toBeCalledWith(expected);
    });

    it("should call addAssociationVisit (SIRET)", async () => {
        isRequestFromAdminMock.mockImplementationOnce(() => false);
        addAssociationVisitMock.mockImplementationOnce(async () => true);

        const SIREN = "123456789";
        const SIRET = SIREN + "12345";
        const USER_ID = "USER_ID";
        const req = {
            user: {
                _id: USER_ID,
            },
            originalUrl: `/etablissement/${SIRET}`,
        } as unknown as IdentifiedRequest;
        await StatsAssoVisitMiddleware(req, { statusCode: 200 } as Response);

        const expected = {
            userId: USER_ID,
            associationIdentifier: SIREN,
            date: expect.any(Date),
        };

        expect(addAssociationVisitMock).toBeCalledWith(expected);
    });
});
