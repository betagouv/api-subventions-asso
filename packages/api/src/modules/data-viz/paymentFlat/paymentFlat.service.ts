import { ObjectId, WithId } from "mongodb"; // Import the ObjectId type
import paymentFlatPort from "../../../dataProviders/db/paymentFlat/paymentFlat.port";
import dataBretagneService from "../../providers/dataBretagne/dataBretagne.service";
import chorusService from "../../providers/chorus/chorus.service";
import ChorusLineEntity from "../../providers/chorus/entities/ChorusLineEntity";
import MinistryEntity from "../../../entities/MinistryEntity";
import StateBudgetProgramEntity from "../../../entities/StateBudgetProgramEntity";
import DomaineFonctionnelEntity from "../../../entities/DomaineFonctionnelEntity";
import RefProgrammationEntity from "../../../entities/RefProgrammationEntity";
import PaymentFlatAdapter from "./paymentFlatAdapter";

export class PaymentFlatService {
    private async getAllDataBretagneData() {
        const ministries = await dataBretagneService.getMinistriesRecord();
        const programs = await dataBretagneService.findProgramsRecord();
        const domainesFonct = await dataBretagneService.getDomaineFonctRecord();
        const refsProgrammation = await dataBretagneService.getRefProgrammationRecord();

        return { programs, ministries, domainesFonct, refsProgrammation };
    }

    private async getDocumentDataBregagneData(
        document: WithId<ChorusLineEntity>,
        programs: Record<string, StateBudgetProgramEntity>,
        ministries: Record<string, MinistryEntity>,
        domainesFonct: Record<string, DomaineFonctionnelEntity>,
        refsProgrammation: Record<string, RefProgrammationEntity>,
    ) {
        const programCode = document.indexedInformations.codeDomaineFonctionnel?.slice(1, 4);
        const activityCode = document.indexedInformations.codeActivitee?.slice(-12);
        const actionCode = document.indexedInformations.codeDomaineFonctionnel;

        const program = programCode ? programs[programCode] : undefined;
        const ministry = program ? ministries[program.code_ministere] : undefined;
        const domaineFonct = domainesFonct[actionCode ?? ""];
        const refProgrammation = refsProgrammation[activityCode ?? ""];

        // est-ce que ça peut valoir la peine de faire une interface qui regroupe ces 4 objets ?
        // verification de la jointure ?

        // faire Mattermonst ticket

        return { program, ministry, domaineFonct, refProgrammation };
    }

    public async upDatePaymentsFlatCollection(lastChorusObjectId: ObjectId) {
        const { programs, ministries, domainesFonct, refsProgrammation } = await this.getAllDataBretagneData();

        const chorusCursor = await chorusService.chorusCursorFind({ _id: { $gt: lastChorusObjectId } });
        let document = await chorusCursor.next();

        let newChorusLastUpdate = lastChorusObjectId;

        while (document != null) {
            document._id.getTimestamp() > newChorusLastUpdate.getTimestamp()
                ? (newChorusLastUpdate = document._id)
                : null; // ça va pas marcher ça vérifie

            const { program, ministry, domaineFonct, refProgrammation } = await this.getDocumentDataBregagneData(
                document,
                programs,
                ministries,
                domainesFonct,
                refsProgrammation,
            );

            // TO DO : check validity of the program, ministry, domaineFonct and refProgrammation and register data somewhere

            const paymentFlatEntity = PaymentFlatAdapter.toPaymentFlatEntity(
                document.indexedInformations,
                programs,
                ministry,
                domaineFonct,
                refProgrammation,
            );

            paymentFlatPort.insertOne(paymentFlatEntity);

            document = await chorusCursor.next();
        }

        return newChorusLastUpdate;
    }
}
