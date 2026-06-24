import paymentFlatService from "../payment-flat/payment-flat.service";
import osirisService from "./osiris/osiris.service";
import apiAssoService from "./api-asso/api-asso.service";
import avisSituationInseeService from "./avis-situation-insee/avis-situation-insee.service";
import apiEntrepriseService from "./api-entreprise/api-entreprise.service";
import dauphinService from "./dauphin-gispro/dauphin.service";
import demarchesSimplifieesService from "./demarches-simplifiees/demarches-simplifiees.service";
import bodaccService from "./bodacc/bodacc.service";
import Provider from "./@types/IProvider";
import scdlGrantService from "./scdl/scdl.grant.service";
import subventiaService from "./subventia/subventia.service";
import chorusService from "./chorus/chorus.service";
import applicationFlatService from "../application-flat/application-flat.service";

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
