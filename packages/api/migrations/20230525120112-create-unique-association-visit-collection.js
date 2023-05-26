const { connectDB } = require("../build/src/shared/MongoConnection");

module.exports = {
    async up(db) {
        await connectDB();

        const visitsByAssociation = await db
            .collection("stats-association-visits")
            .aggregate([
                {
                    $group: {
                        _id: "$associationIdentifier",
                        visits: { $addToSet: "$$ROOT" },
                    },
                },
            ])
            .toArray();

        const groupVisitByUser = (result, visit) => {
            var name = visit.userId;
            var group = result[name] || (result[name] = []);
            group.push(visit);
            return result;
        };

        const keepOneUserVisitByDay = userVisits => {
            let yourDate = new Date();
            yourDate.toISOString().split("T")[0];

            return userVisits.reduce((result, visit) => {
                // assume that user do requests between 8am and 18pm and do not care about timezone (possibly -2 hours on the server)
                var date = new Date(visit.date).toISOString().split("T")[0];
                // keep first visit we find, we do not care about time of the day
                if (!result[date]) result[date] = visit;
                return result;
            }, {});
        };

        /**
         * array of associations visits grouped ny day
         * [
         *  {
         *      identifier: 'W332028031',
         *      visits: [ { '2023-03-16': AssociationVisitEntity[] }, { '2023-04-05': AssociationVisitEntity[] } ]
         *  },
         *  {}...
         * ]
         */
        const associationsVisitsByDay = visitsByAssociation.map(associationVisits => {
            const identifier = associationVisits._id;
            const visitsGroupByUser = associationVisits.visits.reduce(groupVisitByUser, {});
            const keepOneVisitByUser = Object.values(visitsGroupByUser).map(keepOneUserVisitByDay);
            return { identifier, visits: keepOneVisitByUser };
        });

        await db.collection("unique-association-visit-by-day").createIndex({ identifier: 1 }, { unique: true });
        await db.collection("unique-association-visit-by-day").insertMany(associationsVisitsByDay);
        console.log("DB created");
    },
};
