import path from "path";
import fs from "fs";
import { StaticImplements } from "../../decorators/staticImplements.decorator";
import { CliStaticInterface } from "../../@types";

import {
    ScdlFileProcessingConfig,
    ScdlFileProcessingConfigList,
    ScdlParseArgs,
    ScdlParseParams,
    ScdlParseXlsArgs,
} from "../../@types/ScdlDataIntegration";
import {
    SCDL_FILE_PROCESSING_CONFIG_FILENAME,
    SCDL_FILE_PROCESSING_PATH,
} from "../../configurations/scdlIntegration.conf";
import { FileExtensionEnum } from "../../@enums/FileExtensionEnum";
import { isShortISODateParam } from "../../shared/helpers/DateHelper";
import { isNumberValid } from "../../shared/Validators";
import { isStringParam } from "../../shared/helpers/StringHelper";
import ScdlCli from "./Scdl.cli";

@StaticImplements<CliStaticInterface>()
export default class ScdlBatchCli {
    static cmdName = "scdl-batch";

    private scdlCli: ScdlCli;
    protected successList: string[] = [];
    protected errorList: string[] = [];

    constructor() {
        this.scdlCli = new ScdlCli();
    }

    private isConfig(obj: any): obj is ScdlFileProcessingConfigList {
        return obj && Array.isArray(obj.files) && obj.files.every((file: any) => this.isFileConfig(file));
    }

    private isXlsArgs(params: ScdlParseXlsArgs) {
        if (isStringParam(params.pageName)) return false;
        if (params.rowOffset && !isNumberValid(Number(params.rowOffset))) return false;
        return true;
    }

    private isCsvArgs(params: ScdlParseArgs) {
        const ACCEPTED_DELIMITERS = [";", ","];
        const ACCEPTED_QUOTES = ['"', "'"];
        if (params.delimiter && !ACCEPTED_DELIMITERS.includes(params.delimiter as string)) return false;
        if (params.quote && !ACCEPTED_QUOTES.includes(params.quote as string)) return false;
        return true;
    }

    private isParseParams(params: ScdlParseParams) {
        if (typeof params != "object") return false;
        if (!isStringParam(params.producerSlug)) return false;
        if (isShortISODateParam(params.exportDate)) return false;

        // csv part
        // @ts-expect-error: type of parseParam is ScdlParseArgs
        if (params.delimiter || params.quote) return this.isCsvArgs(parseParam);

        // excel part
        // @ts-expect-error: type of parseParam is ScdlParseXlsArgs
        if (params.pageName || params.rowOffset) return this.isXlsArgs(params);
    }

    private isFileConfig(file: any): file is ScdlFileProcessingConfig {
        return (
            file &&
            typeof file.name === "string" &&
            this.isParseParams(file.parseParams) &&
            typeof file.addProducer === "boolean"
        );
    }

    private loadConfig(): ScdlFileProcessingConfigList {
        const filePath = path.resolve(SCDL_FILE_PROCESSING_PATH, SCDL_FILE_PROCESSING_CONFIG_FILENAME);
        const data = fs.readFileSync(filePath, "utf8");
        return JSON.parse(data) as ScdlFileProcessingConfigList;
    }

    protected async processFile(fileInfo: ScdlFileProcessingConfig): Promise<void> {
        const { name, parseParams, addProducer, producerName, producerSiret } = fileInfo;
        const dirPath = path.resolve(SCDL_FILE_PROCESSING_PATH);
        const { producerSlug, exportDate, ...optionalParams } = parseParams;

        try {
            if (addProducer && producerName && producerSiret) {
                await this.scdlCli.addProducer(producerSlug, producerName, producerSiret);
                this.successList.push(`added producer ${producerSlug}`);
            }
        } catch (e) {
            if ((e as Error).message !== "Producer already exists") {
                this.errorList.push(
                    `added producer ${producerSlug} for file ${name}, data parsing not performed : ${
                        (e as Error).message
                    }`,
                );
                return;
            }
        }

        try {
            const fileType = path.extname(name).slice(1).toLowerCase();
            const filePath = path.join(dirPath, name);
            if (fileType === FileExtensionEnum.CSV) {
                const { delimiter, quote } = optionalParams as ScdlParseArgs;
                await this.scdlCli.parse(filePath, producerSlug, exportDate, delimiter, quote);
            } else if (fileType === FileExtensionEnum.XLS || fileType === FileExtensionEnum.XLSX) {
                const { pageName, rowOffset } = optionalParams as ScdlParseXlsArgs;
                await this.scdlCli.parseXls(filePath, producerSlug, exportDate, pageName, rowOffset);
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
                throw new Error("Invalid configuration file: The config does not match the expected structure.");
            }
            const filePromises = config.files.map(this.processFile.bind(this));
            await Promise.all(filePromises);
        } catch (e) {
            console.trace("❌ Global execution failure.", e);
            this.errorList.push(`Global execution failure : ${(e as Error).message}`);
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
