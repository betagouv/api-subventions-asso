import "reflect-metadata";
import { mkdirSync, existsSync } from "fs";
import "./configurations/env";

import LeCompteAssoCliController from "./modules/providers/leCompteAsso/interfaces/cli/leCompteAsso.cli.contoller";
import DataGouvCliController from "./modules/providers/datagouv/interfaces/cli/datagouv.cli.controller";
import FonjepCliController from "./modules/providers/fonjep/interfaces/cli/fonjep.cli.controller";
import ChorusCliController from "./modules/providers/chorus/interfaces/cli/chorus.cli.controller";
import OsirisCliController from "./modules/providers/osiris/interfaces/cli/osiris.cli.contoller";
import UserCliController from "./modules/user/interfaces/cli/user.cli.controller";
import ConsumerCliController from "./modules/user/interfaces/cli/consumer.cli.controller";
import { connectDB } from "./shared/MongoConnection";

import { CliStaticInterface } from "./@types";

import "./modules/association-name/associationName.service"; // Load association-name for load service in eventManager
import SubventiaCliController from "./modules/providers/subventia/interfaces/subventia.cli.controller";
import DemarchesSimplifieesCliController from "./modules/providers/demarchesSimplifiees/interfaces/cli/demarchesSimplifiees.cli.controller";
import CaisseDepotsCliController from "./modules/providers/caisseDepots/caisseDepots.cli.controller";
import GisproCliController from "./modules/providers/gispro/interfaces/cli/gispro.cli.controller";
import DauphinCliController from "./modules/providers/dauphin/interfaces/cli/dauphin.cli.controller";
import AdminStructureCliController from "./modules/admin-structure/interfaces/cli/adminStructureCliController";

async function main() {
    await connectDB();

    if (!existsSync("./logs")) {
        mkdirSync("./logs");
    }

    const controllers: CliStaticInterface[] = [
        OsirisCliController,
        LeCompteAssoCliController,
        UserCliController,
        ChorusCliController,
        FonjepCliController,
        DataGouvCliController,
        SubventiaCliController,
        ConsumerCliController,
        DemarchesSimplifieesCliController,
        CaisseDepotsCliController,
        GisproCliController,
        DauphinCliController,
        AdminStructureCliController,
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
