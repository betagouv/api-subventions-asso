import { DefaultObject } from "../../../@types";
import db from "../../../shared/MongoConnection";
import { removeSecrets } from "../../../shared/helpers/PortHelper";
import userPort from "../../../dataProviders/db/user/user.port";
import { UserWithAssociationVisitsEntity } from "../entities/UserWithAssociationVisitsEntity";
import statsAssociationsVisitPort from "../../../dataProviders/db/stats/statsAssociationsVisit.port";

export class UserAssociationVisitJoiner {
    userCollection = db.collection(userPort.collectionName);

    excludeAdmins() {
        return {
            $match: {
                roles: {
                    $ne: "admin",
                },
            },
        };
    }

    async findUsersWithAssociationVisits(includesAdmin: boolean) {
        const query: DefaultObject[] = [
            {
                $lookup: {
                    from: statsAssociationsVisitPort.collectionName,
                    localField: userPort.joinIndexes.associationVisits,
                    foreignField: statsAssociationsVisitPort.joinIndexes.user,
                    as: "associationVisits",
                },
            },
        ];

        if (!includesAdmin) {
            query.unshift(this.excludeAdmins());
        }

        const users = await this.userCollection.aggregate<UserWithAssociationVisitsEntity>(query).toArray();

        return users.map(user => removeSecrets(user));
    }

    findAssociationVisitsOnPeriodGroupedByUsers(start: Date, end: Date) {
        return this.userCollection
            .aggregate<UserWithAssociationVisitsEntity>([
                this.excludeAdmins(),
                {
                    $lookup: {
                        from: statsAssociationsVisitPort.collectionName,
                        let: { joinId: `$${userPort.joinIndexes.associationVisits}` },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: [`$${statsAssociationsVisitPort.joinIndexes.user}`, "$$joinId"],
                                            },
                                            { $gte: ["$date", start] },
                                            { $lte: ["$date", end] },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: "associationVisits",
                    },
                },
            ])
            .toArray();
    }
}

const userAssociationVisitJoiner = new UserAssociationVisitJoiner();

export default userAssociationVisitJoiner;
