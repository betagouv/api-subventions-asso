import indexService from "./index.service";

describe("indexService", () => {
    describe("getIndexData", () => {
        it("should return data", () => {
            const expected = {
                message: "Bienvenue sur l'api Data.Subvention",
                doc: "https://github.com/betagouv/api-subventions-asso/wiki/Documentation-API-&-Guide-d'int%C3%A9gration",
                swagger: "/docs"
            };

            const actual = indexService.getIndexData();

            expect(actual).toEqual(expected);
        });
    });
});
