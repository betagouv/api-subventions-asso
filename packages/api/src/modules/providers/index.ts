import leCompteAssoService from "./leCompteAsso/leCompteAsso.service";
import osirisService from "./osiris/osiris.service";
import fonjepService from "./fonjep/fonjep.service";
import chorusService from "./chorus/chorus.service";
import apiAssoService from "./apiAsso/apiAsso.service";
import avisSituationInseeService from "./avisSituationInsee/avisSituationInsee.service";
import apiEntrepriseService from "./apiEntreprise/apiEntreprise.service";
import dauphinService from "./dauphin/dauphin.service";
import caisseDepotsService from "./caisseDepots/caisseDepots.service";
import demarchesSimplifieesService from "./demarchesSimplifiees/demarchesSimplifiees.service";
import bodaccService from "./bodacc/bodacc.service";
import Provider from "./@types/IProvider";
import scdlGrantService from "./scdl/scdl.grant.service";
import subventiaService from "./subventia/subventia.service";

const providers: { [key: string]: Provider } = {
    osirisService,
    leCompteAssoService,
    fonjepService,
    chorusService,
    apiAssoService,
    avisSituationInseeService,
    apiEntrepriseService,
    dauphinService,
    demarchesSimplifieesService,
    caisseDepotsService,
    bodaccService,
    scdlGrantService,
    subventiaService,
};

export default providers;

export const providersById = {};
for (const providerService of Object.values(providers)) {
    providersById[providerService.provider.id] = providerService;
}
