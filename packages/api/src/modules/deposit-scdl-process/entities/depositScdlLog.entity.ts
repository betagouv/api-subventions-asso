import { ProviderDataEntity } from "../../../@types/ProviderData";
import UploadedFileInfosEntity from "./uploadedFileInfos.entity";

export default class DepositScdlLogEntity implements ProviderDataEntity {
    constructor(
        public userId: string,
        public step: number,
        public updateDate: Date = new Date(),
        public overwriteAlert?: boolean,
        public allocatorSiret?: string,
        public permissionAlert?: boolean,
        public uploadedFileInfos?: UploadedFileInfosEntity,
    ) {}
}
