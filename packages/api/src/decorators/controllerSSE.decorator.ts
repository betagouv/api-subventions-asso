export default function ControllerSSE(basePath: string, option : { security?: string} = {}) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (constructor: Function) {
        constructor.prototype.basePath = basePath;
        constructor.prototype.option = option;
    };
}
