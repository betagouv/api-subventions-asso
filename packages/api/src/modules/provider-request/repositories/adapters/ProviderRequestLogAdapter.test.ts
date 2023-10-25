import ProviderRequestLogAdapter from "./ProviderRequestLogAdapter";
import ProviderRequestLog from "../../entities/ProviderRequestLog";
import ProviderRequestLogDbo from "../dbo/ProviderRequestLogDbo";
import { ObjectId } from "mongodb";

describe("ProviderRequestLogAdapter", () => {
    describe("toEntity", () => {
        it("should convert ProviderRequestLogDbo to ProviderRequestLog", () => {
            const dbo: ProviderRequestLogDbo = {
                _id: new ObjectId(),
                providerId: "Provider",
                date: new Date(),
                route: "/api/endpoint",
                responseCode: 200,
                type: "GET",
            };
    
            const result = ProviderRequestLogAdapter.toEntity(dbo);
    
            expect(result).toBeInstanceOf(ProviderRequestLog);
            expect(result).toMatchObject({
                date: expect.any(Date),
                providerId: dbo.providerId,
                responseCode: dbo.responseCode,
                route: dbo.route,
                type: dbo.type,
            });
        });
    })

    describe('fromEntity', () => {
        it("should convert ProviderRequestLog to ProviderRequestLogDbo", () => {
            const entity: ProviderRequestLog = new ProviderRequestLog("Provider", "/api/endpoint", new Date(), 200, "GET");
    
            const result = ProviderRequestLogAdapter.fromEntity(entity);
            expect(result._id).toBeInstanceOf(ObjectId);
            expect(result).toMatchObject({
                _id: expect.any(ObjectId),
                date: expect.any(Date),
                providerId: entity.providerId,
                responseCode: entity.responseCode,
                route: entity.route,
                type: entity.type,
            });
        });
    })
});
