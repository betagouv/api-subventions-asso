import { ObjectId } from "mongodb";
import paymentFlatPort from "../../../dataProviders/db/paymentFlat/paymentFlat.port";
import dataBretagneService from "../../providers/dataBretagne/dataBretagne.service";
import chorusService from "../../providers/chorus/chorus.service";
import configurationsService, { CONFIGURATION_NAMES } from "../../configurations/configurations.service";
import PaymentFlatAdapter from "./paymentFlatAdapter";

export class PaymentFlatService {
    private async getAllDataBretagneData() {
        const ministries = await dataBretagneService.getMinistriesRecord();
        const programs = await dataBretagneService.findProgramsRecord();
        const domainesFonct = await dataBretagneService.getDomaineFonctRecord();
        const refsProgrammation = await dataBretagneService.getRefProgrammationRecord();
        return { programs, ministries, domainesFonct, refsProgrammation };
    }
    /*
    public async getChorusLastObjectId() {
        const lastChorusObjectId = await configurationsService.getChorusLastObjectId();
        if (lastChorusObjectId === null)
            return new ObjectId("000000000000000000000000"); // ObjectId value corresponding to 1/1/1970 at midnight
        else return lastChorusObjectId.data;
    }

    public async setChorusLastObjectId(lastObjectId: ObjectId) {
        await configurationsService.setChorusLastObjectId(lastObjectId);
    }
    */

    public async getChorusLastUpdateImported() {
        const lastChorusUpdateImported = await configurationsService.getChorusLastUpdateImported();
        if (lastChorusUpdateImported === null) return new Date("1970-01-01");
        else return lastChorusUpdateImported.data;
    }

    public async setChorusLastUpdateImportes(lastUpdateImported: Date) {
        await configurationsService.setChorusLastUpdateImported(lastUpdateImported);
    }

    public async updatePaymentsFlatCollection() {
        const { programs, ministries, domainesFonct, refsProgrammation } = await this.getAllDataBretagneData();

        const lastChorusUpdateImported = await this.getChorusLastUpdateImported();
        const chorusCursor = chorusService.chorusCursorFindIndexedData(lastChorusUpdateImported);
        let document = await chorusCursor.next();
        let newChorusLastUpdate = lastChorusUpdateImported;

        while (document != null) {
            document > newChorusLastUpdate.getTimestamp() ? (newChorusLastUpdate = document._id) : null;

            const paymentFlatEntity = PaymentFlatAdapter.toPaymentFlatEntity(
                document.indexedInformations,
                programs,
                ministries,
                domainesFonct,
                refsProgrammation,
            );

            paymentFlatPort.insertOne(paymentFlatEntity);

            document = await chorusCursor.next();
        }

        this.setChorusLastObjectId(newChorusLastUpdate);
    }
}

const paymentFlatService = new PaymentFlatService();
export default paymentFlatService;
