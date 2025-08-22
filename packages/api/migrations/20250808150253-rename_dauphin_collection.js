module.exports = {
    async up(db) {
        try {
            await db.renameCollection("dauphin-gispro", "dauphin");
        } catch (e) {
            if (e.codeName === "NamespaceExists") {
                console.log(JSON.stringify(e));
                const saveName = `dauphin-save-${Date.now()}`;
                console.log(
                    `collection 'dauphin' existed already. Previous one renamed to '${saveName}'. You may want to delete that old one if it was not meant to be there`,
                );
                await db.renameCollection("dauphin", saveName);
                await db.renameCollection("dauphin-gispro", "dauphin");
            }
        }
    },

    async down(db) {
        try {
            await db.renameCollection("dauphin", "dauphin-gispro");
        } catch (e) {
            if (e.codeName === "NamespaceExists") {
                console.log(JSON.stringify(e));
                const saveName = `dauphin-gispro-save-${Date.now()}`;
                console.log(
                    `collection 'dauphin-gispro' existed already. Previous one renamed to '${saveName}'. You may want to delete that old one if it was not meant to be there`,
                );
                await db.renameCollection("dauphin-gispro", saveName);
                await db.renameCollection("dauphin", "dauphin-gispro");
            }
        }
    },
};
