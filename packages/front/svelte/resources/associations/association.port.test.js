import axios from "axios";
import associationPort from "./association.port";

jest.mock("axios");

describe("AssociationPort", () => {
    axios.get.mockImplementation(() => ({ catch: jest.fn() }));
    const SIREN = "SIREN";

    describe("incExtractData", () => {
        it("should call axios with association in path", async () => {
            const expected = `/association/${SIREN}/extract-data`;
            await associationPort.incExtractData(SIREN);
            expect(axios.get).toHaveBeenCalledWith(expected);
        });
    });

    describe("getByIdentifier", () => {
        it("calls axios get", async () => {
            const expected = `/association/${SIREN}`;
            await associationPort.getByIdentifier(SIREN);
            expect(axios.get).toHaveBeenCalledWith(expected);
        });

        it("return association from axios result", async () => {
            const expected = "";
            const RES = { data: { association: expected } };
            axios.get.mockResolvedValueOnce(RES);
            const actual = await associationPort.getByIdentifier(SIREN);
            expect(actual).toBe(expected);
        });
    });

    describe("search", () => {
        it("calls axios get", async () => {
            const expected = `/search/associations/${SIREN}`;
            await associationPort.search(SIREN);
            expect(axios.get).toHaveBeenCalledWith(expected);
        });

        it("return association list from axios result", async () => {
            const expected = [];
            const RES = { data: { result: expected } };
            axios.get.mockResolvedValueOnce(RES);
            const actual = await associationPort.search(SIREN);
            expect(actual).toBe(expected);
        });
    });
});
