import ParserPath from "../../@types/ParserPath";

export function findByPath(data: unknown, path: ParserPath) {
    return path.reduce((acc, name) => {
        if (acc === undefined) return acc;

        const obj = acc as {[key: string]: string};

        if (!(name instanceof Array)) { // So is string
            return obj[name];
        }

        const key = name.find((key) => obj[key]); // TODO manage multiple valid case (with filters)

        if (!key) return undefined
        return obj[key];
    }, data) as string;
}