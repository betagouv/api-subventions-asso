export default class Flux<T> {
    private onDataCb: (data: T) => unknown = (_data: T) => null;
    private onCloseCb: () => unknown = () => null;

    push(data: T) {
        this.onDataCb(data);
    }

    onData(cb: (data: T) => unknown) {
        this.onDataCb = cb;
    }   

    close(){
        this.onCloseCb();
    }

    onClose(cb: () => unknown) {
        this.onCloseCb = cb;
    }
}