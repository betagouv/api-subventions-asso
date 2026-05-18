// Usage: node remove-empty-files.js /path/to/folder

const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const folder = process.argv[2];

if (!folder) {
    console.error("Usage: node remove-empty-files.js <folder>");
    process.exit(1);
}

const files = fs.readdirSync(folder).filter(f => /\.xlsx?$/i.test(f)); // filter .xlsx or .xls

let deleteCount = 0;
for (const file of files) {
    const fullPath = path.join(folder, file);

    try {
        const workbook = XLSX.readFile(fullPath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]]; // select first sheet (SuiviActions_FDVA)

        const rows = XLSX.utils.sheet_to_json(sheet, {
            header: 1,
            blankrows: false,
            defval: "", // ease the filter below
        });

        // remove 2 header + 1 footer
        const dataRows = rows.slice(2, -1);

        const nonEmptyRows = dataRows.filter(row => row.some(cell => String(cell).trim() !== ""));

        if (nonEmptyRows.length === 0) {
            fs.unlinkSync(fullPath);
            deleteCount++;
            console.log(`Deleted: ${file}`);
        } else {
            console.log(`Kept: ${file}`);
        }
    } catch (err) {
        console.error(`Error processing ${file}:`, err.message);
    }
}
console.log(`${deleteCount} files were removed from ${folder}`);
