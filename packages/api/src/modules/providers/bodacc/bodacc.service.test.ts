import providerRequestService from "../../provider-request/providerRequest.service";
import BodaccAdapter from "./adapters/bodacc.adapter";
import bodaccService from "./bodacc.service";
import { BodaccDto } from "./dto/BodaccDto";

import * as SirenHelper from "./../../../shared/helpers/SirenHelper";
jest.mock("./../../../shared/helpers/SirenHelper", () => ({
    siretToSiren: jest.fn(siren => siren),
}));

describe("Bodacc Service", () => {
    const SIREN = "123456789";

    const RECORD = {
        record: {
            fields: {
                registre: ["", SIREN],
            },
        },
    };
    const BODACC_DTO = {
        records: [RECORD],
    } as BodaccDto;

    const mockToAssociation = jest.spyOn(BodaccAdapter, "toAssociation").mockImplementation(jest.fn());
    let httpGetSpy: jest.SpyInstance;

    beforeAll(() => {
        // @ts-expect-error http is protected method
        httpGetSpy = jest.spyOn(bodaccService.http, "get").mockResolvedValue({});
    });

    describe("sendRequest", () => {
        it("should call providerRequestService with url", async () => {
            await bodaccService.sendRequest(SIREN);
            expect(httpGetSpy).toHaveBeenCalledWith(
                `https://bodacc-datadila.opendatasoft.com/api/v2/catalog/datasets/annonces-commerciales/records?order_by=dateparution DESC&refine=registre:${SIREN}`,
            );
        });
    });

    describe("getAssociationsBySiren", () => {
        let mockSendRequest: jest.SpyInstance;
        beforeEach(() => {
            mockSendRequest = jest.spyOn(bodaccService, "sendRequest").mockImplementation(async () => BODACC_DTO);
        });

        it("should call sendRequest with siren", async () => {
            await bodaccService.getAssociationsBySiren(SIREN);
            expect(mockSendRequest).toHaveBeenCalledWith(SIREN);
        });

        it("should call BodaccAdapter.toAssociation", async () => {
            await bodaccService.getAssociationsBySiren(SIREN);
            expect(mockToAssociation).toHaveBeenCalledWith(BODACC_DTO);
        });
    });

    describe("getAssociationsBySiret", () => {
        let spyGetAssociationsBySiren: jest.SpyInstance;

        beforeEach(() => {
            spyGetAssociationsBySiren = jest.spyOn(bodaccService, "getAssociationsBySiren");
        });

        it("should call getAssociationsBySiren", () => {
            bodaccService.getAssociationsBySiret(SIREN);
            expect(spyGetAssociationsBySiren).toHaveBeenCalledWith(SIREN);
        });
    });

    describe("getAssociationsByRna", () => {
        it("should return null", async () => {
            const actual = await bodaccService.getAssociationsByRna();
            expect(actual).toEqual(null);
        });
    });
});
