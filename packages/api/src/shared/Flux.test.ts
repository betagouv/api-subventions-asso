import Flux from "./Flux";

describe("Flux", () => {
    describe("constructor", () => {
        it("should call onData when default value is pass", () => {
            const expected = "DATA";
            const mock = jest.fn();
            const flux = new Flux(expected);
            flux.on("data", mock);

            expect(mock).toHaveBeenCalledWith(expected);
        })
    });

    describe("push", () => {
        it("should throw error when flux is close", () => {
            const flux = new Flux().close();

            expect(() => flux.push("data")).toThrowError("Flux is done, you can't push a new data in flux");
        });

        it("should return flux", () => {
            const expected = new Flux();

            expect(expected.push("DATA")).toBe(expected);
        });

        it("should call onData callback", () => {
            const flux = new Flux();
            const onData = jest.fn();

            const expected = "DATA";
            flux.on("data", onData);

            flux.push(expected);

            expect(onData).toHaveBeenCalledWith(expected);
        })

        it("should add data on prevData", () => {
            const flux = new Flux();

            const expected = "DATA";
            flux.push(expected);

            // @ts-expect-error prevData is private attribute
            expect(flux.prevData).toEqual([expected]);
        })

    })
    
    describe("on('data')", () => {
        it("should call onData callback with old data", () => {
            const flux = new Flux();
            const onData = jest.fn();
    
            const expected = "DATA";
            flux.push(expected);
            flux.on("data", onData);
    
    
            expect(onData).toHaveBeenCalledWith(expected);
        })

        it("should call with pushed data", () => {
            const flux = new Flux();
            const onData = jest.fn();
    
            const expected = "DATA";

            flux.on("data", onData);
            flux.push(expected);
    
            expect(onData).toHaveBeenCalledWith(expected);
        })


    })

    describe("close", () => {
        it("should return flux", () => {
            const expected = new Flux();

            expect(expected.close()).toBe(expected);
        });

        it("should call onClose callback", () => {
            const flux = new Flux();
            const onCloseCb = jest.fn();

            flux.on("close", onCloseCb);

            flux.close();

            expect(onCloseCb).toHaveBeenCalledTimes(1);
        })

        it("should set isClose to true", () => {
            const flux = new Flux().close();

            // @ts-expect-error isClose is private attribute
            expect(flux.isClose).toBe(true);
        })

    })
    
    describe("on('close')", () => {
        it("should directly close when flux is already close", () => {
            const flux = new Flux().close();
    
            const onCloseCb = jest.fn();
            flux.on("close", onCloseCb);
    
            expect(onCloseCb).toHaveBeenCalledTimes(1);
        })

        it("should be call cb when flux is close", () => {
            const flux = new Flux();
            const onCloseCb = jest.fn();

            flux.on("close", onCloseCb);

            flux.close();

            expect(onCloseCb).toHaveBeenCalledTimes(1);
        })
    })

    describe("toPromise", () => {
        it("should resolve promise if flux is already close", async () => {
            const flux = new Flux();

            flux.close();

            await expect(flux.toPromise()).resolves.toEqual(expect.arrayContaining([]));
        })

        it("should resolve promise with old data", async () => {
            const expected = "DATA"
            const flux = new Flux(expected);

            flux.close();

            await expect(flux.toPromise()).resolves.toEqual([expected]);
        })

        it("should resolve promise with all data", async () => {
            const flux = new Flux();
            const A = 'DATA_A';
            const B = 'DATA_B';
            const C = 'DATA_C';
            const expected = [A,B,C];

            flux.push(A);
            flux.push(B);
            flux.push(C);

            const promise = flux.toPromise();
            flux.close();

            await expect(promise).resolves.toEqual(expected);
        })
    })
});