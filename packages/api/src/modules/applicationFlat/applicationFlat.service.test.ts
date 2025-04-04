import applicationFlatPort from "../../dataProviders/db/applicationFlat/applicationFlat.port";

describe("ApplicationFlatService", () => {
    describe("application part", () => {
        describe("rawToApplication", () => {
            it("calls adapter", () => {});
            it("returns adapter's result", () => {});
        });
        describe("getDemandeSubvention", () => {
            it.each`
                identifierType | identifier          | findMethod
                ${"siret"}     | ${"12345678901234"} | ${applicationFlatPort.findBySiret}
                ${"siren"}     | ${"123456789"}      | ${applicationFlatPort.findBySiren}
            `("if identifier is $identifierType, call proper port method", ({ identifier, findMethod }) => {
                // TODO move in extracted method
            });

            it("adapts all applications", () => {});

            it("returns non-null adapted applications", () => {});
        });
    });
    describe("grant part", () => {
        it("converts found methods", () => {});
    });

    describe("applicationFlat part", () => {
        describe("updateApplicationsFlatCollection", () => {
            it("updates for all providers with given exercise", () => {});
            it("updates for all providers and years from 2017 to now + 3 years", () => {});
        });
        describe("updateApplicationsFlatCollectionByProvider", () => {
            it("gets stream from provider", () => {});
            it("calls port's upsert as many times as necessary according to chunk size", () => {});
            it("pipes stream from provider", () => {});
        });
        describe("isCollectionInitialized", () => {
            it("calls check in port", () => {});
        });
    });
});
