import { getShortISODate } from "../../../../../shared/helpers/DateHelper";
import omogenAdapter from "../../../../outputs/api/omogen/omogen.adapter";
import { OmogenPort } from "../../../../outputs/api/omogen/omogen.port";
import { providersS3Adapter } from "../../../../outputs/s3/s3.adapter";
import { S3Port } from "../../../../outputs/s3/s3.port";

// @Thoughts: Not sure where to place this file - it might be merged into ChorusImport
// Download latest chorus file from Omogen and upload it to the S3 bucket
export class ChorusUpload {
    constructor(
        private omogen: OmogenPort,
        private s3: S3Port,
    ) {}

    async run() {
        const files = await this.omogen.list();
        if (!files || files.length == 0) return;
        const file = files.sort((a, b) => new Date(b.dateDepot).getTime() - new Date(a.dateDepot).getTime())[0];
        await this.s3.uploadFile(
            await this.omogen.get(file.correlationID),
            `chorus/${getShortISODate(new Date(file.dateDepot))}`,
        );
    }
}

const chorusUpload = new ChorusUpload(omogenAdapter, providersS3Adapter);
export default chorusUpload;
