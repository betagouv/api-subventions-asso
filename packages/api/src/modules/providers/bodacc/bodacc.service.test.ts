import BodaccAdapter from "./adapters/bodacc.adapter";
import bodaccService from "./bodacc.service";
import { BodaccDto } from "./dto/BodaccDto";

import Siren from "../../../valueObjects/Siren";
import AssociationIdentifier from "../../../valueObjects/AssociationIdentifier";
jest.mock("./../../../shared/helpers/SirenHelper", () => ({
    siretToSiren: jest.fn(siren => siren),
}));

describe("Bodacc Service", () => {
    const SIREN = new Siren("123456789");
    const ASSOCIATION_ID = AssociationIdentifier.fromSiren(SIREN);

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

    describe("getAssociations", () => {
        let mockSendRequest: jest.SpyInstance;
        beforeEach(() => {
            mockSendRequest = jest.spyOn(bodaccService, "sendRequest").mockImplementation(async () => BODACC_DTO);
        });

        it("should call sendRequest with siren", async () => {
            await bodaccService.getAssociations(ASSOCIATION_ID);
            expect(mockSendRequest).toHaveBeenCalledWith(SIREN);
        });

        it("should call BodaccAdapter.toAssociation", async () => {
            await bodaccService.getAssociations(ASSOCIATION_ID);
            expect(mockToAssociation).toHaveBeenCalledWith(BODACC_DTO);
        });
    });
});
