import db from "../../../shared/MongoConnection";
import { removeSecrets } from "../../../shared/helpers/RepositoryHelper";
import userRepository from "../../user/repositories/user.repository";
import { UserWithAssociationVisitsEntity } from "../entities/UserWithAssociationVisitsEntity";
import statsAssociationsVisitRepository from "../repositories/statsAssociationsVisit.repository";

export class UserAssociationVisitJoiner {
    userCollection = db.collection(userRepository.collectionName);

    matchIncludesAdmin(includesAdmin) {
        return {
            $match: {
                ...(includesAdmin
                    ? {}
                    : {
                          roles: {
                              $ne: "admin",
                          },
                      }),
            },
        };
    }

    async findUsersWithAssociationVisits(includesAdmin = false) {
        const users = await this.userCollection
            .aggregate<UserWithAssociationVisitsEntity>([
                this.matchIncludesAdmin(includesAdmin),
                {
                    $lookup: {
                        from: statsAssociationsVisitRepository.collectionName,
                        localField: userRepository.joinIndexes.associationVisits,
                        foreignField: statsAssociationsVisitRepository.joinIndexes.user,
                        as: "associationVisits",
                    },
                },
            ])
            .toArray();

        return users.map(user => removeSecrets(user));
    }

    findAssociationVisitsOnPeriodGroupedByUsers(start: Date, end: Date, includesAdmin = false) {
        return this.userCollection
            .aggregate<UserWithAssociationVisitsEntity>([
                this.matchIncludesAdmin(includesAdmin),
                {
                    $lookup: {
                        from: statsAssociationsVisitRepository.collectionName,
                        localField: userRepository.joinIndexes.associationVisits,
                        foreignField: statsAssociationsVisitRepository.joinIndexes.user,
                        as: "associationVisits",
                        let: { visitDate: "$date" },
                        pipeline: [
                            {
                                $match: {
                                    visitDate: {
                                        $gte: start,
                                        $lte: end,
                                    },
                                },
                            },
                        ],
                    },
                },
            ])
            .toArray();
    }
}

const userAssociationVisitJoiner = new UserAssociationVisitJoiner();

export default userAssociationVisitJoiner;
