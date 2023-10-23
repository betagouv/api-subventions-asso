export const hasEmptyProperties = obj => {
    if (isEmpty(obj)) return true;
    return Object.values(obj).every(value => !value);
};

export const isEmpty = obj => {
    return !obj || !hasProperties(obj);
};

export const hasProperties = obj => {
    if (!isObject(obj)) return false;
    return Object.keys(obj).length !== 0;
};

export const isObject = obj => obj.constructor === Object;
