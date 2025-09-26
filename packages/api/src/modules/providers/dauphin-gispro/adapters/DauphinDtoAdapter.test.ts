const mockLabel = "NORMALIZED_LABEL";
const mockToStatus = jest.fn(() => mockLabel);

import DauphinDtoAdapter from "./DauphinDtoAdapter";

jest.mock("../../providers.adapter", () => ({
    toStatusFactory: () => mockToStatus,
    __esModule: true, // this property makes it work
}));

describe("DauphinDtoAdapter", () => {
    describe("toDocuments", () => {
        const DAUPHIN_DOC = [
            {
                libelle: { value: "test1" },
                documents: [
                    {
                        id: "/path1",
                        title: "title1",
                        expand: { properties: { "entity:document:date": { value: "2022-02-01" } } },
                    },
                    {
                        id: "/path2",
                        title: "title2",
                        expand: { properties: { "entity:document:date": { value: "2022-02-01" } } },
                    },
                ],
            },
            {
                libelle: { value: "test1" },
                documents: [
                    {
                        id: "/path1",
                        title: "title1",
                        expand: { properties: { "entity:document:date": { value: "2022-02-01" } } },
                    },
                    {
                        id: "/path2",
                        title: "title2",
                        expand: { properties: { "entity:document:date": { value: "2022-02-01" } } },
                    },
                ],
            },
        ];

        // not really unit test but don't know how to do otherwise
        it("return proper result", () => {
            // @ts-expect-error -- mock
            const actual = DauphinDtoAdapter.toDocuments(DAUPHIN_DOC);
            expect(actual).toMatchSnapshot();
        });

        it("ignore docs with errors", () => {
            const actual = DauphinDtoAdapter.toDocuments([
                {
                    libelle: { value: "test1" },
                    documents: [
                        {
                            id: "/path2",
                            title: "title2",
                            // @ts-expect-error -- mock
                            error: "something",
                        },
                    ],
                },
            ]);
            expect(actual).toMatchInlineSnapshot(`[]`);
        });
    });
});
