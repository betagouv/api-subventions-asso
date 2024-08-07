import uniteLegalNameService from "../providers/uniteLegalName/uniteLegal.name.service";
import rnaSirenService from "../rna-siren/rnaSiren.service";
import rechercheEntreprises from "../../dataProviders/api/rechercheEntreprises/rechercheEntreprises.port";
import AssociationIdentifier from "../../valueObjects/AssociationIdentifier";
import Rna from "../../valueObjects/Rna";
import Siren from "../../valueObjects/Siren";
import AssociationNameEntity from "./entities/AssociationNameEntity";

export class AssociationNameService {
    async getNameFromIdentifier(identifier: AssociationIdentifier): Promise<string | undefined> {
        const result = await uniteLegalNameService.getNameFromIdentifier(identifier);

        if (!result) return;

        return result.name;
    }

    async find(value: string): Promise<AssociationNameEntity[]> {
        const lowerCaseValue = value.toLowerCase().trim();
        let associationNames: AssociationNameEntity[];
        if (Rna.isRna(value) || Siren.isSiren(value)) {
            let identifierType: string;
            let identifier: Rna | Siren;
            if (Rna.isRna(value)) {
                identifierType = "rna";
                identifier = new Rna(value);
            } else {
                identifierType = "siren";
                identifier = new Siren(value);
            }
            // For one rna it's possible to have many siren from match
            // For one siren it's possible to have many rna from match
            const rnaSirenEntities = (await rnaSirenService.find(identifier)) || [];
            const identifiers: string[] = rnaSirenEntities.length
                ? rnaSirenEntities.map(entity => entity[identifierType.toLocaleLowerCase()].value) // Devrais etre l'inverse on a un rna on cherche les siren et inversment
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
            const id = `${associationName.rna?.value} - ${associationName.siren.value}`;
            const oldValue = acc[id] || {};
            acc[id] = new AssociationNameEntity(
                oldValue.name || associationName.name,
                oldValue.siren || associationName.siren,
                oldValue.rna || associationName.rna,
                oldValue.address || associationName.address,
                oldValue.nbEtabs || associationName.nbEtabs,
            );
            return acc;
        }, {} as Record<string, AssociationNameEntity>);
        return Object.values(mergedAssociationName);
    }
}

const associationNameService = new AssociationNameService();

export default associationNameService;
