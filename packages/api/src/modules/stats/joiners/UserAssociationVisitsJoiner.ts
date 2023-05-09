import db from "../../../shared/MongoConnection";
import UserDbo from "../../user/repositories/dbo/UserDbo";
import userRepository from "../../user/repositories/user.repository";
import { UserWithAssociationVistitsEntity } from "../entities/UserWithAssociationVisitsEntity";
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

    findUsersWithAssociationVisits(includesAdmin = false) {
        return this.userCollection
            .aggregate<UserWithAssociationVistitsEntity>([
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
    }

    findAssociationVisitsOnPeriodGroupedByUsers(start: Date, end: Date, includesAdmin = false) {
        return this.userCollection
            .aggregate<UserWithAssociationVistitsEntity>([
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
