import { Readable } from "stream";
import { Controller, FormField, Post, Route, Security, Tags, UploadedFile } from "tsoa";
import csvSyncStringifier = require("csv-stringify/sync");
import ScdlGrantParser from "../../modules/providers/scdl/scdl.grant.parser";
import { BadRequestError } from "../../shared/errors/httpErrors";

@Route("tools")
@Tags("Tools Controller")
@Security("jwt", ["admin"])
export class ToolsHttp extends Controller {
    /**
     * @summary Reads an scdl file (csv or excel), validates its content and returns error report
     */
    @Post("/scdl/validate")
    public parse(
        @UploadedFile() file: Express.Multer.File,
        @FormField() type: "csv" | "excel",
        @FormField() pageName?: string,
        @FormField() rowOffset: number | string = 0,
        @FormField() delimiter = ";",
        @FormField() quote = '"',
    ) {
        if (!["csv", "excel"].includes(type)) throw new BadRequestError("import type needs to be 'csv' or 'excel'");
        let resStr = "";
        if (type === "csv") resStr = this.parseCsv(file, delimiter, quote);
        else if (type === "excel") resStr = this.parseXls(file, pageName, rowOffset);
        this.setHeader(`Content-Type`, "text/csv");
        this.setHeader("Content-Disposition", "attachment");
        return Readable.from(Buffer.from(resStr));
    }

    private parseXls(file: Express.Multer.File, pageName?: string, rowOffset: number | string = 0) {
        const parsedRowOffset = typeof rowOffset === "number" ? rowOffset : parseInt(rowOffset);
        const fileContent = file.buffer;
        const { errors } = ScdlGrantParser.parseExcel(fileContent, pageName, parsedRowOffset);
        return csvSyncStringifier.stringify(errors, { header: true });
    }

    private parseCsv(file: Express.Multer.File, delimiter = ";", quote = '"') {
        const fileContent = file.buffer;
        const parsedQuote = quote === "false" ? false : quote;
        const { errors } = ScdlGrantParser.parseCsv(fileContent, delimiter, parsedQuote);
        return csvSyncStringifier.stringify(errors, { header: true });
    }
}
