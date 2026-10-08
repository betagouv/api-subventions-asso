import { CliStaticInterface } from "../../../@types";
import { StaticImplements } from "../../../decorators/static-implements.decorator";
import CliController from "../../../shared/CliController";
import DownloadFile from "../../../usecases/download-file";
import { RemoveFile } from "../../../usecases/remove-file";
import { sireneStockEstablishmentAdapter } from "../../outputs/api/data-gouv/data-gouv.adapter";
import { DownloadAndImport } from "../pipeline/import/download-and-import.pipeline";
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
        private download: DownloadFile,
        private remove: RemoveFile,
        notifier: ImportNotifier,
    ) {
        super(notifier);
    }

    protected async _parse(file: string) {
        // here we got documents
        return this.establishmentPipeline.run(file); // inside this call we lose documents
    }

    async import() {
        return new DownloadAndImport(this, this.download, this.remove).run();
    }
}

export const createEstablishmentCli = () =>
    new EstablishmentCli(
        sireneEstablishmentPipeline,
        new DownloadFile(sireneStockEstablishmentAdapter),
        new RemoveFile(),
        importNotifier,
    );
