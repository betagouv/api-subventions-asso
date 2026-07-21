import { CliStaticInterface } from "../../../@types";
import { StaticImplements } from "../../../decorators/static-implements.decorator";
import CliController from "../../../shared/CliController";
import sireneEstablishmentPipeline, {
    SireneEstablishmentPipeline,
} from "../pipeline/import/sirene-establishment/sirene-establishment.pipeline";

@StaticImplements<CliStaticInterface>()
export default class EstablishmentCli extends CliController {
    static cmdName = "establishment";

    protected logFileParsePath = "./logs/establishment.parse.log.txt";
    protected _serviceMeta = { id: "sirene-establishment", name: "SIRENE Establishment" };

    constructor(private establishmentImport: SireneEstablishmentPipeline) {
        super();
    }

    protected async _parse(file: string) {
        return this.establishmentImport.run(file);
    }
}

export const createEstablishmentCli = () => new EstablishmentCli(sireneEstablishmentPipeline);
