import FonjepTiersEntity from "../entities/FonjepTiersEntity";
import FonjepPosteEntity from "../entities/FonjepPosteEntity";
import FonjepVersementEntity from "../entities/FonjepVersementEntity";
import FonjepTypePosteEntity from "../entities/FonjepTypePosteEntity";
import FonjepDispositifEntity from "../entities/FonjepDispositifEntity";
import FonjepDispositifDto from "../../../../dataProviders/db/providers/fonjep/dto/fonjepDispositifDto";
import { FonjepPosteDtoWithJSDate } from "../../../../dataProviders/db/providers/fonjep/dto/fonjepPosteDto";
import FonjepTypePosteDto from "../../../../dataProviders/db/providers/fonjep/dto/fonjepTypePosteDto";
import { FonjepVersementDto } from "../../../../dataProviders/db/providers/fonjep/dto/fonjepVersementDto";
import FonjepTiersDto from "../../../../dataProviders/db/providers/fonjep/dto/fonjepTiersDto";

/**
 * Some of the nullIfEmpty calls have not been verified and were added base on every FonjepEntity type
 * Properties without nullIfEmpty are supposed to be mandatory / always present (checked in the 2024-12-31 extract file)
 */
export default class FonjepEntityAdapter {
    static PROVIDER_NAME = "Fonjep";

    static toFonjepTierEntity(tier: FonjepTiersDto): FonjepTiersEntity {
        return {
            code: tier["Code"],
            raisonSociale: tier["RaisonSociale"],
            estAssociation: tier["EstAssociation"],
            estCoFinanceurPostes: tier["EstCoFinanceurPostes"],
            estFinanceurPostes: tier["EstFinanceurPostes"],
            siretOuRidet: tier["SiretOuRidet"],
            codePostal: tier["CodePostal"],
            ville: tier["Ville"],
            contactEmail: tier["ContactEmail"],
        };
    }

    static toFonjepPosteEntity(poste: FonjepPosteDtoWithJSDate): FonjepPosteEntity {
        return {
            code: poste["Code"],
            annee: poste["Annee"],
            associationBeneficiaireCode: poste["AssociationBeneficiaireCode"],
            financeurPrincipalCode: poste["FinanceurPrincipalCode"],
            financeurAttributeurCode: poste["FinanceurAttributeurCode"],
            dateFinTriennalite: poste["DateFinTriennalite"],
            dispositifId: poste["DispositifId"],
            pstStatutPosteLibelle: poste["PstStatutPosteLibelle"],
            pstRaisonStatutLibelle: poste["PstRaisonStatutLibelle"],
            associationImplantationCode: poste["AssociationImplantationCode"],
            montantSubvention: poste["MontantSubvention"],
            pstTypePosteCode: poste["PstTypePosteCode"],
            pleinTemps: poste["PleinTemps"],
            doublementUniteCompte: poste["DoublementUniteCompte"],
        };
    }

    static toFonjepVersementEntity(versement: FonjepVersementDto): FonjepVersementEntity {
        return {
            posteCode: versement["PosteCode"],
            periodeDebut: versement["PeriodeDebut"],
            periodeFin: versement["PeriodeFin"],
            dateVersement: versement["DateVersement"],
            montantAPayer: versement["MontantAPayer"],
            montantPaye: versement["MontantPaye"],
        };
    }

    static toFonjepTypePosteEntity(typePoste: FonjepTypePosteDto): FonjepTypePosteEntity {
        return {
            code: typePoste["Code"],
            libelle: typePoste["Libelle"],
        };
    }

    static toFonjepDispositifEntity(dispositif: FonjepDispositifDto): FonjepDispositifEntity {
        return {
            id: dispositif["ID"],
            libelle: dispositif["Libelle"],
            financeurCode: dispositif["FinanceurCode"],
        };
    }
}
