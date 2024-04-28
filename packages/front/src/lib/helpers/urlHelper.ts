export function encodeQuerySearch(uri: string) {
    return encodeURIComponent(uri);
}

export function decodeQuerySearch(uri: string) {
    return decodeURIComponent(uri);
}

export function getQueryParams(searchQuery: URLSearchParams | string) {
    const urlParams = new URLSearchParams(searchQuery);
    return Object.fromEntries(urlParams.entries());
}
