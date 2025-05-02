const fs = require("fs");
const xlsx = require("node-xlsx");

const getPageUrlByName = require("./getPageUrlByName");
const getPhoneInAnnuairePage = require("./getPhoneInAnnuairePage");

function normalizeLine(line, header) {
    header.forEach((h, index) => {
        if (line[index]) return;
        line[index] = undefined;
    });

    return line;
}

async function main() {
    const userBddFilePath = process.argv[2];

    if (!fs.existsSync(userBddFilePath)) {
        console.error("User bdd file not found");
        process.exit(1);
    }

    const buffer = fs.readFileSync(userBddFilePath);
    const xls = xlsx.parse(buffer);

    const page = xls[0];
    const header = page.data[0];
    const indexNameHeader = header.findIndex(h => h.includes("Nom"));
    const data = page.data.slice(1);

    const notFound = [];

    await data.reduce(async (promiseStack, line, index) => {
        await promiseStack;
        console.log(`${index}/${data.length}`);
        line = normalizeLine(line, header);
        const name = line[indexNameHeader];
        const url = await getPageUrlByName(name);
        if (!url) {
            notFound.push(name);
            return;
        }
        const phone = await getPhoneInAnnuairePage(url);
        if (!phone) {
            notFound.push(name);
            return;
        }
        line[header.length] = phone;
    }, Promise.resolve());

    header.push("Personne - Téléphone");

    fs.writeFileSync("log.scrapping-lannuaire.json", JSON.stringify(notFound));

    const newFileBuffer = xlsx.build([
        {
            name: page.name,
            data: [header, ...data],
        },
    ]);

    fs.writeFileSync(userBddFilePath, newFileBuffer);
}

main();
