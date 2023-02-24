export default function Controller(basePath: string) {
    // old code
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (constructor: Function) {
        constructor.prototype.basePath = basePath;
    };
}
