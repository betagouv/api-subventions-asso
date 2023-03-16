import { NotFoundError } from "../../shared/errors/httpErrors";
import associationNameService from "../association-name/associationName.service";
export class SearchService {
    public async getAssociationsKeys(value: string) {
        const result = await associationNameService.getAllStartingWith(value);
        if (!result || (Array.isArray(result) && result.length == 0)) {
            throw new NotFoundError(`Could match any association with given input : ${value}`);
        }
        return result;
    }
}

const searchService = new SearchService();

export default searchService;
