import { ObjectId } from "mongodb";
import statsAssociationsVisitPort from "../../dataProviders/db/stats/statsAssociationsVisit.port";
import logsPort from "../../dataProviders/db/stats/logs.port";
import AssociationVisitEntity from "./entities/AssociationVisitEntity";
import { WinstonLog } from "../../@types/WinstonLog";

class StatsService {
    addAssociationVisit(visit: AssociationVisitEntity) {
        return statsAssociationsVisitPort.add(visit);
    }

    getUserLastSearchDate(userId) {
        return statsAssociationsVisitPort.getLastSearchDate(userId);
    }

    getAllVisitsUser(userId: string) {
        return statsAssociationsVisitPort.findByUserId(userId);
    }

    getAllLogUser(email: string) {
        return logsPort.findByEmail(email);
    }

    getAnonymizedLogsOnPeriod(start: Date, end: Date) {
        const cursor = logsPort.getLogsOnPeriod(start, end);
        return cursor.map(log => {
            const logToAnonymize: WinstonLog & { meta: { req: { userId?: ObjectId } } } = { ...log };
            if (logToAnonymize.meta.req?.body?.email) delete logToAnonymize.meta.req.body.email;
            if (logToAnonymize.meta.req?.body?.firstName) delete logToAnonymize.meta.req.body.firstName;
            if (logToAnonymize.meta.req?.body?.lastName) delete logToAnonymize.meta.req.body.lastName;
            if (logToAnonymize.meta.req?.body?.phoneNumber) delete logToAnonymize.meta.req.body.phoneNumber;

            if (logToAnonymize.meta.req?.user) {
                // userId is needed for joins with another table, but is saved as a string because of a dependency bug
                logToAnonymize.meta.req.userId = new ObjectId(logToAnonymize.meta.req.user._id);
                delete logToAnonymize.meta.req.user;
                return logToAnonymize;
            } else {
                return logToAnonymize;
            }
        });
    }

    getAssociationsVisitsOnPeriod(start: Date, end: Date) {
        return statsAssociationsVisitPort.findOnPeriod(start, end);
    }

    doStuff() {
        return {};
    }
}

const statsService = new StatsService();

export default statsService;
