import CacheData from "./Cache";

describe("CacheData", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("should save in cache", () => {
        const cache = new CacheData<string>(1000);
        cache.add("test", "Hello World");

        expect(cache.get("test")).toEqual("Hello World");
    });

    it("should save in cache, but data has expired", () => {
        const cache = new CacheData<string>(0);
        cache.add("test", "Hello World");

        expect(cache.get("test")).toBeNull();
    });

    it("should delete all data", () => {
        const cache = new CacheData<string>(1000);
        cache.add("test", "Hello World");
        cache.destroy();
        expect(cache.get("test")).toBeNull();
    });

    it("should trigger global cleanup and remove all expired entries after cache expiration", () => {
        const cache = new CacheData<string>(1000);

        cache.add("key1", "value1");
        cache.add("key2", "value2");
        cache.add("key3", "value3");

        jest.advanceTimersByTime(5000);

        cache.add("key4", "value4");

        expect(cache.get("key1")).toBeNull();
        expect(cache.get("key2")).toBeNull();
        expect(cache.get("key3")).toBeNull();
        expect(cache.get("key4")).toEqual("value4");
    });

    it("should cleanup only for expired cache", () => {
        const cache = new CacheData<string>(5000);

        cache.add("key1", "value1");

        jest.advanceTimersByTime(3000);

        cache.add("key2", "value2");

        jest.advanceTimersByTime(3000);

        expect(cache.get("key1")).toBeNull();
        expect(cache.get("key2")).toEqual("value2");
    });
});
