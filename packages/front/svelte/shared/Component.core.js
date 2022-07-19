export default class ComponentCore {
    constructor() {
        this.renderCallback = () => null;
    }

    onRender(cb) {
        this.renderCallback = cb;
    }

    render() {
        this.renderCallback(this.buildRendererData());
    }

    buildRendererData() {
        return {};
    }
}
