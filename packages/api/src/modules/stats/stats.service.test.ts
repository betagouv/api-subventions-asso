const mockIsUserActif = jest.fn();

jest.mock("../../shared/helpers/UserHelper", () => {
    return {
        __esModule: true, // this property makes it work
        isUserActif: mockIsUserActif,
    };
});

import statsService from "./stats.service";
import * as DateHelper from "../../shared/helpers/DateHelper";
import associationNameService from "../association-name/associationName.service";
import logsPort from "../../dataProviders/db/stats/stats.port";
import statsAssociationsVisitPort from "../../dataProviders/db/stats/statsAssociationsVisit.port";
import AssociationVisitEntity from "./entities/AssociationVisitEntity";
import userPort from "../../dataProviders/db/user/user.port";
import UserDbo from "../../dataProviders/db/user/UserDbo";
import { UserDto } from "dto";
import userAssociationVisitJoiner from "../../dataProviders/db/stats/UserAssociationVisits.joiner";
import { UserWithAssociationVisitsEntity } from "./entities/UserWithAssociationVisitsEntity";
import { ObjectId } from "mongodb";
import userStatsService from "../user/services/stats/user.stats.service";
import rnaSirenService from "../rna-siren/rnaSiren.service";
import RnaSirenEntity from "../../entities/RnaSirenEntity";
import GroupAssociationVisits from "./@types/GroupAssociationVisits";
import Rna from "../../valueObjects/Rna";
import Siren from "../../valueObjects/Siren";
import associationIdentifierService from "../association-identifier/association-identifier.service";
import AssociationIdentifier from "../../valueObjects/AssociationIdentifier";

describe("StatsService", () => {});
