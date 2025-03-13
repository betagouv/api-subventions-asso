import path from "path";
import fs from "fs";
import { StaticImplements } from "../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../@types";

import {
    FileConfigErrors,
    ScdlFileProcessingConfig,
    ScdlFileProcessingConfigList,
    ScdlParseCsvArgs,
    ScdlParseParams,
    ScdlParseXlsArgs,
} from "../../@types/ScdlDataIntegration";
import {
    SCDL_FILE_PROCESSING_CONFIG_FILENAME,
    SCDL_FILE_PROCESSING_PATH,
} from "../../configurations/scdlIntegration.conf";
import { FileExtensionEnum } from "../../@enums/FileExtensionEnum";
import { isBooleanValid, isNumberValid, isShortISODateValid, isStringValid } from "../../shared/Validators";
import scdlService from "../../modules/providers/scdl/scdl.service";
import ScdlCli from "./Scdl.cli";

@StaticImplements<CliStaticInterface>()
export default class ScdlBatchCli extends ScdlCli {
    static cmdName = "scdl-batch";

    protected successList: string[] = [];
    protected errorList: string[] = [];
    // store errors for each ScdlFileProcessingConfig format error
    protected fileConfigErrors: FileConfigErrors = [];

    private isConfig(obj: any): obj is ScdlFileProcessingConfigList {
        return Boolean(
            obj &&
                Array.isArray(obj.files) &&
                obj.files.length &&
                obj.files.every((file: any) => this.isFileConfig(file)),
        );
    }

    private isFileConfig(file: any): file is ScdlFileProcessingConfig {
        if (!file)
            throw new Error(
                `You must provide a config file for SCDL batch import and name it ${SCDL_FILE_PROCESSING_CONFIG_FILENAME}`,
            );

        if (!isStringValid(file.name)) this.fileConfigErrors.push({ field: "name" });
        if (isBooleanValid(file.addProducer) && file.addProducer) this.isParseParams(file.parseParams);

        if (this.fileConfigErrors.length) return false;
        else return true;
    }

    private isXlsArgs(params: ScdlParseXlsArgs) {
        const errors: FileConfigErrors = [];
        if (!isStringValid(params.pageName)) errors.push({ field: "pageName" });
        if (params.rowOffset && !isNumberValid(Number(params.rowOffset))) errors.push({ field: "rowOffset" });
        if (errors.length) {
            this.fileConfigErrors = this.fileConfigErrors.concat(errors);
            console.log(this.fileConfigErrors);
            return false;
        }
        return true;
    }

    private isCsvArgs(params: ScdlParseCsvArgs): params is ScdlParseCsvArgs {
        const ACCEPTED_DELIMITERS = [";", ","];
        const ACCEPTED_QUOTES = ['"', "'"];

        const errors: FileConfigErrors = [];

        if (params.delimiter && !ACCEPTED_DELIMITERS.includes(params.delimiter as string))
            errors.push({ field: "delimiter" });
        if (params.quote && !ACCEPTED_QUOTES.includes(params.quote as string)) errors.push({ field: "quote" });
        if (errors.length) {
            this.fileConfigErrors = this.fileConfigErrors.concat(errors);
            return false;
        }

        return true;
    }

    private isParseParams(params: any): params is ScdlParseParams {
        const errors: FileConfigErrors = [];
        if (typeof params != "object" || params instanceof Array) {
            errors.push({ field: "parseParams" });
        } else {
            // shared part
            if (!isStringValid(params.producerSlug)) errors.push({ field: "producerSlug" });
            if (!isShortISODateValid(params.exportDate)) errors.push({ field: "exportDate" });

            // csv part
            if (params.delimiter || params.quote) this.isCsvArgs(params);

            // excel part
            if (params.pageName || params.rowOffset) this.isXlsArgs(params);
        }
        if (errors.length) {
            this.fileConfigErrors = this.fileConfigErrors.concat(errors);
            return false;
        } else return true;
    }

    private loadConfig(): ScdlFileProcessingConfigList {
        const filePath = path.resolve(SCDL_FILE_PROCESSING_PATH, SCDL_FILE_PROCESSING_CONFIG_FILENAME);
        const data = fs.readFileSync(filePath, "utf8");
        return JSON.parse(data) as ScdlFileProcessingConfigList;
    }

    protected async processFile(fileConfig: ScdlFileProcessingConfig): Promise<void> {
        const { name, parseParams, addProducer, producerName, producerSiret } = fileConfig;

        // just to be sure but everything is supposed to be checked before calling processFile
        if (!name || !parseParams || !producerName || !producerSiret)
            throw new Error("File config values should have been checked earlier");

        const dirPath = path.resolve(SCDL_FILE_PROCESSING_PATH);
        const { producerSlug, exportDate, ...optionalParams } = parseParams;

        if (addProducer) {
            if (await scdlService.getProducer(producerSlug)) {
                const message = `Producer with slug ${producerSlug} already exist. Used with file ${name}`;
                this.errorList.push(message);
            } else {
                await scdlService.createProducer({
                    slug: producerSlug,
                    name: producerName,
                    siret: producerSiret,
                    lastUpdate: new Date(),
                });
                this.successList.push(`added producer ${producerSlug}`);
            }
        }

        try {
            // use slice to remove the dot from the extension name
            const fileType = path.extname(name).slice(1).toLowerCase();
            const filePath = path.join(dirPath, name);
            if (fileType === FileExtensionEnum.CSV) {
                const { delimiter, quote } = optionalParams as ScdlParseCsvArgs;
                await this.parse(filePath, producerSlug, exportDate, delimiter, quote);
            } else if (fileType === FileExtensionEnum.XLS || fileType === FileExtensionEnum.XLSX) {
                const { pageName, rowOffset } = optionalParams as ScdlParseXlsArgs;
                await this.parseXls(filePath, producerSlug, exportDate, pageName, rowOffset);
            } else {
                console.error(`❌ Unsupported file type : ${name} (type: ${fileType})`);
                throw new Error(`Unsupported file type : ${filePath}`);
            }
            this.successList.push(`parse data of ${producerSlug} for file ${name}`);
        } catch (e) {
            this.errorList.push(`parse data of ${producerSlug} for file ${name} : ${(e as Error).message}`);
        }
    }

    /**
     * main function to load the file listing .json and launch data integration
     */
    public async import() {
        try {
            const config: ScdlFileProcessingConfigList = this.loadConfig();
            if (!this.isConfig(config)) {
                // TODO: do something with fileConfigErrors => maybe transform it in a Map with each file name as key
                throw new Error(
                    `Invalid configuration file: The config does not match the expected structure. Concerned fields are ${this.fileConfigErrors
                        .map(error => error.field)
                        .join(",")
                        .slice(0, -1)}.`,
                );
            }
            const filePromises = config.files.map(fileConfig => this.processFile(fileConfig));
            await Promise.all(filePromises);
        } catch (e) {
            // unexpected error that doesn't make use of errorList
            console.trace(`❌ Global execution failure : ${(e as Error).message}`);
            throw e;
        } finally {
            console.log("\n---------------Summary of Operations---------------");
            if (this.errorList.length === 0) {
                {
                    console.log("🚀 All operations completed successfully! 🎯");
                }
            }
            if (this.successList.length > 0) {
                console.log("✅ list of Success :");
                this.successList.forEach(desc => console.log(`➡️ ${desc}`));
            }

            if (this.errorList.length > 0) {
                console.log("⚠️ List of Errors :");
                this.errorList.forEach(desc => console.log(`❌ ${desc}`));
            }
        }
    }
}
