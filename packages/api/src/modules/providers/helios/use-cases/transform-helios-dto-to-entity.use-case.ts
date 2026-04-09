import HeliosDto from "../../../../adapters/inputs/cli/helios/helios.dto";
import HeliosEntity from "../domain/helios.entity";

export default class TransformHeliosDtoToEntityUseCase {
    execute(dto: HeliosDto): HeliosEntity {
        return {
            codeDep: dto["CODE_DEPARTEMENT"],
            codeInseeBc: dto["CODE_INSEE_BC"],
            collec: dto["COLLEC"],
            compteNature: dto["COMPTE_NATURE"],
            dateEmission: dto["DATE_EMISSION"],
            datePaiement: dto["DATE_PAIEMENT"],
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
        };
    }
}
