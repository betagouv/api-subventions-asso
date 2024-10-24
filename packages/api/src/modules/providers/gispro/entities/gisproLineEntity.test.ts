import GisproLineEntity from "./gisproLineEntity";

describe("indexedInformationPath", () => {
    describe("dauphinId adapter", () => {
        let adapter;

        beforeAll(() => {
            adapter = GisproLineEntity.indexedInformationsPath.dauphinId.adapter || adapter;
        });

        it.each`
            message                | source
            ${"strips DA"}         | ${"DA12345678"}
            ${"strips after dash"} | ${"12345678-45"}
            ${"strips both"}       | ${"DA12345678-456"}
        `("$message", ({ source }) => {
            const actual = adapter(source);
            expect(adapter(actual)).toBe("12345678");
        });
    });
});
