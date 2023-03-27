import "reflect-metadata";
import "dotenv/config"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

import { mkdirSync, existsSync } from "fs";
import LeCompteAssoCliController from "./modules/providers/leCompteAsso/interfaces/cli/leCompteAsso.cli.contoller";
import MailNotifierCliController from "./modules/mail-notifier/interfaces/cli/mail-notifier.cli.controller";
import DataGouvCliController from "./modules/providers/datagouv/interfaces/cli/datagouv.cli.controller";
import FonjepCliController from "./modules/providers/fonjep/interfaces/cli/fonjep.cli.controller";
import ChorusCliController from "./modules/providers/chorus/interfaces/cli/chorus.cli.controller";
import OsirisCliController from "./modules/providers/osiris/interfaces/cli/osiris.cli.contoller";
import GisproCliController from "./modules/providers/gispro/interfaces/cli/gispro.cli.controller";
import UserCliController from "./modules/user/interfaces/cli/user.cli.controller";
import ConsumerCliController from "./modules/user/interfaces/cli/consumer.cli.controller";
import { connectDB } from "./shared/MongoConnection";

import { CliStaticInterface } from "./@types";

import "./modules/association-name/associationName.service"; // Load association-name for load service in eventManager
import SubventiaCliController from "./modules/providers/subventia/interfaces/subventia.cli.controller";
import DemarchesSimplifieesCliController from "./modules/providers/demarchesSimplifiees/interfaces/cli/demarchesSimplifiees.cli.controller";
import CaisseDepotsCliController from "./modules/providers/caisseDepots/caisseDepots.cli.controller";
import GisproJoinCliController from "./modules/providers/gisproJoin/interfaces/cli/gisproJoin.cli.controller";

async function main() {
    await connectDB();

    if (!existsSync("./logs")) {
        mkdirSync("./logs");
    }

    const controllers: CliStaticInterface[] = [
        OsirisCliController,
        LeCompteAssoCliController,
        MailNotifierCliController,
        UserCliController,
        ChorusCliController,
        FonjepCliController,
        DataGouvCliController,
        GisproCliController,
        SubventiaCliController,
        ConsumerCliController,
        DemarchesSimplifieesCliController,
        CaisseDepotsCliController,
        GisproJoinCliController
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
