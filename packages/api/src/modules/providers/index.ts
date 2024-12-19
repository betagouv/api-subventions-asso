import DemandesSubventionsProvider from "../subventions/@types/DemandesSubventionsProvider";
import PaymentProvider from "../payments/@types/PaymentProvider";
import GrantProvider from "../grant/@types/GrantProvider";
import { FullGrantProvider } from "../grant/@types/FullGrantProvider";
import osirisService from "./osiris/osiris.service";
import fonjepService from "./fonjep/fonjep.service.old";
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

// TODO: Why not an array instead of an object ?
const providers: { [key: string]: Provider } = {
    osirisService,
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

export const demandesSubventionsProviders = Object.values(providers).filter(
    p => (p as DemandesSubventionsProvider<unknown>).isDemandesSubventionsProvider,
) as DemandesSubventionsProvider<unknown>[];

export const paymentProviders = Object.values(providers).filter(
    p => (p as PaymentProvider<unknown>).isPaymentProvider,
) as PaymentProvider<unknown>[];

export const fullGrantProviders = Object.values(providers).filter(
    p => (p as FullGrantProvider<unknown>).isFullGrantProvider,
) as FullGrantProvider<unknown>[];

export const grantProviders = Object.values(providers).filter(
    p => (p as GrantProvider).isGrantProvider,
) as GrantProvider[];
