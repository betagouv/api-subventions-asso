import { CliStaticInterface } from "./@types/Cli.interface";
import OsirisCliController from "./osiris/interfaces/cli/osiris.cli.contoller";

const contollers: CliStaticInterface[] = [
    OsirisCliController,
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

instance[args[1]].call(instance, ...args.slice(2));