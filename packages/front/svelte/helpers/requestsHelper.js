export function toQueryString(queryObj) {
    return Object.entries(queryObj)
        .reduce((query, [key, value]) => {
            if (value === undefined) return query;
            return query.concat(`${key}=${value}`);
        }, [])
        .join("&");
}
