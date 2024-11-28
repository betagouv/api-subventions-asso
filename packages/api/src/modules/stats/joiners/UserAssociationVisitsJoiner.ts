import { DefaultObject } from "../../../@types";
import db from "../../../shared/MongoConnection";
import { removeSecrets } from "../../../shared/helpers/RepositoryHelper";
import userRepository from "../../../dataProviders/db/user/user.port";
import { UserWithAssociationVisitsEntity } from "../entities/UserWithAssociationVisitsEntity";
import statsAssociationsVisitRepository from "../../../dataProviders/db/stats/statsAssociationsVisit.port";

export class UserAssociationVisitJoiner {
    userCollection = db.collection(userRepository.collectionName);

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
                    from: statsAssociationsVisitRepository.collectionName,
                    localField: userRepository.joinIndexes.associationVisits,
                    foreignField: statsAssociationsVisitRepository.joinIndexes.user,
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
                        from: statsAssociationsVisitRepository.collectionName,
                        let: { joinId: `$${userRepository.joinIndexes.associationVisits}` },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: [
                                                    `$${statsAssociationsVisitRepository.joinIndexes.user}`,
                                                    "$$joinId",
                                                ],
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
