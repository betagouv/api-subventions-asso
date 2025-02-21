import { Controller, FormField, Post, Route, Security, Tags, UploadedFile } from "tsoa";
import csvSyncStringifier = require("csv-stringify/sync");
import ScdlGrantParser from "../../modules/providers/scdl/scdl.grant.parser";
import scdlService from "../../modules/providers/scdl/scdl.service";
import { BadRequestError } from "../../shared/errors/httpErrors";

@Route("tools")
@Tags("Admin Controller")
@Security("jwt", ["admin"])
export class ToolsHttp extends Controller {
    /**
     * @summary Reads an scdl file (csv or excel), validates its content and returns error report
     */
    @Post("/scdl/validate")
    public async parse(
        @UploadedFile() file: Express.Multer.File,
        @FormField() type: "csv" | "excel",
        @FormField() pageName?: string,
        @FormField() rowOffset: number | string = 0,
        @FormField() delimiter = ";",
        @FormField() quote = '"',
    ) {
        if (type === "csv") return this.parseCsv(file, delimiter, quote);
        else if (type === "excel") return this.parseXls(file, pageName, rowOffset);
        throw new BadRequestError("import type needs to be 'csv' or 'excel'");
    }

    private async parseXls(file: Express.Multer.File, pageName?: string, rowOffset: number | string = 0) {
        const parsedRowOffset = typeof rowOffset === "number" ? rowOffset : parseInt(rowOffset);
        const fileContent = file.buffer;
        const { errors } = ScdlGrantParser.parseExcel(fileContent, pageName, parsedRowOffset);
        return csvSyncStringifier.stringify(errors, { header: true });
    }

    private async parseCsv(file: Express.Multer.File, delimiter = ";", quote = '"') {
        const fileContent = file.buffer;
        const parsedQuote = quote === "false" ? false : quote;
        const { errors } = ScdlGrantParser.parseCsv(fileContent, delimiter, parsedQuote);
        return csvSyncStringifier.stringify(errors, { header: true });
    }
}
