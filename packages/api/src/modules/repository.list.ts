import rnaSirenPort from "../dataProviders/db/rnaSiren/rnaSiren.port";
import uniteLegalEntreprisePort from "../dataProviders/db/uniteLegalEntreprise/uniteLegalEntreprise.port";
import uniteLegalImportsPort from "../dataProviders/db/uniteLegalImports/uniteLegalImports.port";
import uniteLegalNamePort from "../dataProviders/db/uniteLegalName/uniteLegalName.port";
import configurationsRepository from "../dataProviders/db/configurations/configurations.port";
import statsRepository from "../dataProviders/db/stats/stats.port";
import statsAssociationsVisitRepository from "../dataProviders/db/stats/statsAssociationsVisit.port";
import userResetRepository from "../dataProviders/db/user/user-reset.port";
import userRepository from "../dataProviders/db/user/user.port";
import consumerTokenRepository from "../dataProviders/db/user/consumer-token.port";
import chorusLineRepository from "../dataProviders/db/providers/chorus/chorus.line.port";
import dauphinGisproRepository from "../dataProviders/db/providers/dauphin/dauphin-gispro.port";
import demarchesSimplifieesDataRepository from "../dataProviders/db/providers/demarchesSimplifiees/demarchesSimplifieesData.port";
import demarchesSimplifieesMapperRepository from "../dataProviders/db/providers/demarchesSimplifiees/demarchesSimplifieesMapper.port";
import fonjepSubventionRepository from "../dataProviders/db/providers/fonjep/fonjep.subvention.port";
import fonjepPaymentRepository from "../dataProviders/db/providers/fonjep/fonjep.payment.port";
import {
    osirisActionRepository,
    osirisEvaluationRepository,
    osirisRequestRepository,
} from "../dataProviders/db/providers/osiris";
import miscScdlGrantRepository from "../dataProviders/db/providers/scdl/miscScdlGrant.port";
import miscScdlProducerRepository from "../dataProviders/db/providers/scdl/miscScdlProducer.port";

export const repositoriesWithIndexes = [
    userRepository,
    statsRepository,
    userResetRepository,
    osirisRequestRepository,
    osirisActionRepository,
    osirisEvaluationRepository,
    fonjepPaymentRepository,
    fonjepSubventionRepository,
    dauphinGisproRepository,
    miscScdlGrantRepository,
    miscScdlProducerRepository,
    configurationsRepository,
    consumerTokenRepository,
    chorusLineRepository,
    demarchesSimplifieesDataRepository,
    demarchesSimplifieesMapperRepository,
    statsAssociationsVisitRepository,
    rnaSirenPort,
    uniteLegalEntreprisePort,
    uniteLegalImportsPort,
    uniteLegalNamePort,
];
