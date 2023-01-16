import * as config from "../../src/configurations/mongo.conf";

describe("MongoDb Configuration", () => {
    it("should export mongo url", () => {
        expect(config).toHaveProperty("MONGO_URL");
    });

    it("should export mongo host", () => {
        expect(config).toHaveProperty("MONGO_HOST");
    });

    it("should export mongo port", () => {
        expect(config).toHaveProperty("MONGO_PORT");
    });

    it("should export mongo user", () => {
        expect(config).toHaveProperty("MONGO_USER");
    });

    it("should export mongo password", () => {
        expect(config).toHaveProperty("MONGO_PASSWORD");
    });

    it("should export mongo dbname", () => {
        expect(config).toHaveProperty("MONGO_DBNAME");
    });
});
