import ProviderRequestLogAdapter from "./ProviderRequestLogAdapter";
import ProviderRequestLog from "../../entities/ProviderRequestLog";
import ProviderRequestLogDbo from "../dbo/ProviderRequestLogDbo";
import { ObjectId } from "mongodb";

describe("ProviderRequestLogAdapter", () => {
    it("should convert ProviderRequestLogDbo to ProviderRequestLog", () => {
        // Créez un objet ProviderRequestLogDbo fictif
        const dbo: ProviderRequestLogDbo = {
            _id: new ObjectId(),
            providerName: "Provider",
            date: new Date(),
            route: "/api/endpoint",
            responseCode: 200,
            type: "GET",
        };

        // Appelez la méthode toDomain pour convertir le dbo en ProviderRequestLog
        const result = ProviderRequestLogAdapter.toDomain(dbo);

        // Vérifiez si les propriétés de l'objet résultant sont correctes
        expect(result).toBeInstanceOf(ProviderRequestLog);
        expect(result.providerName).toBe("Provider");
        expect(result.route).toBe("/api/endpoint");
        // Assurez-vous de tester d'autres propriétés de la même manière
    });

    it("should convert ProviderRequestLog to ProviderRequestLogDbo", () => {
        // Créez un objet ProviderRequestLog fictif
        const entity: ProviderRequestLog = new ProviderRequestLog("Provider", "/api/endpoint", new Date(), 200, "GET");

        // Appelez la méthode fromDomain pour convertir l'entité en ProviderRequestLogDbo
        const result = ProviderRequestLogAdapter.formDomain(entity);

        // Vérifiez si les propriétés de l'objet résultant sont correctes
        expect(result._id).toBeInstanceOf(ObjectId);
        expect(result.providerName).toBe("Provider");
        expect(result.route).toBe("/api/endpoint");
        // Assurez-vous de tester d'autres propriétés de la même manière
    });
});
