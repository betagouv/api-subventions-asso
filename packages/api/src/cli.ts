import "reflect-metadata";
import { mkdirSync, existsSync } from "fs";
import "./configurations/env.conf";

import FonjepCli from "./adapters/inputs/cli/fonjep.cli";
import ChorusCli from "./adapters/inputs/cli/chorus.cli";
import OsirisCli from "./adapters/inputs/cli/osiris.cli";
import UserCli from "./adapters/inputs/cli/user.cli";
import ConsumerCli from "./adapters/inputs/cli/consumer.cli";
import { connectDB } from "./shared/MongoConnection";

import { CliStaticInterface } from "./@types";

import SubventiaCli from "./adapters/inputs/cli/subventia.cli";
import DemarchesSimplifieesCli from "./adapters/inputs/cli/demarches-simplifiees.cli";
import GisproCli from "./adapters/inputs/cli/gispro.cli";
import DauphinCli from "./adapters/inputs/cli/dauphin.cli";
import AdminStructureCli from "./adapters/inputs/cli/admin-structure.cli";
import DumpCli from "./adapters/inputs/cli/dump.cli";
import ScdlCli from "./adapters/inputs/cli/scdl.cli";
import { initIndexes } from "./shared/MongoInit";
import GeoCli from "./adapters/inputs/cli/geo.cli";
import DataBretagneCli from "./adapters/inputs/cli/data-bretagne.cli";
import SireneStockUniteLegaleCli from "./adapters/inputs/cli/sirene-stock-unite-legale.cli";
import AmountsVsProgramRegionCli from "./adapters/inputs/cli/amounts-vs-program-region.cli";
import ScdlBatchCli from "./adapters/inputs/cli/scdl-batch.cli";
import HeliosCli from "./adapters/inputs/cli/helios/helios.cli";
import createHeliosCli from "./adapters/inputs/cli/helios/helios.cli.factory";

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
        HeliosCli,
    ];

    const factoryMap = new Map([[HeliosCli.cmdName, { factory: createHeliosCli }]]);

    const args = process.argv.slice(2);

    const Controller = controllers.find(controller => controller.cmdName === args[0]);

    if (!Controller) {
        throw new Error(`Controller ${args[0]} not found`);
    }

    let instance: unknown;
    if (factoryMap.has(Controller.cmdName)) {
        instance = factoryMap.get(Controller.cmdName)!.factory();
    } else {
        instance = new Controller() as unknown;
    }

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
