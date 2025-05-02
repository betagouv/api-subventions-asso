export default class Flux<T> {
    private prevData: T[] = [];
    private isClose = false;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private onDataCb: (data: T) => unknown = (_data: T) => null;
    private onCloseCb: () => unknown = () => null;

    constructor(defaultValue?: T) {
        if (defaultValue) {
            this.prevData.push(defaultValue);
        }
    }

    push(data: T) {
        if (this.isClose) throw new Error("Flux is done, you can't push a new data in flux");
        this.prevData.push(data);
        this.onDataCb(data);

        return this;
    }

    on(event: "data" | "close", cb: (data?: T) => unknown) {
        if (event === "data") this.onData(cb);
        if (event === "close") this.onClose(cb);
    }

    private onData(cb: (data: T) => unknown) {
        this.onDataCb = cb;
        if (this.prevData.length) {
            this.prevData.forEach(data => {
                this.onDataCb(data);
            });
        }
    }

    close() {
        this.isClose = true;
        this.onCloseCb();

        return this;
    }

    onClose(cb: () => unknown) {
        this.onCloseCb = cb;

        if (this.isClose) this.onCloseCb();
    }

    toPromise(): Promise<T[]> {
        return new Promise(resolve => {
            if (this.isClose) return resolve(this.prevData);

            const acc: T[] = [];

            this.on("data", (data?: T) => {
                acc.push(data as T);
            });

            this.on("close", () => {
                resolve(acc);
            });
        });
    }
}
