import associationNameService from "../association-name/associationName.service";
export class SearchService {
  public async getAssociationsKeys(value: string) {
    return await associationNameService.getAllStartingWith(value);
  }
}

const searchService = new SearchService();

export default searchService;
