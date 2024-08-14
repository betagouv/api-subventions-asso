import { ObjectId } from "mongodb";
import paymentFlatPort from "../../../dataProviders/db/paymentFlat/paymentFlat.port";
import dataBretagneService from "../../providers/dataBretagne/dataBretagne.service";
import chorusService from "../../providers/chorus/chorus.service";
import PaymentFlatAdapter from "./paymentFlatAdapter";

export class PaymentFlatService {
    private async getAllDataBretagneData() {
        const ministries = await dataBretagneService.getMinistriesRecord();
        const programs = await dataBretagneService.findProgramsRecord();
        const domainesFonct = await dataBretagneService.getDomaineFonctRecord();
        const refsProgrammation = await dataBretagneService.getRefProgrammationRecord();
        return { programs, ministries, domainesFonct, refsProgrammation };
    }

    public async updatePaymentsFlatCollection(lastChorusObjectId: ObjectId) {
        const { programs, ministries, domainesFonct, refsProgrammation } = await this.getAllDataBretagneData();

        const chorusCursor = chorusService.chorusCursorFindIndexedData(lastChorusObjectId);
        let document = await chorusCursor.next();
        let newChorusLastUpdate = lastChorusObjectId;

        while (document != null) {
            document._id.getTimestamp() > newChorusLastUpdate.getTimestamp()
                ? (newChorusLastUpdate = document._id)
                : null;

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

        return newChorusLastUpdate;
    }
}

const paymentFlatService = new PaymentFlatService();
export default paymentFlatService;
