import rnaSirenAdapter from "./rna-siren/rna-siren.adapter";
import uniteLegalEntrepriseAdapter from "./unite-legale-entreprise/unite-legale-entreprise.adapter";
import uniteLegalNameAdapter from "./unite-legale-name/unite-legale-name.adapter";
import configurationsAdapter from "./configurations/configurations.adapter";
import logsAdapter from "./stats/logs.adapter";
import statsAssociationsVisitAdapter from "./stats/association-visit.adapter";
import userResetAdapter from "./user/user-reset.adapter";
import userAdapter from "./user/user.adapter";
import consumerTokenAdapter from "./user/consumer-token.adapter";
import dauphinAdapter from "./providers/dauphin/dauphin.adapter";
import demarchesSimplifieesDataAdapter from "./providers/demarchesSimplifiees/demarchesSimplifieesData.adapter";
import demarchesSimplifieesSchemaAdapter from "./providers/demarchesSimplifiees/demarchesSimplifieesSchema.adapter";
import fonjepVersementsAdapter from "./providers/fonjep/fonjep.versements.adapter";
import fonjepPostesAdapter from "./providers/fonjep/fonjep.postes.adapter";
import fonjepTiersAdapter from "./providers/fonjep/fonjep.tiers.adapter";
import fonjepTypePosteAdapter from "./providers/fonjep/fonjep.typePoste.adapter";
import fonjepDispositifAdapter from "./providers/fonjep/fonjep.dispositif.adapter";
import paymentFlatAdapter from "./payment-flat/payment-flat.adapter";
import { osirisActionAdapter, osirisRequestAdapter } from "./providers/osiris";
import miscScdlGrantAdapter from "./providers/scdl/miscScdlGrant.adapter";
import miscScdlProducersAdapter from "./providers/scdl/miscScdlProducers.adapter";
import sireneStockUniteLegaleAdapter from "./sirene/stock-unite-legale/sirene-stock-unite-legale.adapter";
import amountsVsProgramRegionAdapter from "./dataviz/amount-vs-program-region/amounts-vs-program-region.adapter";
import dataLogAdapter from "./data-log/data-log.adapter";
import applicationFlatAdapter from "./application-flat/application-flat.adapter";
import gisproAdapter from "./providers/gispro.adapter";
import depositLogAdapter from "./deposit-log/deposit-log.adapter";
import chorusFseAdapter from "./providers/chorus/chorus.fse.adapter";
import chorusAdapter from "./providers/chorus/chorus.adapter";

export const adaptersWithIndexes = [
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
    chorusAdapter,
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
