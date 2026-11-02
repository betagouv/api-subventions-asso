import type { SearchSort } from "./SearchSort";

export interface AssociationSearchOptions {
    page?: number;
    location?: string;
    sort?: SearchSort;
    nameOnly?: boolean;
}
