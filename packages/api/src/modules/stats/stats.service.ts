import { ObjectId } from "mongodb";
import statsAssociationsVisitPort from "../../dataProviders/db/stats/statsAssociationsVisit.port";
import logsPort from "../../dataProviders/db/stats/logs.port";
import AssociationVisitEntity from "./entities/AssociationVisitEntity";
import { WinstonLog } from "../../@types/WinstonLog";
import RouteTypesEnum from "./@types/RouteTypesEnum";
import { groupByKeyFactory } from "../../shared/helpers/ArrayHelper";
import userCrudService from "../user/services/crud/user.crud.service";

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

    /**
     * Update this method each time a new open-data route is created / updated
     * @returns Map of [route, regexp] to be used to count routes use
     */
    private getOpenDataRegExpMap() {
        const openDataPrefix = "/open-data";
        const rnaSirenPrefix = openDataPrefix + "/rna-siren";
        const providerPrefix = openDataPrefix + "/fournisseurs";
        const grantsPrefix = openDataPrefix + "/subventions";

        return new Map<string, RegExp>([
            [rnaSirenPrefix, new RegExp(`^${rnaSirenPrefix}`)],
            [providerPrefix, new RegExp(`^${providerPrefix}$`)],
            [`${providerPrefix}/historique`, new RegExp(`^${providerPrefix}/historique`)],
            [`${grantsPrefix}/etablissement`, new RegExp(`^${grantsPrefix}/etablissement`)],
            [`${grantsPrefix}/association`, new RegExp(`^${grantsPrefix}/association`)],
            [`${grantsPrefix}/structure`, new RegExp(`^${grantsPrefix}/structure`)],
        ]);
    }

    /**
     * Update this method each time a new association route is created / updated
     * @returns Map of [route, regexp] to be used to count routes use
     */
    private getAssociationRegExpMap() {
        const associationPrefix = "/association";

        return new Map<string, RegExp>([
            [`${associationPrefix}/:id`, new RegExp(`^${associationPrefix}/.[^/]*$`)],
            [`${associationPrefix}/:id/subventions`, new RegExp(`^${associationPrefix}/.[^/]*/subventions`)],
            [`${associationPrefix}/:id/versements`, new RegExp(`^${associationPrefix}/.[^/]*/versements`)],
            [`${associationPrefix}/:id/paiements`, new RegExp(`^${associationPrefix}/.[^/]*/paiements`)],
            [`${associationPrefix}/:id/applications`, new RegExp(`^${associationPrefix}/.[^/]*/applications`)],
            [`${associationPrefix}/:id/grants`, new RegExp(`^${associationPrefix}/.[^/]*/grants$`)],
            [`${associationPrefix}/:id/grants/v2`, new RegExp(`^${associationPrefix}/.[^/]*/grants/v2`)],
            [`${associationPrefix}/:id/grants/csv`, new RegExp(`^${associationPrefix}/.[^/]*/grants/csv`)],
            [`${associationPrefix}/:id/raw-grants`, new RegExp(`^${associationPrefix}/.[^/]*/raw-grants`)],
            [`${associationPrefix}/:id/documents`, new RegExp(`^${associationPrefix}/.[^/]*/documents`)],
            [`${associationPrefix}/:id/etablissements`, new RegExp(`^${associationPrefix}/.[^/]*/etablissements`)],
            // omit /extract-data as it is hidden and only use by us
        ]);
    }

    /**
     * Update this method each time a new establishment route is created / updated
     * @returns Map of [route, regexp] to be used to count routes use
     */
    private getEstablishmentRegExpMap() {
        const establishmentPrefix = "/etablissement";

        return new Map<string, RegExp>([
            [`${establishmentPrefix}/:id`, new RegExp(`^${establishmentPrefix}/.[^/]*$`)],
            [`${establishmentPrefix}/:id/grants`, new RegExp(`^${establishmentPrefix}/.[^/]*/grants$`)],
            [`${establishmentPrefix}/:id/grants/v2`, new RegExp(`^${establishmentPrefix}/.[^/]*/grants/v2`)],
            [`${establishmentPrefix}/:id/subventions`, new RegExp(`^${establishmentPrefix}/.[^/]*/subventions`)],
            [`${establishmentPrefix}/:id/versements`, new RegExp(`^${establishmentPrefix}/.[^/]*/versements`)],
            [`${establishmentPrefix}/:id/paiements`, new RegExp(`^${establishmentPrefix}/.[^/]*/paiements`)],
            [`${establishmentPrefix}/:id/applications`, new RegExp(`^${establishmentPrefix}/.[^/]*/applications`)],
            [`${establishmentPrefix}/:id/documents`, new RegExp(`^${establishmentPrefix}/.[^/]*/documents$`)],
            [`${establishmentPrefix}/:id/documents/rib`, new RegExp(`^${establishmentPrefix}/.[^/]*/documents/rib`)],
            [`${establishmentPrefix}/:id/grants/csv`, new RegExp(`^${establishmentPrefix}/.[^/]*/grants/csv`)],
            // omit /extract-data as it is hidden and only use by us
        ]);
    }

    /**
     * Update this method each time a new search route is created / updated
     * @returns Map of [route, regexp] to be used to count routes use
     */
    private getSearchRegExpMap() {
        const searchPrefix = "/search";

        return new Map<string, RegExp>([
            [`${searchPrefix}/associations/:input`, new RegExp(`^${searchPrefix}/associations/`)],
        ]);
    }

    /**
     * Update this method each time a new document route is created / updated
     * @returns Map of [route, regexp] to be used to count routes use
     */
    private getDocumentRegExpMap() {
        const documentPrefix = "/document";

        return new Map<string, RegExp>([
            [`${documentPrefix}/downloads`, new RegExp(`^${documentPrefix}/downloads$`)],
            [`${documentPrefix}/downloads/:id`, new RegExp(`^${documentPrefix}/downloads/`)],
            [`${documentPrefix}/:id`, new RegExp(`^${documentPrefix}/(?!downloads)`)],
        ]);
    }

    /**
     * Update this method each time a new deposit scdl process route is created / updated
     * @returns Map of [route, regexp] to be used to count routes use
     */
    private getDepositScdlProcessRegExpMap() {
        const depositScdlPrefix = "/parcours-depot";

        return new Map<string, RegExp>([
            [depositScdlPrefix, new RegExp(`^${depositScdlPrefix}$`)],
            [`${depositScdlPrefix}/donnees-existantes`, new RegExp(`^${depositScdlPrefix}/donnees-existantes`)],
            [
                `${depositScdlPrefix}/fichier-depose/url-de-telechargement`,
                new RegExp(`^${depositScdlPrefix}/fichier-depose/url-de-telechargement`),
            ],
            [
                `${depositScdlPrefix}/validation-fichier-scdl`,
                new RegExp(`^${depositScdlPrefix}/validation-fichier-scdl`),
            ],
            [`${depositScdlPrefix}/depot-fichier-scdl`, new RegExp(`^${depositScdlPrefix}/depot-fichier-scdl`)],
            // omit @patch /step/{step} as not interesting as a statistique
        ]);
    }

    private getRouteStatBuilder(regexpMap: Map<string, RegExp>) {
        return (urls: string[]) => {
            const initialResult = {};

            return urls.reduce((acc, url) => {
                for (const [route, regexp] of regexpMap) {
                    if (regexp.test(url)) {
                        if (acc[route]) acc[route]++;
                        else acc[route] = 1;
                        break;
                    }
                }
                return acc;
            }, initialResult);
        };
    }

    private getRouteRegExpMap(routeType: RouteTypesEnum) {
        // omit dataviz routes as it is never used
        // omit consumer and admin as it is only used by us
        // omit admin structure as it is only used to build the front
        // omit configurations and authentication as it is not relevant here
        switch (routeType) {
            case "association":
                return this.getAssociationRegExpMap();
            case "etablissement":
                return this.getEstablishmentRegExpMap();
            case "parcours-depot":
                return this.getDepositScdlProcessRegExpMap();
            case "document":
                return this.getDocumentRegExpMap();
            case "search":
                return this.getSearchRegExpMap();
            case "open-data":
                return this.getOpenDataRegExpMap();
            default:
                throw new Error(`No RegExp Map for the route type ${routeType}`);
        }
    }

    private groupConsumptionsByUser(
        consumptions: {
            userId: string;
            year: string;
            month: string;
            routes: Record<string, string[]>;
        }[],
    ) {
        return consumptions.reduce(groupByKeyFactory("userId"), {}) as Record<
            string,
            { year: string; month: string; routes: Record<string, string[]> }[]
        >;
    }

    private groupUserConsumptionsByYear(
        consumptions: { year: string; month: string; routes: Record<string, string[]> }[],
    ) {
        return consumptions.reduce(groupByKeyFactory("year"), {}) as Record<
            string,
            { month: string; routes: Record<string, string[]> }[]
        >;
    }

    private computeSubRouteStats(routes: Record<RouteTypesEnum, string[]>) {
        const result = {};
        for (const subRoute in routes) {
            result[subRoute] = this.getRouteStatBuilder(this.getRouteRegExpMap(subRoute as RouteTypesEnum))(
                routes[subRoute],
            );
        }
        return result as Record<RouteTypesEnum, Record<string, number>>;
    }

    private formatConsumption(
        consumptions: {
            userId: string;
            year: string;
            month: string;
            routes: Record<RouteTypesEnum, string[]>;
        }[],
    ): Record<string, string[]> {
        const consumptionByUser = this.groupConsumptionsByUser(consumptions);

        const result = {};
        for (const userId in consumptionByUser) {
            result[userId] = {};
            const userConsumptionByYear = this.groupUserConsumptionsByYear(consumptionByUser[userId]);
            for (const year in userConsumptionByYear) {
                result[userId][year] = userConsumptionByYear[year].reduce((acc, monthConsumption) => {
                    acc = Object.assign(acc, {
                        [monthConsumption.month]: this.computeSubRouteStats(monthConsumption.routes),
                    });
                    return acc;
                }, {});
            }
        }

        return result;
    }

    async getConsumersConsumption() {
        const consumers = await userCrudService.getConsumers();
        const consumption = await logsPort.getConsumption(consumers.map(user => user._id.toString()));
        const consumptionByUserId = this.formatConsumption(consumption);
        const consumptionByEmail = {};
        for (const consumerId in consumptionByUserId) {
            const consumer = consumers.find(consumer => consumer._id.toString() === consumerId);
            consumptionByEmail[consumer!.email] = consumptionByUserId[consumerId];
        }
        return consumptionByEmail;
    }
}

const statsService = new StatsService();

export default statsService;
