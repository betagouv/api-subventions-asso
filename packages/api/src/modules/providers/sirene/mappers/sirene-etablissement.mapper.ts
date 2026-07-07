import SireneEtablissementDto from "../@types/SireneEtablissementDto";
import { SireneEtablissementEntity } from "../../../../entities/SireneEtablissementEntity";
import { SireneEtablissementDbo } from "../@types/SireneEtablissementDbo";
import Siren from "../../../../identifier-objects/Siren";
import Siret from "../../../../identifier-objects/Siret";

export default class SireneEtablissementMapper {
    static dtoToEntity(dto: SireneEtablissementDto): SireneEtablissementEntity {
        return {
            siren: new Siren(dto.siren),
            nic: dto.nic,
            siret: new Siret(dto.siret),
            etablissementSiege: dto.etablissementSiege,
            numeroVoieEtablissement: dto.numeroVoieEtablissement,
            typeVoieEtablissement: dto.typeVoieEtablissement,
            libelleVoieEtablissement: dto.libelleVoieEtablissement,
            codePostalEtablissement: dto.codePostalEtablissement,
            libelleCommuneEtablissement: dto.libelleCommuneEtablissement,
            codeCommuneEtablissement: dto.codeCommuneEtablissement,
            codePaysEtrangerEtablissement: dto.codePaysEtrangerEtablissement,
            libellePaysEtrangerEtablissement: dto.libellePaysEtrangerEtablissement,
        };
    }

    static entityToDbo(entity: SireneEtablissementEntity): SireneEtablissementDbo {
        return {
            ...entity,
            siren: entity.siren.value,
            siret: entity.siret.value,
        };
    }

    static dboToEntity(dbo: SireneEtablissementDbo): SireneEtablissementEntity {
        return {
            ...dbo,
            siren: new Siren(dbo.siren),
            siret: new Siret(dbo.siret),
        };
    }
}
