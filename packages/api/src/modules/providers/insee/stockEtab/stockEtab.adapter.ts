import { InseeAddress, InseeEstablishmentEntity } from "../../../../entities/InseeEstablishmentEntity";
import { StockEtabRow } from "./@types/stockEtabRow";

export class StockEtabAdapter {
    static rowToInseeEtab(row: StockEtabRow): InseeEstablishmentEntity {
        return new InseeEstablishmentEntity({
            siren: row.siren,
            siret: row.siret,
            nic: row.nic,
            lastUpdate: new Date(row.dateDernierTraitementEtablissement),
            siege: row.etablissementSiege === "true",
            ouvert: row.etatAdministratifEtablissement === "A",
            adresse: this.rowToAddress(row),
        });
    }

    private static rowToAddress(row: StockEtabRow): InseeAddress {
        const isForeign = !!row.codePaysEtrangerEtablissement;
        if (row.statutDiffusionEtablissement === "P")
            return isForeign
                ? new InseeAddress({
                      pays: row.libellePaysEtrangerEtablissement,
                      commune: row.libelleCommuneEtrangerEtablissement,
                  })
                : new InseeAddress({ commune: row.libelleCommuneEtablissement });
        if (isForeign)
            return new InseeAddress({
                pays: row.libellePaysEtrangerEtablissement,
                commune: row.libelleCommuneEtrangerEtablissement,
            });
        return new InseeAddress({
            complementAdresse: row.complementAdresseEtablissement,
            numeroVoie: row.numeroVoieEtablissement,
            indiceRepetition: row.indiceRepetitionEtablissement,
            typeVoie: row.typeVoieEtablissement,
            voie: row.libelleVoieEtablissement,
            codePostal: row.codePostalEtablissement,
            commune: row.libelleCommuneEtablissement,
            distributionSpeciale: row.distributionSpecialeEtablissement,
            cedex: row.libelleCedexEtablissement,
        });
    }
}
