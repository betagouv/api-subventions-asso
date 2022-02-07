import "reflect-metadata";
import 'dotenv/config' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

import { mkdirSync, existsSync } from "fs";
import { CliStaticInterface } from "./@types/Cli.interface";
import LeCompteAssoCliController from "./modules/leCompteAsso/interfaces/cli/leCompteAsso.cli.contoller";
import OsirisCliController from "./modules/osiris/interfaces/cli/osiris.cli.contoller";
import UserCliController from "./modules/user/interfaces/cli/user.cli.controller";
import { connectDB } from "./shared/MongoConnection";
import MailNotifierCliController from "./modules/mail-notifier/interfaces/cli/mail-notifier.cli.controller";
import ChorusCliController from "./modules/chorus/interfaces/cli/chorus.cli.controller";

async function main() {
    await connectDB();

    if (!existsSync("./logs")){
        mkdirSync("./logs");
    }

    const contollers: CliStaticInterface[] = [
        OsirisCliController,
        LeCompteAssoCliController,
        MailNotifierCliController,
        UserCliController,
        ChorusCliController,
    ];
    
    const args = process.argv.slice(2);
    
    const Controller = contollers.find(controller => controller.cmdName === args[0]);
    
    if (!Controller) {
        throw new Error(`Controller ${args[0]} not found`);
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const instance = new Controller() as any;
    
    if (!instance[args[1]]) {
        throw new Error(`Method ${args[1]} not found in controller ${args[0]}`);
    }
    
    const result = instance[args[1]].call(instance, ...args.slice(2));
    
    if (result instanceof Promise) {
        result.catch(console.error).finally(() => process.exit())
    }
}

main();