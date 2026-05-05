import fs from "fs";
import path from "path";

import OsirisParser from "../../../../src/adapters/inputs/cli/osiris/osiris.parser";
import OsirisActionEntity from "../../../../src/modules/providers/osiris/entities/OsirisActionEntity";

describe("OsirisParser", () => {
    describe("parseRequests", () => {
        it("returns OSIRIS request DTOs", () => {
            const buffer = fs.readFileSync(path.resolve(__dirname, "./__fixtures__/SuiviDossiers_test.xls"));
            const requests = OsirisParser.parseRequests(buffer);

            expect(requests).toMatchSnapshot();
        });
    });

    describe("parseActions", () => {
        beforeEach(() => {
            jest.useFakeTimers().setSystemTime(new Date("2025-08-07"));
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        it("returns OSIRIS action entities", () => {
            const buffer = fs.readFileSync(path.resolve(__dirname, "./__fixtures__/SuiviActions_test.xls"));
            const actions = OsirisParser.parseActions(buffer, 2022);

            expect(actions).toHaveLength(1);
            expect(actions[0]).toBeInstanceOf(OsirisActionEntity);
            expect(actions).toMatchSnapshot();
        });
    });
});
