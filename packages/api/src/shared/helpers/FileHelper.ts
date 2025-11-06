import jschardet from "jschardet";

export function detectCsvDelimiter(fileContent: Buffer): string {
    const sampleSize = Math.min(fileContent.length, 4096);
    const sampleBuffer = fileContent.subarray(0, sampleSize);

    const detected = jschardet.detect(sampleBuffer);
    const encoding = (detected?.encoding || "UTF-8") as BufferEncoding;

    const decoder = new TextDecoder(encoding);
    const content = decoder.decode(sampleBuffer);

    const delimiters = [";", ",", "\t"];
    const counts = delimiters.map(d => ({
        delimiter: d,
        count: (content.match(new RegExp(`\\${d}`, "g")) || []).length,
    }));

    counts.sort((a, b) => b.count - a.count);
    return counts[0].count > 0 ? counts[0].delimiter : ";";
}
