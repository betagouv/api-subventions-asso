import { CliStaticInterface } from "../../../@types";
import { StaticImplements } from "../../../decorators/static-implements.decorator";
import { ImportReport } from "../../../@types/ImportReport";
import CliController from "../../../shared/CliController";
import DownloadFile from "../../../usecases/download-file";
import { RemoveFile } from "../../../usecases/remove-file";
import { sireneStockUniteLegaleAdapter } from "../../outputs/api/data-gouv/data-gouv.adapter";
import { DownloadAndImport } from "../pipeline/import/download-and-import.pipeline";
import sireneUniteLegalePipeline, {
    SireneUniteLegalePipeline,
} from "../pipeline/import/sirene-unite-legale/sirene-unite-legale.pipeline";

@StaticImplements<CliStaticInterface>()
export default class SireneStockUniteLegaleCli extends CliController {
    static cmdName = "sirene";

    protected logFileParsePath = "./logs/sirene-stock-unite-legale.parse.log.txt";
    protected _serviceMeta = { id: "sirene-unite-legale", name: "SIRENE Unité Légale" };

    constructor(
        private pipeline: SireneUniteLegalePipeline,
        private download: DownloadFile,
        private remove: RemoveFile,
    ) {
        super();
    }

    protected _parse(filePath: string): Promise<ImportReport> {
        return this.pipeline.run(filePath);
    }

    async import() {
        return new DownloadAndImport(this, this.download, this.remove).run();
    }
}

export const createSireneStockUniteLegaleCli = () =>
    new SireneStockUniteLegaleCli(
        sireneUniteLegalePipeline,
        new DownloadFile(sireneStockUniteLegaleAdapter),
        new RemoveFile(),
    );
