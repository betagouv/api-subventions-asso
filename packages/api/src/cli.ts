import "reflect-metadata";
import { mkdirSync, existsSync } from "fs";
import "./configurations/env.conf";

import FonjepCli from "./adapters/inputs/cli/Fonjep.cli";
import ChorusCli from "./adapters/inputs/cli/Chorus.cli";
import OsirisCli from "./adapters/inputs/cli/Osiris.cli";
import UserCli from "./adapters/inputs/cli/User.cli";
import ConsumerCli from "./adapters/inputs/cli/Consumer.cli";
import { connectDB } from "./shared/MongoConnection";

import { CliStaticInterface } from "./@types";

import SubventiaCli from "./adapters/inputs/cli/Subventia.cli";
import DemarchesSimplifieesCli from "./adapters/inputs/cli/DemarchesSimplifiees.cli";
import GisproCli from "./adapters/inputs/cli/Gispro.cli";
import DauphinCli from "./adapters/inputs/cli/Dauphin.cli";
import AdminStructureCli from "./adapters/inputs/cli/AdminStructure.cli";
import DumpCli from "./adapters/inputs/cli/Dump.cli";
import ScdlCli from "./adapters/inputs/cli/Scdl.cli";
import { initIndexes } from "./shared/MongoInit";
import GeoCli from "./adapters/inputs/cli/Geo.cli";
import DataBretagneCli from "./adapters/inputs/cli/DataBretagne.cli";
import SireneStockUniteLegaleCli from "./adapters/inputs/cli/SireneStockUniteLegale.cli";
import AmountsVsProgramRegionCli from "./adapters/inputs/cli/AmountsVsProgramRegion.cli";
import ScdlBatchCli from "./adapters/inputs/cli/ScdlBatch.cli";

async function main() {
    await connectDB();
    await initIndexes();

    if (!existsSync("./logs")) {
        mkdirSync("./logs");
    }

    const controllers: CliStaticInterface[] = [
        OsirisCli,
        UserCli,
        ChorusCli,
        FonjepCli,
        SubventiaCli,
        ConsumerCli,
        DemarchesSimplifieesCli,
        GisproCli,
        DauphinCli,
        AdminStructureCli,
        DumpCli,
        ScdlCli,
        GeoCli,
        DataBretagneCli,
        SireneStockUniteLegaleCli,
        AmountsVsProgramRegionCli,
        ScdlBatchCli,
    ];

    const args = process.argv.slice(2);

    const Controller = controllers.find(controller => controller.cmdName === args[0]);

    if (!Controller) {
        throw new Error(`Controller ${args[0]} not found`);
    }

    const instance = new Controller() as unknown;

    // @ts-expect-error: make a type for controller
    if (!instance[args[1]]) {
        throw new Error(`Method ${args[1]} not found in controller ${args[0]}`);
    }

    // @ts-expect-error: make a type for controller
    const result = instance[args[1]].call(instance, ...args.slice(2));

    if (result instanceof Promise) {
        result.catch(console.error).finally(() => process.exit());
    }
}

main();
