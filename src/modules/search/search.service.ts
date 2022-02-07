import osirisService from "../osiris/osiris.service";
import ProviderRequestInterface from "./@types/ProviderRequestInterface";
import RequestEntity from "./entities/RequestEntity";
import leCompteAssoService from "../leCompteAsso/leCompteAsso.service";
import entrepriseApiService from "../external/entreprise-api.service";
import { Siret } from "../../@types/Siret";
import { Rna } from "../../@types/Rna";
import chorusService from "../chorus/chorus.service";
import IBudgetLine from "./@types/IBudgetLine";

export class SearchService {

    public async getBySiret(siret: Siret) {
        const siren = siret.slice(0,9);

        const asso = await entrepriseApiService.findAssociationBySiren(siren);
        if (!asso) return null;

        const currentEtablisement = asso.unite_legale.etablissements.find(e => e.siret = siret);

        if (!currentEtablisement) return null;

        const requests = await this.findByRequestsEtablisement(siret);

        const assoData = await entrepriseApiService.findRnaDataBySiret(siret);
        return this.cleanData({
            ...currentEtablisement,
            "demandes_subventions": requests,
            association: {
                ...assoData?.association,
                ...asso.unite_legale
            },
        });
    }

    public async getByRna(rna: Rna) {
        const requests = await this.findRequestsByRna(rna);

        const siret = requests.length ? requests[0].legalInformations.siret : null;

        if (!siret) return null;

        const siren = siret.slice(0,9);

        const asso = await entrepriseApiService.findAssociationBySiren(siren);

        if (!asso) return null;

        await asso.unite_legale.etablissements.reduce( async (acc, etablissement) => {
            await acc;
            const requests = await this.findByRequestsEtablisement(etablissement.siret);
            (etablissement as unknown as { demandes_subventions: unknown }).demandes_subventions = requests

            if (etablissement.nic === asso.unite_legale.nic_siege) asso.unite_legale.etablissement_siege = etablissement
            
            return Promise.resolve({});
        }, Promise.resolve({}) as Promise<{ [key: string]: unknown }>);


        const assoData = await entrepriseApiService.findRnaDataByRna(rna) || await entrepriseApiService.findRnaDataBySiret(siret);

        const result =  {
            ...assoData?.association,
            ...asso.unite_legale
        };

        return this.cleanData(result);
    }

    public findRequestsBySiret(siret: Siret) {
        return this.findRequests(siret, "siret");
    }

    public findRequestsByRna(rna: Rna) {
        return this.findRequests(rna, "rna");
    }

    private findRequests(id: string, type: "siret" | "rna") {
        const providers: ProviderRequestInterface[] = [ // Set in method because LCA need Search and Search need LCA (Import loop bugs)
            osirisService,
            leCompteAssoService,
        ];

        return providers.reduce((acc, provider) => {
            return acc.then(async (requests) => {
                if (type === "siret") {
                    requests.push(...await provider.findBySiret(id));
                } else {
                    requests.push(...await provider.findByRna(id));
                }
                return requests;
            });
        }, Promise.resolve([]) as Promise<RequestEntity[]>);
    }

    private findBudgetLines(siret: Siret) {
        const providers = [
            chorusService
        ]

        return providers.reduce((acc, provider) => {
            return acc.then(async (requests) => {
                requests.push(...await provider.findsBySiret(siret));
                return requests;
            });
        }, Promise.resolve([]) as Promise<{ indexedInformations: IBudgetLine }[]>);
    }

    private groupRequests(requests: RequestEntity[]) {
        const { groupedRequests } = requests.reduceRight((acc, request, requestIndex) => {
            acc.stack.splice(requestIndex, 1);

            const similarRequestIndexes: number[] = [];
            acc.stack.forEach((otherRequest, pos) => { // Check if two request have same matching key
                const key = request.providerMatchingKeys.find((key) => otherRequest.providerMatchingKeys.includes(key) && otherRequest.providerInformations[key]);

                if (!key || request.providerInformations[key] !== otherRequest.providerInformations[key]) {
                    return;
                }
                similarRequestIndexes.push(pos);
            });

            const similarRequests = [request, ...similarRequestIndexes.map(index => acc.stack[index])];

            const req = {
                indexedData: Object.assign({}, ...similarRequests.map(r => ({...r.providerInformations, ...r.legalInformations})).flat()),
                budgetLines: [],
                details: similarRequests,
            }

            acc.groupedRequests.push(req);

            similarRequestIndexes.reverse().forEach(index => acc.stack.splice(index, 1));
            return acc;
        }, { groupedRequests: [] as { indexedData: {[key:string]: unknown}, details: RequestEntity[], budgetLines: unknown[] }[], stack: requests });

        return groupedRequests
    }

    private async findByRequestsEtablisement(siret: Siret) {
        const requests = this.groupRequests(
            await this.findRequestsBySiret(siret)
        );

        const budgetLines = await this.findBudgetLines(siret);

        requests.forEach((data) => {
            if (!data.indexedData['amountAwarded']) return;
            let searchedAmount = data.indexedData['amountAwarded'] as number;

            if (data.indexedData['ej']) {
                const linesIndexWithSameEJ = budgetLines.reduce((acc, budgetLine, index) => {
                    if (budgetLine.indexedInformations.ej === data.indexedData['ej']) {
                        acc.push(index);
                    }
                    return acc;
                }, [] as number[]);
                searchedAmount -= linesIndexWithSameEJ.reduce((acc, index) => acc + budgetLines[index].indexedInformations.amount, 0);
                data.budgetLines.push(...linesIndexWithSameEJ.sort((a,b) => b-a).map(index => budgetLines.splice(index, 1)));
            }

            if (searchedAmount === 0) return;

            const findAllPosibilities = (
                current: {indexedInformations: IBudgetLine}[],
                posibilities: {indexedInformations: IBudgetLine}[],
                restAmount: number,
                result: {indexedInformations: IBudgetLine}[][] = []
            ): {indexedInformations: IBudgetLine}[][] | null  => {
                if (current.length && restAmount === current[current.length-1].indexedInformations.amount) return result.concat([current]);
                if (current.length && restAmount < current[current.length-1].indexedInformations.amount) return null;

                posibilities.forEach((line, index) => {
                    const newPos = posibilities.slice();
                    newPos.splice(index, 1);
                    const newCurrent = current.concat(line);

                    const r = findAllPosibilities(newCurrent, newPos, restAmount - line.indexedInformations.amount, result);
                    if (r) result = result.concat(r);
                });
                return result;
            }

            const posibilities = findAllPosibilities([], budgetLines.slice(), searchedAmount);

            if (!posibilities || posibilities.length === 0) return;
            console.log("posibilities", posibilities);
            const sortedPosibilities = posibilities.sort((a, b) => {
                if(!data.indexedData["dateCommission"]) return 1;
                const timeA = Math.min(...a.map((line) => (line.indexedInformations.dateOperation.getTime() - (data.indexedData["dateCommission"] as Date).getTime())))
                const timeB = Math.min(...b.map((line) => (line.indexedInformations.dateOperation.getTime() - (data.indexedData["dateCommission"] as Date).getTime())))

                return timeA - timeB;
            });

            data.budgetLines.push(...sortedPosibilities[0]);

            const indexes = budgetLines.reduceRight((acc, line, index) => {
                if (sortedPosibilities[0].includes(line)) acc.push(index);
                return acc;
            }, [] as number[]);

            indexes.forEach(index => budgetLines.splice(index, 1));
        });

        return requests;
    }

    private cleanData(data: {[key: string]: unknown}) {
        Object.keys(data).forEach(key => {
            if(!data[key]) delete data[key];
            if(typeof data[key] === "object") this.cleanData(data[key] as { [key: string]: unknown })
        });
        return data;
    }
}

const searchService = new SearchService();

export default searchService;