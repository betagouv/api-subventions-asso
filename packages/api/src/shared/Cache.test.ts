import CacheData from "./Cache";

describe("CacheData", () => {
    it("should save in cache", () => {
        const cache = new CacheData<string>(1000);
        cache.add("test", "Hello World");

        expect(cache.has("test")).toBeTruthy();
        expect(cache.get("test")).toHaveLength(1);
    });

    it("should save in cache, but data has expired", () => {
        const cache = new CacheData<string>(0);
        cache.add("test", "Hello World");

        expect(cache.has("test")).toBeFalsy();
        expect(cache.get("test")).toHaveLength(0);
    });

    it("should delete all data", () => {
        const cache = new CacheData<string>(1000);
        cache.add("test", "Hello World");
        cache.destroy();
        expect(cache.has("test")).toBeFalsy();
        expect(cache.get("test")).toHaveLength(0);
    });
});
