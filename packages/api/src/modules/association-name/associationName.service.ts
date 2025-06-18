import { NotAssociationError } from "core";
import uniteLegalNameService from "../providers/uniteLegalName/uniteLegal.name.service";
import rnaSirenService from "../rna-siren/rnaSiren.service";
import AssociationIdentifier from "../../identifierObjects/AssociationIdentifier";
import Rna from "../../identifierObjects/Rna";
import Siren from "../../identifierObjects/Siren";
import rechercheEntreprisesService from "../../dataProviders/api/rechercheEntreprises/rechercheEntreprises.service";
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
        let gotCompany = false;
        const searchEntreprisesCatch = (value: string) =>
            rechercheEntreprisesService.searchForceAsso(value).catch(() => {
                gotCompany = true;
                return [];
            });

        if (Rna.isRna(value) || Siren.isSiren(value)) {
            let identifierType: string;
            let identifier: Rna | Siren;

            // from here we manipulate identifiers as object
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

            // from here in loops we manipulate each found identifier as string
            const identifiers: string[] = rnaSirenEntities.length
                ? rnaSirenEntities.map(entity => entity[identifierType.toLocaleLowerCase()].value) // See issue https://github.com/betagouv/api-subventions-asso/issues/2517
                : [value];

            associationNames = [
                ...(await Promise.all(
                    identifiers.map(identifierStr => uniteLegalNameService.searchBySirenSiretName(identifierStr)),
                )),
                ...(await Promise.all(identifiers.map(identifierStr => searchEntreprisesCatch(identifierStr)))),
            ].flat();
        } else {
            // Siret Or Name
            associationNames = [
                ...(await uniteLegalNameService.searchBySirenSiretName(lowerCaseValue)),
                ...(await searchEntreprisesCatch(value)),
            ].flat();
        }
        const mergedAssociationName = associationNames.reduce(
            (acc, associationName) => {
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
            },
            {} as Record<string, AssociationNameEntity>,
        );
        const res = Object.values(mergedAssociationName);
        if (!res.length && gotCompany) throw new NotAssociationError();
        return res;
    }
}

const associationNameService = new AssociationNameService();

export default associationNameService;
