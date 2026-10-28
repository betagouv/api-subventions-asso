import type { SearchSort } from "./SearchSort";

export interface AssociationSearchOptions {
    page?: number;
    postalCode?: string;
    sort?: SearchSort;
    nameOnly?: boolean;
}
