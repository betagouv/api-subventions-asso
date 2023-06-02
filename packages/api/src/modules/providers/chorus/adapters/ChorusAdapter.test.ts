import ChorusAdapter from "./ChorusAdapter";

describe("ChorusAdapter", () => {
    describe("toCommon", () => {
        it("returns proper result", () => {
            const INPUT = {
                indexedInformations: {
                    amount: 42789,
                    dateOperation: new Date("2022-02-02"),
                    codeDomaineFonctionnel: "0BOP-other",
                },
            };
            // @ts-expect-error mock
            const actual = ChorusAdapter.toCommon(INPUT);
            expect(actual).toMatchSnapshot();
        });
    });
});
