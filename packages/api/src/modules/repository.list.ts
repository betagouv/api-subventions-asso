import rnaSirenRepository from "./_open-data/rna-siren/repositories/rnaSiren.repository";
import associationNameRepository from "./association-name/repositories/associationName.repository";
import configurationsRepository from "./configurations/repositories/configurations.repository";
import chorusLineRepository from "./providers/chorus/repositories/chorus.line.repository";
import dauphinGisproRepository from "./providers/dauphin/repositories/dauphin-gispro.repository";
import demarchesSimplifieesDataRepository from "./providers/demarchesSimplifiees/repositories/demarchesSimplifieesData.repository";
import demarchesSimplifieesMapperRepository from "./providers/demarchesSimplifiees/repositories/demarchesSimplifieesMapper.repository";
import fonjepSubventionRepository from "./providers/fonjep/repositories/fonjep.subvention.repository";
import fonjepVersementRepository from "./providers/fonjep/repositories/fonjep.versement.repository";
import leCompteAssoRepository from "./providers/leCompteAsso/repositories/leCompteAsso.repository";
import {
    osirisActionRepository,
    osirisEvaluationRepository,
    osirisRequestRepository,
} from "./providers/osiris/repositories";
import miscScdlEditorsRepository from "./providers/scdl/misc-scdl-editors.repository";
import miscScdlDataRepository from "./providers/scdl/miscScdlData.repository";
import statsRepository from "./stats/repositories/stats.repository";
import statsAssociationsVisitRepository from "./stats/repositories/statsAssociationsVisit.repository";
import consumerTokenRepository from "./user/repositories/consumer-token.repository";
import userResetRepository from "./user/repositories/user-reset.repository";
import userRepository from "./user/repositories/user.repository";

export const repositoriesWithIndexes = [
    userRepository,
    statsRepository,
    userResetRepository,
    rnaSirenRepository,
    osirisRequestRepository,
    osirisActionRepository,
    osirisEvaluationRepository,
    fonjepVersementRepository,
    fonjepSubventionRepository,
    dauphinGisproRepository,
    leCompteAssoRepository,
    miscScdlDataRepository,
    miscScdlEditorsRepository,
    configurationsRepository,
    consumerTokenRepository,
    associationNameRepository,
    chorusLineRepository,
    demarchesSimplifieesDataRepository,
    demarchesSimplifieesMapperRepository,
    statsAssociationsVisitRepository,
];
