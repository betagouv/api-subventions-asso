import "reflect-metadata";

import { mkdirSync, existsSync } from "fs";
import { CliStaticInterface } from "./@types/Cli.interface";
import LeCompteAssoCliController from "./modules/leCompteAsso/interfaces/cli/leCompteAsso.cli.contoller";
import OsirisCliController from "./modules/osiris/interfaces/cli/osiris.cli.contoller";
import { connectDB } from "./shared/MongoConnection";

async function main() {
    await connectDB();

    if (!existsSync("./logs")){
        mkdirSync("./logs");
    }

    const contollers: CliStaticInterface[] = [
        OsirisCliController,
        LeCompteAssoCliController,
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