import { ObjectId } from "mongodb";
import statsAssociationsVisitPort from "../../dataProviders/db/stats/statsAssociationsVisit.port";
import logsPort from "../../dataProviders/db/stats/stats.port";
import AssociationVisitEntity from "./entities/AssociationVisitEntity";

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
        return logsPort.getLogsOnPeriod(start, end).map(log => {
            if (log.meta.req?.body?.email) delete log.meta.req.body.email;
            if (log.meta.req?.body?.firstName) delete log.meta.req.body.firstName;
            if (log.meta.req?.body?.lastName) delete log.meta.req.body.lastName;
            if (log.meta.req?.body?.phoneNumber) delete log.meta.req.body.phoneNumber;
            if (log.meta.req?.user) {
                // userId is needed for joins with another table, but is saved as a string because of a dependency bug
                log.meta.req.userId = new ObjectId(log.meta.req.user._id);
                delete log.meta.req.user;
            }

            return log;
        });
    }

    getAssociationsVisitsOnPeriod(start: Date, end: Date) {
        return statsAssociationsVisitPort.findOnPeriod(start, end);
    }
}

const statsService = new StatsService();

export default statsService;
