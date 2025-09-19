import DemandesSubventionsProvider from "../subventions/@types/DemandesSubventionsProvider";
import PaymentProvider from "../payments/@types/PaymentProvider";
import GrantProvider from "../grant/@types/GrantProvider";
import paymentFlatService from "../paymentFlat/paymentFlat.service";
import osirisService from "./osiris/osiris.service";
import apiAssoService from "./apiAsso/apiAsso.service";
import avisSituationInseeService from "./avisSituationInsee/avisSituationInsee.service";
import apiEntrepriseService from "./apiEntreprise/apiEntreprise.service";
import dauphinService from "./dauphin-gispro/dauphin.service";
import demarchesSimplifieesService from "./demarchesSimplifiees/demarchesSimplifiees.service";
import bodaccService from "./bodacc/bodacc.service";
import Provider from "./@types/IProvider";
import scdlGrantService from "./scdl/scdl.grant.service";
import subventiaService from "./subventia/subventia.service";
import chorusService from "./chorus/chorus.service";
import applicationFlatService from "../applicationFlat/applicationFlat.service";

// TODO: Why not an array instead of an object ?
const providers: { [key: string]: Provider } = {
    osirisService,
    applicationFlatService,
    paymentFlatService,
    apiAssoService,
    avisSituationInseeService,
    apiEntrepriseService,
    dauphinService,
    demarchesSimplifieesService,
    bodaccService,
    chorusService,
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

export const grantProviders = Object.values(providers).filter(
    p => (p as GrantProvider).isGrantProvider,
) as GrantProvider[];
