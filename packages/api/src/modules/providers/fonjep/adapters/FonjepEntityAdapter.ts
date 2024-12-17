import { DefaultObject } from "../../../../@types";
import FonjepTiersEntity from "../entities/FonjepTiersEntity";
import FonjepPosteEntity from "../entities/FonjepPosteEntity";
import FonjepVersementEntity from "../entities/FonjepVersementEntity";
import FonjepTypePosteEntity from "../entities/FonjepTypePosteEntity";
import FonjepDispositifEntity from "../entities/FonjepDispositifEntity";
import { GenericParser } from "../../../../shared/GenericParser";

export default class FonjepEntityAdapter {
    static PROVIDER_NAME = "Fonjep";

    static toFonjepTierEntity(tier): FonjepTiersEntity {
        return new FonjepTiersEntity(
            tier["Code"], // Code
            tier["RaisonSociale"], // RaisonSociale
            tier["EstAssociation"], // EstAssociation
            tier["EstCoFinanceurPostes"], // EstCoFinanceurPostes
            tier["EstFinanceurPostes"], // EstFinanceurPostes
            tier["SiretOuRidet"], // SiretOuRidet
            tier["CodePostal"], // CodePostal
            tier["Ville"], // Ville
            tier["ContactEmail"], // ContactEmail
        );
    }

    static toFonjepPosteEntity(poste): FonjepPosteEntity {
        return new FonjepPosteEntity(
            poste["Code"], // Code
            poste["DispositifId"], // DispositifId
            poste["PstStatutPosteLibelle"], // PstStatutPosteLibelle
            poste["PstRaisonStatutLibelle"], // PstRaisonStatutLibelle
            poste["FinanceurPrincipalCode"], // FinanceurPrincipalCode
            poste["FinanceurAttributeurCode"], // FinanceurAttributeurCode
            poste["AssociationBeneficiaireCode"], // AssociationBeneficiaireCode
            poste["AssociationImplantationCode"], // AssociationImplantationCode
            poste["Annee"], // Annee
            poste["MontantSubvention"], // MontantSubvention
            poste["DateFinTriennalite"], // DateFinTriennalite
            poste["PstTypePosteCode"], // PstTypePosteCode
            poste["PleinTemps"], // PleinTemps
            poste["DoublementUniteCompte"], // DoublementUniteCompte
        );
    }

    static toFonjepVersementEntity(versement): FonjepVersementEntity {
        return new FonjepVersementEntity(
            versement["PosteCode"], // PosteCode
            versement["PeriodeDebut"], // PeriodeDebut
            versement["PeriodeFin"], // PeriodeFin
            versement["DateVersement"], // DateVersement
            versement["MontantAPayer"], // MontantAPayer
            versement["MontantPaye"], // MontantPaye
        );
    }

    static toFonjepTypePosteEntity(typePoste): FonjepTypePosteEntity {
        return new FonjepTypePosteEntity(
            typePoste["Code"], // Code
            typePoste["Libelle"], // Libelle
        );
    }

    static toFonjepDispositifEntity(dispositif): FonjepDispositifEntity {
        return new FonjepDispositifEntity(
            dispositif["ID"], // ID
            dispositif["Libelle"], // Libelle
            dispositif["FinanceurCode"], // FinanceurCode
        );
    }
}
