import db from "../../../shared/MongoConnection";
import userRepository from "../../user/repositories/user.repository";
import { UserWithAssociationVistitsEntity } from "../entities/UserWithAssociationVisitsEntity";
import statsAssociationsVisitRepository from "../repositories/statsAssociationsVisit.repository";

export class UserAssociationVisitJoiner {
    userCollection = db.collection(userRepository.collectionName);

    findAssociationVisitsOnPeriodGroupedByUsers(start: Date, end: Date, includesAdmin = false) {
        return this.userCollection
            .aggregate<UserWithAssociationVistitsEntity>([
                {
                    $match: {
                        ...(includesAdmin
                            ? {}
                            : {
                                  roles: {
                                      $ne: "admin"
                                  }
                              })
                    }
                },
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
                                        $lte: end
                                    }
                                }
                            }
                        ]
                    }
                }
            ])
            .toArray();
    }
}

const userAssociationVisitJoiner = new UserAssociationVisitJoiner();

export default userAssociationVisitJoiner;
