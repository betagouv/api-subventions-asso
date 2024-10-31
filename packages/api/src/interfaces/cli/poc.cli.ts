import fs from "fs";
import { CliStaticInterface } from "../../@types";
import sirenePort from "../../dataProviders/api/SIRENE/sirene.port";
import { StaticImplements } from "../../decorators/staticImplements.decorator";
import CliController from "../../shared/CliController";

@StaticImplements<CliStaticInterface>()
export default class PocCli extends CliController {
    static cmdName = "poc";

    public async test() {
        const file = fs.createWriteStream("poc-zip.zip");

        const response = await sirenePort.getZip();

        return new Promise(resolve => {
            response.data.pipe(file);

            file.on("finish", () => {
                console.log("finish");
                file.close();
            });

            file.on("error", error => {
                console.log("error", error);
            });

            file.on("close", () => {
                resolve("ok google");
                console.log("close");
            });
        });
    }
}
