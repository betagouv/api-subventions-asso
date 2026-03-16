import rnaSirenAdapter from "./db/rnaSiren/rnaSiren.adapter";
import uniteLegalEntrepriseAdapter from "./db/uniteLegalEntreprise/uniteLegalEntreprise.adapter";
import uniteLegalNameAdapter from "./db/uniteLegalName/uniteLegalName.adapter";
import configurationsAdapter from "./db/configurations/configurations.adapter";
import logsAdapter from "./db/stats/logs.adapter";
import statsAssociationsVisitAdapter from "./db/stats/statsAssociationsVisit.adapter";
import userResetAdapter from "./db/user/user-reset.adapter";
import userAdapter from "./db/user/user.adapter";
import consumerTokenAdapter from "./db/user/consumer-token.adapter";
import chorusLineAdapter from "./db/providers/chorus/chorus.line.adapter";
import dauphinAdapter from "./db/providers/dauphin/dauphin.adapter";
import demarchesSimplifieesDataAdapter from "./db/providers/demarchesSimplifiees/demarchesSimplifieesData.adapter";
import demarchesSimplifieesSchemaAdapter from "./db/providers/demarchesSimplifiees/demarchesSimplifieesSchema.adapter";
import fonjepVersementsAdapter from "./db/providers/fonjep/fonjep.versements.adapter";
import fonjepPostesAdapter from "./db/providers/fonjep/fonjep.postes.adapter";
import fonjepTiersAdapter from "./db/providers/fonjep/fonjep.tiers.adapter";
import fonjepTypePosteAdapter from "./db/providers/fonjep/fonjep.typePoste.adapter";
import fonjepDispositifAdapter from "./db/providers/fonjep/fonjep.dispositif.adapter";
import paymentFlatAdapter from "./db/paymentFlat/paymentFlat.adapter";
import { osirisActionAdapter, osirisRequestAdapter } from "./db/providers/osiris";
import miscScdlGrantAdapter from "./db/providers/scdl/miscScdlGrant.adapter";
import miscScdlProducersAdapter from "./db/providers/scdl/miscScdlProducers.adapter";
import sireneStockUniteLegaleAdapter from "./db/sirene/stockUniteLegale/sireneStockUniteLegale.adapter";
import amountsVsProgramRegionAdapter from "./db/dataViz/amountVSProgramRegion/amountsVsProgramRegion.adapter";
import dataLogAdapter from "./db/data-log/dataLog.adapter";
import applicationFlatAdapter from "./db/applicationFlat/applicationFlat.adapter";
import gisproAdapter from "./db/providers/gispro.adapter";
import depositLogAdapter from "./db/deposit-log/deposit-log.adapter";
import chorusFseAdapter from "./db/providers/chorus/chorus.fse.adapter";

export const portsWithIndexes = [
    // TODO: handle adapter initialization from within and remove this file
    userAdapter,
    logsAdapter,
    userResetAdapter,
    osirisRequestAdapter,
    osirisActionAdapter,
    fonjepVersementsAdapter,
    fonjepPostesAdapter,
    fonjepTiersAdapter,
    fonjepTypePosteAdapter,
    fonjepDispositifAdapter,
    dauphinAdapter,
    miscScdlGrantAdapter,
    miscScdlProducersAdapter,
    configurationsAdapter,
    consumerTokenAdapter,
    chorusLineAdapter,
    chorusFseAdapter,
    demarchesSimplifieesDataAdapter,
    demarchesSimplifieesSchemaAdapter,
    statsAssociationsVisitAdapter,
    rnaSirenAdapter,
    uniteLegalEntrepriseAdapter,
    uniteLegalNameAdapter,
    paymentFlatAdapter,
    sireneStockUniteLegaleAdapter,
    amountsVsProgramRegionAdapter,
    dataLogAdapter,
    applicationFlatAdapter,
    depositLogAdapter,
    gisproAdapter,
    dauphinAdapter,
];
