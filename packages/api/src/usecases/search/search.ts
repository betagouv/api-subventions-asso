import PaginatedResult from "../../@types/PaginatedResult";
import AsyncUseCase from "../../@types/use-case/AsyncUseCase";
import SearchStructureEntity from "../../domain/structures/SearchStructureEntity";

export interface SearchInput {
    value: string;
    page: string;
}

export class Search implements AsyncUseCase<SearchInput, PaginatedResult<SearchStructureEntity[]>> {
    async execute(args: SearchInput) {
        let page = Number(args.page);
        if (Number.isNaN(page)) page = 1; // prevent wrong page value

        return Promise.resolve({
            results: [] as SearchStructureEntity[],
            nbPages: 1,
            page: 1,
            total: 3,
        });
    }
}

const search = new Search();
export default search;
