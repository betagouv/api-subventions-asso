import rnaSirenPort from "./db/rnaSiren/rnaSiren.port";
import uniteLegalEntreprisePort from "./db/uniteLegalEntreprise/uniteLegalEntreprise.port";
import uniteLegalNamePort from "./db/uniteLegalName/uniteLegalName.port";
import configurationsPort from "./db/configurations/configurations.port";
import logsPort from "./db/stats/logs.port";
import statsAssociationsVisitPort from "./db/stats/statsAssociationsVisit.port";
import userResetPort from "./db/user/user-reset.port";
import userPort from "./db/user/user.port";
import consumerTokenPort from "./db/user/consumer-token.port";
import chorusLinePort from "./db/providers/chorus/chorus.line.port";
import dauphinGisproPort from "./db/providers/dauphin/dauphin-gispro.port";
import demarchesSimplifieesDataPort from "./db/providers/demarchesSimplifiees/demarchesSimplifieesData.port";
import demarchesSimplifieesSchemaPort from "./db/providers/demarchesSimplifiees/demarchesSimplifieesSchema.port";
import fonjepSubventionPort from "./db/providers/fonjep/fonjep.subvention.port.old";
import fonjepPaymentPort from "./db/providers/fonjep/fonjep.payment.port.old";
import fonjepVersementsPort from "./db/providers/fonjep/fonjep.versements.port";
import fonjepPostesPort from "./db/providers/fonjep/fonjep.postes.port";
import fonjepTiersPort from "./db/providers/fonjep/fonjep.tiers.port";
import fonjepTypePostePort from "./db/providers/fonjep/fonjep.typePoste.port";
import fonjepDispositifPort from "./db/providers/fonjep/fonjep.dispositif.port";
import paymentFlatPort from "./db/paymentFlat/paymentFlat.port";
import { osirisActionPort, osirisRequestPort } from "./db/providers/osiris";
import miscScdlGrantPort from "./db/providers/scdl/miscScdlGrant.port";
import miscScdlProducersPort from "./db/providers/scdl/miscScdlProducers.port";
import sireneStockUniteLegalePort from "./db/sirene/stockUniteLegale/sireneStockUniteLegale.port";
import amountsVsProgramRegionPort from "./db/dataViz/amountVSProgramRegion/amountsVsProgramRegion.port";
import dataLogPort from "./db/data-log/dataLog.port";
import applicationFlatPort from "./db/applicationFlat/applicationFlat.port";

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
    applicationFlatPort,
];
