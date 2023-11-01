const {
    default: chorusLineRepository,
} = require("../build/src/modules/providers/chorus/repositories/chorus.line.repository.js");

const { ChorusService } = require("../build/src/modules/providers/chorus/chorus.service.js");

module.exports = {
    async up(db) {
        const chorusCursor = chorusLineRepository.cursorFind();

        const buildUpdateOne = (document, newId) => ({
            updateOne: {
                filter: {
                    uniqueId: document.uniqueId,
                    "indexedInformations.numeroDemandePayment": document.indexedInformations.numeroDemandePayment,
                },
                update: { $set: { uniqueId: newId } },
            },
        });

        let ops = [];
        while (await chorusCursor.hasNext()) {
            const document = await chorusCursor.next();

            // if migration failed and we run it again, prevent appending another DP at the end of the uniqueID
            if (document.uniqueId.endsWith(document.indexedInformations.numeroDemandePayment)) continue;

            const newId = ChorusService.buildUniqueId(document);
            ops.push(buildUpdateOne(document, newId));
            if (ops.length === 1000) {
                console.log("start bulkwrite");
                await db.collection("chorus-line").bulkWrite(ops);
                ops = [];
                console.log("end bulkwrite");
            }
        }

        if (ops.length) {
            console.log("start last bulkwrite");
            await db.collection("chorus-line").bulkWrite(ops);
            console.log("end last bulkwrite");
        }
    },
};
