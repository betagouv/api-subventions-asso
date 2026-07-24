import { CliStaticInterface } from "../../../@types";
import { StaticImplements } from "../../../decorators/static-implements.decorator";
import CliController from "../../../shared/CliController";
import importNotifier, { type ImportNotifier } from "../pipeline/import/import-notifier";
import sireneEstablishmentPipeline, {
    SireneEstablishmentPipeline,
} from "../pipeline/import/sirene-establishment/sirene-establishment.pipeline";

@StaticImplements<CliStaticInterface>()
export default class EstablishmentCli extends CliController {
    static cmdName = "establishment";

    protected logFileParsePath = "./logs/establishment.parse.log.txt";
    protected _serviceMeta = { id: "sirene-establishment", name: "SIRENE Establishment" };

    constructor(
        private establishmentPipeline: SireneEstablishmentPipeline,
        notifier: ImportNotifier,
    ) {
        super(notifier);
    }

    protected async _parse(file: string) {
        return this.establishmentPipeline.run(file);
    }
}

export const createEstablishmentCli = () => new EstablishmentCli(sireneEstablishmentPipeline, importNotifier);
