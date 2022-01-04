import { StaticImplements } from "../../../decorators/staticImplements.decorator";
import { CliStaticInterface} from "../../../intefaces/Cli.interface";


@StaticImplements<CliStaticInterface>()
export default class OsirisCliController {
    static cmdName: string = "osiris";

    parse(type: string, file: string) {
        if (typeof type !== "string" || typeof file !== "string" ) {
            throw new Error("Parse command neet type and file args");
        }
        console.log(type, file);
    }
}