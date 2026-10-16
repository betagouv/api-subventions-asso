export const useOnlyFakeDate = () =>
    jest.useFakeTimers({
        doNotFake: [
            "setTimeout",
            "clearTimeout",
            "setInterval",
            "clearInterval",
            "setImmediate",
            "clearImmediate",
            "nextTick",
            "queueMicrotask",
            "performance",
        ],
    });
