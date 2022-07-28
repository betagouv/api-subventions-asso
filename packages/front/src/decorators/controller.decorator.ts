export default function Controller(basePath: string) {
    return function (constructor: Function) {
        constructor.prototype.basePath = basePath;
    };
}
