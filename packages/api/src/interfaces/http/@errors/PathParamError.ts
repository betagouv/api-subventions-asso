export class PathParamError extends Error {
    constructor(public cause: { param: string; value: string }) {
        super("Invalid Path Param", { cause });
    }
}
