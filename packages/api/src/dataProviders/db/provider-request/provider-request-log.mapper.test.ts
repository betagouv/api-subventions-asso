import ProviderRequestLogMapper from "./provider-request-log.mapper";
import ProviderRequestLog from "../../../modules/provider-request/entities/ProviderRequestLog";
import ProviderRequestLogDbo from "./ProviderRequestLogDbo";
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

            const result = ProviderRequestLogMapper.toEntity(dbo);

            expect(result).toBeInstanceOf(ProviderRequestLog);
            expect(result).toMatchObject({
                date: expect.any(Date),
                providerId: dbo.providerId,
                responseCode: dbo.responseCode,
                route: dbo.route,
                type: dbo.type,
            });
        });
    });

    describe("fromEntity", () => {
        it("should convert ProviderRequestLog to ProviderRequestLogDbo", () => {
            const entity: ProviderRequestLog = new ProviderRequestLog(
                "Provider",
                "/api/endpoint",
                new Date(),
                200,
                "GET",
            );

            const result = ProviderRequestLogMapper.fromEntity(entity);
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
    });
});
