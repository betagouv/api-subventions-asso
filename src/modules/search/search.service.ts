import osirisService from "../osiris/osiris.service";
import ProviderRequestInterface from "./@types/ProviderRequestInterface";
import RequestEntity from "./entities/RequestEntity";
import RnaProvider from "./providers/rna.provider";
import SiretProvider from "./providers/siret.provider";

const providers: ProviderRequestInterface[] = [
    osirisService,
]

export class SearchService {

    public async getBySiret(siret: string) {
        const requests = await providers.reduce((acc, provider) => {
            return acc.then(async (requests) => {
                return requests.concat(...(await provider.findBySiret(siret)));
            });
        }, Promise.resolve([]) as Promise<RequestEntity[]>);

        return {
            requests,
            rnaAPI: {
                rna: requests.length ? await RnaProvider.findByRna(requests[0].legalInformations.rna) : null,
                siret: await RnaProvider.findBySiret(siret)
            },
            siretAPI: await SiretProvider.findBySiret(siret),
        }
    }

    public async getByRna(rna: string) {
        const requests = await providers.reduce((acc, provider) => {
            return acc.then(async (requests) => {
                return requests.concat(...(await provider.findByRna(rna)));
            });
        }, Promise.resolve([]) as Promise<RequestEntity[]>);


        return {
            requests,
            rnaAPI: {
                siret: requests.length ? await RnaProvider.findBySiret(requests[0].legalInformations.siret) : null,
                rna: await RnaProvider.findByRna(rna)
            },
            siretAPI: requests.length ? await SiretProvider.findBySiret(requests[0].legalInformations.siret) : null,
        }
    }
}

const searchService = new SearchService();

export default searchService;