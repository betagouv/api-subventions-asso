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

    public async getChorusLastUpdateImported() {
        const lastChorusUpdateImported = await configurationsService.getChorusLastUpdateImportedToPaymentFlat();
        return !lastChorusUpdateImported ? new Date("1970-01-01") : lastChorusUpdateImported.data; // default date to 1970-01-01 allow to take into account all data
    }

    public async setChorusLastUpdateImported(lastUpdateImported: Date) {
        await configurationsService.setChorusLastUpdateImportedToPaymentFlat(lastUpdateImported);
    }

    public async updatePaymentsFlatCollection() {
        const { programs, ministries, domainesFonct, refsProgrammation } = await this.getAllDataBretagneData();

        const lastChorusUpdateImported = await this.getChorusLastUpdateImported();
        const chorusCursor = chorusService.cursorFindData(lastChorusUpdateImported);
        let document = await chorusCursor.next();
        let newChorusLastUpdate = lastChorusUpdateImported;
        const promises: Promise<void>[] = [];
        while (document != null) {
            if (document.updated > newChorusLastUpdate) {
                newChorusLastUpdate = document.updated;
            }
            const paymentFlatEntity = PaymentFlatAdapter.toPaymentFlatEntity(
                document,
                programs,
                ministries,
                domainesFonct,
                refsProgrammation,
            );

            promises.push(paymentFlatPort.upsertOne(paymentFlatEntity));

            document = await chorusCursor.next();
        }

        promises.push(this.setChorusLastUpdateImported(newChorusLastUpdate));
        await Promise.all(promises);
    }
}

const paymentFlatService = new PaymentFlatService();
export default paymentFlatService;
