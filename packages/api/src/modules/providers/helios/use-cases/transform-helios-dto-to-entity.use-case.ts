import HeliosDto from "../../../../adapters/inputs/cli/helios/helios.dto";
import { DDMMYYYYToUTCDate } from "../../../../shared/helpers/DateHelper";
import HeliosEntity from "../domain/helios.entity";

export default class TransformHeliosDtoToEntityUseCase {
    execute(dto: HeliosDto): HeliosEntity {
        return {
            // remove apostrophe - remove this when dto will be updated by the provider
            codeDep: dto["CODE_DEPARTEMENT"].replace("'", ""),
            codeInseeBc: dto["CODE_INSEE_BC"],
            collec: dto["COLLEC"],
            compteNature: dto["COMPTE_NATURE"],
            // @TODO: those date are not good as it is in french date format DD/MM/YYYY
            dateEmission: DDMMYYYYToUTCDate(dto["DATE_EMISSION"]),
            datePaiement: DDMMYYYYToUTCDate(dto["DATE_PAIEMENT"]),
            id: dto["ID"],
            immatriculation: dto["IMMATRICULATION"],
            montantPaiment: dto["MONTANT_PAIEMENT"],
            nom: dto["NOM"],
            nomenclature: dto["NOMENCLATURE"],
            numeroLigne: dto["NUMERO_LIGNE"],
            numMandat: dto["NUM_MANDAT"],
            natureJuridique: dto["Nature JURIDIQUE"],
            objectMandat: dto["OBJET_MANDAT"],
            typeMandat: dto["TYPE MANDAT"],
            typeBudgetCollectivite: dto["TYPE_BUDGET_COLLECTIVITE"],
            typeImmatriculation: dto["TYPE_IMMATRICULATION"],
            updateDate: new Date(),
        };
    }
}
