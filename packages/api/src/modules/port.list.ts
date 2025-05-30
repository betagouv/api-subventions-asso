import rnaSirenPort from "../dataProviders/db/rnaSiren/rnaSiren.port";
import uniteLegalEntreprisePort from "../dataProviders/db/uniteLegalEntreprise/uniteLegalEntreprise.port";
import uniteLegalNamePort from "../dataProviders/db/uniteLegalName/uniteLegalName.port";
import configurationsPort from "../dataProviders/db/configurations/configurations.port";
import logsPort from "../dataProviders/db/stats/logs.port";
import statsAssociationsVisitPort from "../dataProviders/db/stats/statsAssociationsVisit.port";
import userResetPort from "../dataProviders/db/user/user-reset.port";
import userPort from "../dataProviders/db/user/user.port";
import consumerTokenPort from "../dataProviders/db/user/consumer-token.port";
import chorusLinePort from "../dataProviders/db/providers/chorus/chorus.line.port";
import dauphinGisproPort from "../dataProviders/db/providers/dauphin/dauphin-gispro.port";
import demarchesSimplifieesDataPort from "../dataProviders/db/providers/demarchesSimplifiees/demarchesSimplifieesData.port";
import demarchesSimplifieesSchemaPort from "../dataProviders/db/providers/demarchesSimplifiees/demarchesSimplifieesSchema.port";
import fonjepSubventionPort from "../dataProviders/db/providers/fonjep/fonjep.subvention.port.old";
import fonjepPaymentPort from "../dataProviders/db/providers/fonjep/fonjep.payment.port.old";
import fonjepVersementsPort from "../dataProviders/db/providers/fonjep/fonjep.versements.port";
import fonjepPostesPort from "../dataProviders/db/providers/fonjep/fonjep.postes.port";
import fonjepTiersPort from "../dataProviders/db/providers/fonjep/fonjep.tiers.port";
import fonjepTypePostePort from "../dataProviders/db/providers/fonjep/fonjep.typePoste.port";
import fonjepDispositifPort from "../dataProviders/db/providers/fonjep/fonjep.dispositif.port";
import paymentFlatPort from "../dataProviders/db/paymentFlat/paymentFlat.port";
import { osirisActionPort, osirisRequestPort } from "../dataProviders/db/providers/osiris";
import miscScdlGrantPort from "../dataProviders/db/providers/scdl/miscScdlGrant.port";
import miscScdlProducersPort from "../dataProviders/db/providers/scdl/miscScdlProducers.port";
import sireneStockUniteLegalePort from "../dataProviders/db/sirene/stockUniteLegale/sireneStockUniteLegale.port";
import amountsVsProgramRegionPort from "../dataProviders/db/dataViz/amountVSProgramRegion/amountsVsProgramRegion.port";
import dataLogPort from "../dataProviders/db/data-log/dataLog.port";

export const portsWithIndexes = [
    userPort,
    logsPort,
    userResetPort,
    osirisRequestPort,
    osirisActionPort,
    fonjepPaymentPort,
    fonjepSubventionPort,
    fonjepVersementsPort,
    fonjepPostesPort,
    fonjepTiersPort,
    fonjepTypePostePort,
    fonjepDispositifPort,
    dauphinGisproPort,
    miscScdlGrantPort,
    miscScdlProducersPort,
    configurationsPort,
    consumerTokenPort,
    chorusLinePort,
    demarchesSimplifieesDataPort,
    demarchesSimplifieesSchemaPort,
    statsAssociationsVisitPort,
    rnaSirenPort,
    uniteLegalEntreprisePort,
    uniteLegalNamePort,
    paymentFlatPort,
    sireneStockUniteLegalePort,
    amountsVsProgramRegionPort,
    dataLogPort,
];
