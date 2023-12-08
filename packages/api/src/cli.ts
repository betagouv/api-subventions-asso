import "reflect-metadata";
import { mkdirSync, existsSync } from "fs";
import "./configurations/env.conf";

import LeCompteAssoInterfaceCli from "./interfaces/cli/LeCompteAssoInterfaceCli";
import FonjepInterfaceCli from "./interfaces/cli/FonjepInterfaceCli";
import ChorusInterfaceCli from "./interfaces/cli/ChorusInterfaceCli";
import OsirisInterfaceCli from "./interfaces/cli/OsirisInterfaceCli";
import UserInterfaceCli from "./interfaces/cli/UserInterfaceCli";
import ConsumerInterfaceCli from "./interfaces/cli/ConsumerInterfaceCli";
import { connectDB } from "./shared/MongoConnection";

import { CliStaticInterface } from "./@types";

import SubventiaInterfaceCli from "./interfaces/cli/SubventiaInterfaceCli";
import DemarchesSimplifieesIntefaceCli from "./interfaces/cli/DemarchesSimplifieesIntefaceCli";
import CaisseDepotsInterfaceCli from "./interfaces/cli/CaisseDepotsInterfaceCli";
import GisproInterfaceCli from "./interfaces/cli/GisproInterfaceCli";
import DauphinInterfaceCli from "./interfaces/cli/DauphinInterfaceCli";
import AdminStructureInterfaceCli from "./interfaces/cli/AdminStructureInterfaceCli";
import DumpInterfaceCli from "./interfaces/cli/DumpInterfaceCli";
import ScdlInterfaceCli from "./interfaces/cli/ScdlInterfaceCli";
import HistoryUniteLegalInterfaceCli from "./interfaces/cli/HistoryUniteLegalInterfaceCli";

async function main() {
    await connectDB();

    if (!existsSync("./logs")) {
        mkdirSync("./logs");
    }

    const controllers: CliStaticInterface[] = [
        OsirisInterfaceCli,
        LeCompteAssoInterfaceCli,
        UserInterfaceCli,
        ChorusInterfaceCli,
        FonjepInterfaceCli,
        SubventiaInterfaceCli,
        ConsumerInterfaceCli,
        DemarchesSimplifieesIntefaceCli,
        CaisseDepotsInterfaceCli,
        GisproInterfaceCli,
        DauphinInterfaceCli,
        AdminStructureInterfaceCli,
        DumpInterfaceCli,
        ScdlInterfaceCli,
        HistoryUniteLegalInterfaceCli,
    ];

    const args = process.argv.slice(2);

    const Controller = controllers.find(controller => controller.cmdName === args[0]);

    if (!Controller) {
        throw new Error(`Controller ${args[0]} not found`);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const instance = new Controller() as any;

    if (!instance[args[1]]) {
        console.log(instance);
        throw new Error(`Method ${args[1]} not found in controller ${args[0]}`);
    }

    const result = instance[args[1]].call(instance, ...args.slice(2));

    if (result instanceof Promise) {
        result.catch(console.error).finally(() => process.exit());
    }
}

main();
