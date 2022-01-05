import LeCompteAssoFileEntity from "./entities/LeCompteAssoFileEntity";

export default class LeCompteAssoParser {
    public static parse(content: Buffer): LeCompteAssoFileEntity[] {
        const raws = content
            .toString()
            .split("\n") // Select line by line
            .map(raw => raw.split(";")) // Parse column
            .slice(1); // First raws is header

        return raws.map(raw => {
            return new LeCompteAssoFileEntity(
                raw[0],
                raw[1],
                raw[2],
                raw[3],
                raw[4],
                raw[5],
                raw[6] as unknown as number,
                raw[7] as unknown as number,
                raw[8] as unknown as number,
                raw[9],
                raw[10],
                raw[11],
                raw[12],
                raw[13],
                raw[14],
                raw[15],
                raw[16],
            )
        })
    }
}