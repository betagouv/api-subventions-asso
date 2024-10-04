import { SearchCodeError } from "dto";
import uniteLegalNameService from "../providers/uniteLegalName/uniteLegal.name.service";
import { AssociationIdentifiers } from "../../@types";
import rnaSirenService from "../rna-siren/rnaSiren.service";
import { isRna, isSiren } from "../../shared/Validators";
import rechercheEntreprises from "../../dataProviders/api/rechercheEntreprises/rechercheEntreprises.port";
import { getIdentifierType } from "../../shared/helpers/IdentifierHelper";
import { StructureIdentifiersEnum } from "../../@enums/StructureIdentifiersEnum";
import associationsService from "../associations/associations.service";
import { BadRequestError } from "../../shared/errors/httpErrors";
import AssociationNameEntity from "./entities/AssociationNameEntity";

export class AssociationNameService {
    async getNameFromIdentifier(identifier: AssociationIdentifiers): Promise<string | undefined> {
        const result = await uniteLegalNameService.getNameFromIdentifier(identifier);

        if (!result) return;

        return result.name;
    }

    async find(value: AssociationIdentifiers | string): Promise<AssociationNameEntity[]> {
        const lowerCaseValue = value.toLowerCase().trim();
        let associationNames: AssociationNameEntity[];
        if (isRna(value) || isSiren(value)) {
            const identifierType = getIdentifierType(value) as
                | StructureIdentifiersEnum.rna
                | StructureIdentifiersEnum.siren;
            // For one rna it's possible to have many siren from match
            // For one siren it's possible to have many rna from match
            const rnaSirenEntities = (await rnaSirenService.find(value)) || [];
            const identifiers = rnaSirenEntities.length
                ? rnaSirenEntities.map(entity => entity[identifierType.toLocaleLowerCase()])
                : [value];
            associationNames = [
                ...(await Promise.all(
                    identifiers.map(identifier => uniteLegalNameService.searchBySirenSiretName(identifier)),
                )),
                ...(await Promise.all(identifiers.map(identifier => rechercheEntreprises.search(identifier)))),
            ].flat();
        } else {
            // Siret Or Name
            associationNames = [
                ...(await uniteLegalNameService.searchBySirenSiretName(lowerCaseValue)),
                ...(await rechercheEntreprises.search(value)),
            ].flat();
        }
        const mergedAssociationName = associationNames.reduce((acc, associationName) => {
            const id = `${associationName.rna} - ${associationName.siren}`;
            const oldValue = acc[id] || {};
            acc[id] = new AssociationNameEntity(
                oldValue.name || associationName.name,
                oldValue.siren || associationName.siren,
                oldValue.rna || associationName.rna,
                oldValue.categorie_juridique || associationName.categorie_juridique,
                oldValue.address || associationName.address,
                oldValue.nbEtabs || associationName.nbEtabs,
            );
            return acc;
        }, {} as Record<string, AssociationNameEntity>);
        let gotCompany = false;
        Object.entries(mergedAssociationName).map(([id, miniAsso]) => {
            if (!associationsService.isCategoryFromAsso(miniAsso.categorie_juridique)) {
                gotCompany = true;
                delete mergedAssociationName[id];
            }
        });
        const res = Object.values(mergedAssociationName);
        if (!res.length && gotCompany)
            throw new BadRequestError(
                "Votre recherche pointe vers une entité qui n'est pas une association",
                SearchCodeError.ID_NOT_ASSO,
            );
        return res;
    }
}

const associationNameService = new AssociationNameService();

export default associationNameService;
