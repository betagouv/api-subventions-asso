import associationNameService from "../association-name/associationName.service";
export class SearchService {
    public async getAssociationsKeys(value: string) {
        const result = await associationNameService.getAllStartingWith(value);
        return result;
    }
}

const searchService = new SearchService();

export default searchService;
