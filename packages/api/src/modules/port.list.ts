import rnaSirenPort from "../dataProviders/db/rnaSiren/rnaSiren.port";
import uniteLegalEntreprisePort from "../dataProviders/db/uniteLegalEntreprise/uniteLegalEntreprise.port";
import uniteLegalImportsPort from "../dataProviders/db/uniteLegalImports/uniteLegalImports.port";
import uniteLegalNamePort from "../dataProviders/db/uniteLegalName/uniteLegalName.port";
import configurationsPort from "../dataProviders/db/configurations/configurations.port";
import statsPort from "../dataProviders/db/stats/stats.port";
import statsAssociationsVisitPort from "../dataProviders/db/stats/statsAssociationsVisit.port";
import userResetPort from "../dataProviders/db/user/user-reset.port";
import userPort from "../dataProviders/db/user/user.port";
import consumerTokenPort from "../dataProviders/db/user/consumer-token.port";
import chorusLinePort from "../dataProviders/db/providers/chorus/chorus.line.port";
import dauphinGisproPort from "../dataProviders/db/providers/dauphin/dauphin-gispro.port";
import demarchesSimplifieesDataPort from "../dataProviders/db/providers/demarchesSimplifiees/demarchesSimplifieesData.port";
import demarchesSimplifieesMapperPort from "../dataProviders/db/providers/demarchesSimplifiees/demarchesSimplifieesMapper.port";
import fonjepSubventionPort from "../dataProviders/db/providers/fonjep/fonjep.subvention.port";
import fonjepPaymentPort from "../dataProviders/db/providers/fonjep/fonjep.payment.port";
import paymentFlatPort from "../dataProviders/db/paymentFlat/paymentFlat.port";
import { osirisActionPort, osirisEvaluationPort, osirisRequestPort } from "../dataProviders/db/providers/osiris";
import miscScdlGrantPort from "../dataProviders/db/providers/scdl/miscScdlGrant.port";
import miscScdlProducerPort from "../dataProviders/db/providers/scdl/miscScdlProducer.port";

export const portsWithIndexes = [
    userPort,
    statsPort,
    userResetPort,
    osirisRequestPort,
    osirisActionPort,
    osirisEvaluationPort,
    fonjepPaymentPort,
    fonjepSubventionPort,
    dauphinGisproPort,
    miscScdlGrantPort,
    miscScdlProducerPort,
    configurationsPort,
    consumerTokenPort,
    chorusLinePort,
    demarchesSimplifieesDataPort,
    demarchesSimplifieesMapperPort,
    statsAssociationsVisitPort,
    rnaSirenPort,
    uniteLegalEntreprisePort,
    uniteLegalImportsPort,
    uniteLegalNamePort,
    paymentFlatPort,
];