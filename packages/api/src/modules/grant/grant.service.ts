import { CommonGrantDto, Siret } from "dto";
import { AssociationIdentifiers, StructureIdentifiers } from "../../@types";
import { StructureIdentifiersEnum } from "../../@enums/StructureIdentifiersEnum";
import providers from "../providers";
import { getIdentifierType } from "../../shared/helpers/IdentifierHelper";
import StructureIdentifiersError from "../../shared/errors/StructureIdentifierError";
import { isSiret } from "../../shared/Validators";
import AssociationIdentifierError from "../../shared/errors/AssociationIdentifierError";
import associationsService from "../associations/associations.service";
import rnaSirenService from "../rna-siren/rnaSiren.service";
import { siretToSiren } from "../../shared/helpers/SirenHelper";
import { BadRequestError } from "../../shared/errors/httpErrors";
import { RawGrant, JoinedRawGrant } from "./@types/rawGrant";
import GrantProvider from "./@types/GrantProvider";
import commonGrantService from "./commonGrant.service";

export class GrantService {
    static getRawMethodNameByIdType = {
        [StructureIdentifiersEnum.siret]: "getRawGrantsBySiret",
        [StructureIdentifiersEnum.siren]: "getRawGrantsBySiren",
        [StructureIdentifiersEnum.rna]: "getRawGrantsByRna",
    };

    async getGrants(id: StructureIdentifiers): Promise<JoinedRawGrant[]> {
        let idType = getIdentifierType(id);
        if (!idType) throw new StructureIdentifiersError();

        let isReallyAsso;
        if (idType === StructureIdentifiersEnum.rna) {
            isReallyAsso = true;
            const rnaSirenEntities = await rnaSirenService.find(id);
            if (rnaSirenEntities && rnaSirenEntities.length) {
                id = rnaSirenEntities[0].siren;
                idType = StructureIdentifiersEnum.siren;
            }
        }
        if (!isReallyAsso) isReallyAsso = await associationsService.isSirenFromAsso(siretToSiren(id));
        if (!isReallyAsso) throw new BadRequestError("identifier does not represent an association");

        const providers = this.getGrantProviders();
        const methodName = GrantService.getRawMethodNameByIdType[idType];
        const rawGrants = [
            ...(
                await Promise.all(providers.map(p => p[methodName](id).then(g => (g || []) as RawGrant[]) || []))
            ).flat(),
        ];

        return this.joinGrants(rawGrants);
    }

    async getGrantsByAssociation(id: AssociationIdentifiers): Promise<JoinedRawGrant[]> {
        if (isSiret(id)) throw new AssociationIdentifierError();
        return this.getGrants(id);
    }

    async getGrantsByEstablishment(siret: Siret): Promise<JoinedRawGrant[]> {
        if (!isSiret(siret)) throw new StructureIdentifiersError("SIRET expected");
        return this.getGrants(siret);
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
        // TODO maybe think about a more sophisticated system than joinKey to group grants
        //  (specifically for dauphin/osiris joins with fonjep)
        const newJoiningGrant = () => ({ payments: [], applications: [], fullGrants: [] } as JoinedRawGrant);
        const lonelyGrants: JoinedRawGrant[] = [];
        const byKey: Record<string, JoinedRawGrant> = {};

        // organize results
        for (const rawGrant of rawGrants) {
            if (!rawGrant.joinKey) {
                lonelyGrants.push({ [`${rawGrant.type}s`]: [rawGrant] });
                continue;
            }
            if (!(rawGrant.joinKey in byKey)) byKey[rawGrant.joinKey] = newJoiningGrant();
            byKey[rawGrant.joinKey][`${rawGrant.type}s`]?.push(rawGrant);
        }

        // reunite joined, full and lonely grants
        return [...Object.values(byKey), ...lonelyGrants];
    }

    async getCommonGrants(id: StructureIdentifiers, publishable = false): Promise<CommonGrantDto[]> {
        const raws = await this.getGrants(id);

        return raws
            .map(raw => commonGrantService.rawToCommon(raw, publishable))
            .filter(adapted => !!adapted) as CommonGrantDto[];
    }
}

const grantService = new GrantService();

export default grantService;
