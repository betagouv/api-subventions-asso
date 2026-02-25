const mockLabel = "NORMALIZED_LABEL";
const mockToStatus = jest.fn(() => mockLabel);

import SIMPLIFIED_JOINED_DAUPHIN_GISPRO from "../@types/__fixture__/SimplifiedJoinedDauphinGispro.fixture";
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

    describe("simplifiedJoinedToApplicationFlat", () => {
        it("returns null if no siretDemandeur", () => {
            const expected = null;
            const actual = DauphinDtoAdapter.simplifiedJoinedToApplicationFlat({
                ...SIMPLIFIED_JOINED_DAUPHIN_GISPRO,
                // @ts-expect-error: test edge case
                siretDemandeur: null,
            });
            expect(actual).toEqual(expected);
        });

        it("returns application flat", () => {
            const actual = DauphinDtoAdapter.simplifiedJoinedToApplicationFlat(SIMPLIFIED_JOINED_DAUPHIN_GISPRO);
            expect(actual).toMatchSnapshot({ updateDate: expect.any(Date) });
        });
    });
});
