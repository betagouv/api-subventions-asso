module.exports = {
    mongodbMemoryServerOptions: {
        binary: {
            version: "4.0.3",
            skipMD5: true,
        },
        autoStart: false,
        // configured to allow "big indexes" since association-search searchName and searchObject where added
        instance: {
            storageEngine: "wiredTiger",
            args: ["--setParameter", "failIndexKeyTooLong=false"],
        },
    },
};
