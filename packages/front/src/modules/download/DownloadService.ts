import { Siret } from "@api-subventions-asso/dto";
import User from "../../@types/User";
import apiDatasubService from "../../shared/apiDatasub.service";
import IdentifierHelper from "../../shared/helpers/IdentifierHelper";

export class DownloadService {

    async downloadAssociation(id: string, user: User): Promise<{ type: "REDIRECT" | "SEND" | "ERROR", data?: unknown }> {

        const type = IdentifierHelper.findType(id);

        if (type !== "RNA" && type !== "SIREN") {
            return { type: "ERROR" };
        } 

        const result = await apiDatasubService.searchAssoByRna(id, user);

        if (result.status != 200 || !result.data.success || !result.data.association) {
            return { type: "ERROR" };
        } 

        return {
            type: "SEND",
            data: result.data.association
        }
    }

    async downloadEtablissement(siret: Siret, user: User): Promise<{ type: "REDIRECT" | "SEND" | "ERROR", data?: unknown }>  {
        const type = IdentifierHelper.findType(siret);

        if (type !== "SIRET") {
            return { type: "ERROR" }
        } 

        const result = await apiDatasubService.searchEtablissement(siret, user);

        if (result.status != 200 || !result.data.success || !result.data.etablissement) {
            return { type: "ERROR" }

        } 
        
        return { 
            type: "SEND",
            data: result.data.etablissement 
        };
    }

}

const downloadService = new DownloadService();

export default downloadService;