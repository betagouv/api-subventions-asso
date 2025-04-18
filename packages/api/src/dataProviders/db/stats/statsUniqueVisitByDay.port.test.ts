import VisitsGroupByAssociation from "./__fixtures__/VisitsGroupByAssociationIdentifier.json";
import statsAssociationsVisitPort from "./statsAssociationsVisit.port";
import statsUniqueVisitByDay, { groupVisitByUser, keepOneUserVisitByDay } from "./statsUniqueVisitByDay.port";

jest.mock("../../../shared/MongoConnection", () => ({
    collection: () => ({
        insertMany: jest.fn(),
    }),
}));

const associationVisits = VisitsGroupByAssociation;
const associationWithManyUsers = associationVisits[2];

describe("StatsUniqueVisitByDay Port", () => {
    describe("groupVisitByUser()", () => {
        it("should group by users", () => {
            const actual = associationWithManyUsers.visits.reduce(groupVisitByUser, {});
            expect(actual).toMatchSnapshot();
        });
    });

    describe("keepOneUserVisitByDay()", () => {
        it("should keep one visit by day", () => {
            const associationVisitsGroupByUser = associationWithManyUsers.visits.reduce(groupVisitByUser, {});
            const actual = Object.values(associationVisitsGroupByUser).map(keepOneUserVisitByDay);
            expect(actual).toMatchSnapshot();
        });
    });

    describe("_reduceToOneVisitByDayByUser()", () => {
        it("should return unique visits by user by day ", async () => {
            const actual = await statsUniqueVisitByDay._reduceToOneVisitByDayByUser(associationVisits);
            expect(actual).toMatchSnapshot();
        });
    });

    describe("createCollectionFromStatsAssociationVisits()", () => {
        it("should call statsAssociationsVisitPort", async () => {
            const mockFindGroupedByAssociationIdentifier = jest
                .spyOn(statsAssociationsVisitPort, "findGroupedByAssociationIdentifier")
                //@ts-expect-error: mock
                .mockImplementation(async () => associationVisits);

            await statsUniqueVisitByDay.createCollectionFromStatsAssociationVisits(),
                expect(mockFindGroupedByAssociationIdentifier).toHaveBeenCalledTimes(1);
        });

        it("should call _reduceToOneVisitByDayByUser()", async () => {
            const spyReduceToOneVisitByDayByUser = jest.spyOn(statsUniqueVisitByDay, "_reduceToOneVisitByDayByUser");

            await statsUniqueVisitByDay.createCollectionFromStatsAssociationVisits(),
                expect(spyReduceToOneVisitByDayByUser).toHaveBeenCalledWith(associationVisits);
        });
    });
});
