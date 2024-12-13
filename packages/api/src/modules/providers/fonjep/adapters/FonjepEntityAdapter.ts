import { DefaultObject } from "../../../../@types";
import FonjepTiersEntity from "../entities/FonjepTiersEntity";
import FonjepPosteEntity from "../entities/FonjepPosteEntity";
import FonjepVersementEntity from "../entities/FonjepVersementEntity";
import FonjepTypePosteEntity from "../entities/FonjepTypePosteEntity";
import FonjepDispositifEntity from "../entities/FonjepDispositifEntity";
import { GenericParser } from "../../../../shared/GenericParser";

export default class FonjepEntityAdapter {
    static PROVIDER_NAME = "Fonjep";

    static toFonjepTierEntity(tier: DefaultObject<string>): FonjepTiersEntity {
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

    static toFonjepPosteEntity(poste: DefaultObject<string>): FonjepPosteEntity {
        return new FonjepPosteEntity(
            poste["Code"], // Code
            Number(poste["DispositifId"]), // DispositifId
            poste["PstStatutPosteLibelle"], // PstStatutPosteLibelle
            poste["PstRaisonStatutLibelle"], // PstRaisonStatutLibelle
            poste["FinanceurPrincipalCode"], // FinanceurPrincipalCode
            poste["FinanceurAttributeurCode"], // FinanceurAttributeurCode
            poste["AssociationBeneficiaireCode"], // AssociationBeneficiaireCode
            poste["AssociationImplantationCode"], // AssociationImplantationCode
            Number(poste["Annee"]), // Annee
            Number(poste["MontantSubvention"]), // MontantSubvention
            poste["DateFinTriennalite"] ? GenericParser.ExcelDateToJSDate(Number(poste["DateFinTriennalite"])) : null, // DateFinTriennalite
            poste["PstTypePosteCode"], // PstTypePosteCode
            poste["PleinTemps"], // PleinTemps
            poste["DoublementUniteCompte"], // DoublementUniteCompte
        );
    }

    static toFonjepVersementEntity(versement: DefaultObject<string>): FonjepVersementEntity {
        return new FonjepVersementEntity(
            versement["PosteCode"], // PosteCode
            versement["PeriodeDebut"] ? GenericParser.ExcelDateToJSDate(Number(versement["PeriodeDebut"])) : null, // PeriodeDebut
            versement["PeriodeFin"] ? GenericParser.ExcelDateToJSDate(Number(versement["PeriodeFin"])) : null, // PeriodeFin
            versement["DateVersement"] ? GenericParser.ExcelDateToJSDate(Number(versement["DateVersement"])) : null, // DateVersement
            Number(versement["MontantAPayer"]), // MontantAPayer
            Number(versement["MontantPaye"]), // MontantPaye
        );
    }

    static toFonjepTypePosteEntity(typePoste: DefaultObject<string>): FonjepTypePosteEntity {
        return new FonjepTypePosteEntity(
            typePoste["Code"], // Code
            typePoste["Libelle"], // Libelle
        );
    }

    static toFonjepDispositifEntity(dispositif: DefaultObject<string>): FonjepDispositifEntity {
        return new FonjepDispositifEntity(
            Number(dispositif["Id"]), // Id
            dispositif["Libelle"], // Libelle
            dispositif["FinanceurCode"], // FinanceurCode
        );
    }
}
