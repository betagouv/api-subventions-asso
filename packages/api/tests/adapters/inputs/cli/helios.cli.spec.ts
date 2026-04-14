import path from "path";
import createHeliosCli from "../../../../src/adapters/inputs/cli/helios/helios.cli.factory";
import heliosAdapter from "../../../../src/adapters/outputs/db/providers/helios/helios.adapter";
import paymentFlatAdapter from "../../../../src/adapters/outputs/db/payment-flat/payment-flat.adapter";
import { expectAnyUpdateDate } from "../../../__helpers__/expect-any.helper";

describe("Helios CLI", () => {
    describe("parse", () => {
        it("persists raw data", async () => {
            const cli = createHeliosCli();
            await cli.parse(path.resolve(__dirname, "./helios.fixture.ods"));
            expect((await heliosAdapter.findAll()).map(expectAnyUpdateDate)).toMatchSnapshot();
        });

        it("persists data as flat payments", async () => {
            const cli = createHeliosCli();
            await cli.parse(path.resolve(__dirname, "./helios.fixture.ods"));
            expect((await paymentFlatAdapter.findAll()).map(expectAnyUpdateDate)).toMatchSnapshot();
        });

        it("persists data as flat application", async () => {
            const cli = createHeliosCli();
            await cli.parse(path.resolve(__dirname, "./helios.fixture.ods"));
            expect((await paymentFlatAdapter.findAll()).map(expectAnyUpdateDate)).toMatchSnapshot();
        });
    });
});
