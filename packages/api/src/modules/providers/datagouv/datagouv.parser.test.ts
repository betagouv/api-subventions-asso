import fs from "fs"
import DataGouvParser from "./datagouv.parser";

describe("DataGouvParser", () => {
    describe("parseUniteLegalHistory", () => {
        const spys: jest.SpyInstance[] = [];
        const buildStreamMock = (buffer: Buffer) => {
            let streamPromise: Promise<void> = Promise.resolve();
            const stream = {
                on: (status: string, callback: (_?: Buffer) => Promise<void> ) => {
                    if (status === "data") {
                        streamPromise = new Promise((resolve) => {
                            callback(buffer).then(() => {
                                resolve();
                            });
                        })

                    } else if (status === "end") {
                        streamPromise.then(() => callback())
                    }
                },
                pause: jest.fn(),
                resume:  jest.fn()
            } as unknown as fs.ReadStream;

            spys.push(
                jest.spyOn(fs, "createReadStream").mockImplementationOnce(() => stream),
            )

            return {
                mockPause: stream.pause,
                mockResume: stream.resume,
            }
        }

        const buildFileContent = (data: {siren: string, dateDebut: string}[]) => {
            const textContent =  data.reduce((acc, data) => {
                return `${acc}\n${data.siren};${data.dateDebut};`
            }, "siren;dateDebut");

            return Buffer.from(textContent, "utf-8");
        }

        beforeEach(() => {
            spys.push(
                jest.spyOn(fs, "statSync").mockImplementationOnce(() => ({ size: 1000 * 1000 }) as fs.Stats),
            )
        })

        afterEach(() => {
            spys.forEach(s => s.mockClear())
        });

        it("should be parse one entity", async () => {
            const buffer = buildFileContent([{
                siren: "000000001",
                dateDebut: "1970-01-01",
            }]);

            buildStreamMock(buffer);

            const mock = jest.fn();

            await DataGouvParser.parseUniteLegalHistory("FAKE_PATH", null, mock);

            expect(mock).toBeCalledTimes(1);
            expect(mock).toBeCalledWith(
                expect.objectContaining({ siren: "000000001"}),
                expect.any(Function),
                expect.any(Function),
            );
        })

        it("should be parse 1000 entries", async () => {
            const data: any[] = [];
            for (let i = 0; i < 10000; i++) {
                data.push({
                    siren: ("000000000" + i).slice(-9),
                    dateDebut: "1970-01-01",
                })
            }

            const buffer = buildFileContent(data);

            buildStreamMock(buffer);

            const mock = jest.fn();

            await DataGouvParser.parseUniteLegalHistory("FAKE_PATH", null, mock);

            expect(mock).toBeCalledTimes(10000);
        })

        it("should call pause stream and resume stream", async () => {
            const buffer = buildFileContent([{
                siren: "000000001",
                dateDebut: "1970-01-01",
            }]);

            const mocks = buildStreamMock(buffer);

            await DataGouvParser.parseUniteLegalHistory("FAKE_PATH", null, async (_, streamPause, streamResume) => {
                streamPause();
                streamResume();
            });

            expect(mocks.mockPause).toBeCalledTimes(1);
            expect(mocks.mockResume).toBeCalledTimes(1);
        })

        it("should not save entity beacause import date > date debut", async () => {
            const buffer = buildFileContent([{
                siren: "000000001",
                dateDebut: "1970-01-01",
            }]);

            buildStreamMock(buffer);

            const mock = jest.fn();

            await DataGouvParser.parseUniteLegalHistory("FAKE_PATH", new Date('1990-01-01'), mock);

            expect(mock).toBeCalledTimes(0);
        })

        it("should not save entity beacause date debut > now", async () => {
            const buffer = buildFileContent([{
                siren: "000000001",
                dateDebut: "2999-01-01",
            }]);

            buildStreamMock(buffer);

            const mock = jest.fn();

            await DataGouvParser.parseUniteLegalHistory("FAKE_PATH", new Date('1990-01-01'), mock);

            expect(mock).toBeCalledTimes(0);
        })
    })
})
