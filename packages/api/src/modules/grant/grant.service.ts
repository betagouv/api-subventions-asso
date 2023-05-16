import { Siret } from "@api-subventions-asso/dto";
import { AssociationIdentifiers, StructureIdentifiers } from "../../@types";
import { StructureIdentifiersEnum } from "../../@enums/StructureIdentifiersEnum";
import providers from "../providers";
import { getIdentifierType } from "../../shared/helpers/IdentifierHelper";
import AssociationIdentifierError from "../../shared/errors/AssociationIdentifierError";
import rnaSirenService from "../open-data/rna-siren/rnaSiren.service";
import { RawGrant, JoinedRawGrant } from "./@types/rawGrant";
import GrantProvider from "./@types/GrantProvider";

export class GrantService {
    static getRawMethodNameByIdType = {
        [StructureIdentifiersEnum.siret]: "getRawGrantsBySiret",
        [StructureIdentifiersEnum.siren]: "getRawGrantsBySiren",
        [StructureIdentifiersEnum.rna]: "getRawGrantsByRna",
    };
    async getGrantsByAssociation(id: AssociationIdentifiers): Promise<JoinedRawGrant[]> {
        let idType = getIdentifierType(id);
        if (!idType) throw new AssociationIdentifierError();
        if (idType === StructureIdentifiersEnum.rna) {
            const siren = await rnaSirenService.getSiren(id);
            if (siren) {
                id = siren;
                idType = StructureIdentifiersEnum.siren;
            }
        }

        const rawGrants = await this.getRawGrantsByMethod(id, idType);
        return this.joinGrants(rawGrants);
    }

    async getGrantsByEstablishment(siret: Siret): Promise<JoinedRawGrant[]> {
        const rawGrants = await this.getRawGrantsByMethod(siret, StructureIdentifiersEnum.siret);
        return this.joinGrants(rawGrants);
    }

    private async getRawGrantsByMethod(id: StructureIdentifiers, idType): Promise<RawGrant[]> {
        const providers = this.getGrantProviders();
        const methodName = GrantService.getRawMethodNameByIdType[idType];
        return [
            ...(
                await Promise.all(providers.map(p => p[methodName](id).then(g => (g || []) as RawGrant[]) || []))
            ).flat(),
        ];
    }

    private getGrantProviders(): GrantProvider[] {
        return Object.values(providers).filter(
            p => (p as unknown as GrantProvider).isGrantProvider,
        ) as unknown as GrantProvider[];
    }

    private joinGrants(rawGrants: RawGrant[]): JoinedRawGrant[] {
        type JoiningGrant = { payments: RawGrant[]; applications: RawGrant[] };
        const newJoiningGrant = () => ({ payments: [], applications: [] } as JoiningGrant);
        const fullOrLonely: JoinedRawGrant[] = [];
        const byKey: Record<string, JoiningGrant> = {};

        // organize results
        for (const rawGrant of rawGrants) {
            if (rawGrant.type === "fullGrant" || !rawGrant.joinKey) {
                fullOrLonely.push({ [rawGrant.type]: rawGrant });
                continue;
            }
            if (!(rawGrant.joinKey in byKey)) byKey[rawGrant.joinKey] = newJoiningGrant();
            byKey[rawGrant.joinKey][`${rawGrant.type}s`].push(rawGrant);
        }

        // choose application TODO better than arbitrary application choice
        const joined: JoinedRawGrant[] = Object.values(byKey).map(({ applications, payments }) => ({
            payments,
            application: applications?.[0],
        }));

        // reunite joined, full and lonely grants
        return [...joined, ...fullOrLonely];
    }
}

const grantService = new GrantService();

export default grantService;
