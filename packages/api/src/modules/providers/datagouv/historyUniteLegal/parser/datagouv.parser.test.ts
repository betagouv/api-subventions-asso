import fs from "fs";
import DataGouvHistoryLegalUnitParser from "./dataGouvHistoryLegalUnitParser";

describe("DataGouvParser", () => {
    const now = new Date();
    describe("isDatesValid", () => {
        it("should return false if periodStart is not valid", () => {
            // @ts-expect-error: private method
            const actual = DataGouvHistoryLegalUnitParser.isDatesValid({
                // @ts-expect-error: invalid date
                periodStart: "2022-0a-02",
                importDate: new Date("2022-10-01"),
                now,
            });
            expect(actual).toBeFalsy();
        });

        it("should return false because periodStart is not effective yet", () => {
            // today + one year
            const periodStart = (date => {
                date.setFullYear(date.getFullYear() + 1);
                return date;
            })(new Date());
            // @ts-expect-error
            const actual = DataGouvHistoryLegalUnitParser.isDatesValid({
                periodStart,
                importDate: null,
                now,
            });
            expect(actual).toBeFalsy();
        });

        it("should return false because periodStart < importDate", () => {
            // @ts-expect-error
            const actual = DataGouvHistoryLegalUnitParser.isDatesValid({
                periodStart: new Date("2022-11-01"),
                importDate: new Date("2022-12-01"),
                now,
            });
            expect(actual).toBeFalsy();
        });

        it("should return true", () => {
            // today - 10 days
            const periodStart = (date => {
                date.setDate(date.getDate() - 10);
                return date;
            })(new Date());
            const importDate = (date => {
                date.setMonth(date.getMonth() - 1);
                return date;
            })(new Date());
            // @ts-expect-error
            const actual = DataGouvHistoryLegalUnitParser.isDatesValid({
                periodStart,
                importDate,
                now,
            });
            expect(actual).toBeTruthy();
        });
    });

    describe("parseUniteLegalHistory", () => {
        const spys: jest.SpyInstance[] = [];
        const buildStreamMock = (buffer: Buffer) => {
            let streamPromise: Promise<void> = Promise.resolve();
            const stream = {
                on: (status: string, callback: (_?: Buffer) => Promise<void>) => {
                    if (status === "data") {
                        streamPromise = new Promise(resolve => {
                            callback(buffer).then(() => {
                                resolve();
                            });
                        });
                    } else if (status === "end") {
                        streamPromise.then(() => callback());
                    }
                },
                pause: jest.fn(),
                resume: jest.fn(),
            } as unknown as fs.ReadStream;

            spys.push(jest.spyOn(fs, "createReadStream").mockImplementationOnce(() => stream));

            return {
                mockPause: stream.pause,
                mockResume: stream.resume,
            };
        };

        const buildFileContent = (data: { siren: string; dateDebut: string }[]) => {
            const textContent = data.reduce((acc, data) => {
                return `${acc}\n${data.siren};${data.dateDebut};`;
            }, "siren;dateDebut");

            return Buffer.from(textContent, "utf-8");
        };

        beforeEach(() => {
            spys.push(jest.spyOn(fs, "statSync").mockImplementationOnce(() => ({ size: 1000 * 1000 } as fs.Stats)));
        });

        it("should parse one entity", async () => {
            const buffer = buildFileContent([
                {
                    siren: "000000001",
                    dateDebut: "1970-01-01",
                },
            ]);

            buildStreamMock(buffer);

            const mock = jest.fn();

            await DataGouvHistoryLegalUnitParser.parseUniteLegalHistory("FAKE_PATH", mock);

            expect(mock).toBeCalledTimes(1);
            expect(mock).toBeCalledWith(
                expect.objectContaining({ siren: "000000001" }),
                expect.any(Function),
                expect.any(Function),
            );
        });

        it("should parse 1000 entries", async () => {
            const data: any[] = [];
            for (let i = 0; i < 10000; i++) {
                data.push({
                    siren: ("000000000" + i).slice(-9),
                    dateDebut: "1970-01-01",
                });
            }

            const buffer = buildFileContent(data);

            buildStreamMock(buffer);

            const mock = jest.fn();

            await DataGouvHistoryLegalUnitParser.parseUniteLegalHistory("FAKE_PATH", mock);

            expect(mock).toBeCalledTimes(10000);
        });

        it("should call pause stream and resume stream", async () => {
            const buffer = buildFileContent([
                {
                    siren: "000000001",
                    dateDebut: "1970-01-01",
                },
            ]);

            const mocks = buildStreamMock(buffer);

            await DataGouvHistoryLegalUnitParser.parseUniteLegalHistory(
                "FAKE_PATH",
                async (_, streamPause, streamResume) => {
                    streamPause();
                    streamResume();
                },
            );

            expect(mocks.mockPause).toBeCalledTimes(1);
            expect(mocks.mockResume).toBeCalledTimes(1);
        });
    });
});
