import fs from "fs"
import DataGouvParser from "../../../../src/modules/providers/datagouv/datagouv.parser";

describe("DataGouvParser", () => {
    describe("parseUniteLegal", () => {
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

        const buildFileContent = (data: {siren: string, categorieJuridiqueUniteLegale: string, identifiantAssociationUniteLegale:string}[]) => {
            const textContent =  data.reduce((acc, data) => {
                return `${acc}\n${data.siren};${data.categorieJuridiqueUniteLegale};${data.identifiantAssociationUniteLegale};`
            }, "siren;categorieJuridiqueUniteLegale;identifiantAssociationUniteLegale");

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

        it("should be parse one entreprise", async () => {
            const buffer = buildFileContent([{
                siren: "000000001",
                categorieJuridiqueUniteLegale: "FAKE",
                identifiantAssociationUniteLegale: "",
            }]);

            buildStreamMock(buffer);

            const mock = jest.fn();

            await DataGouvParser.parseUniteLegal("FAKE_PATH", mock);

            expect(mock).toBeCalledTimes(1);
            expect(mock).toBeCalledWith(
                expect.objectContaining({ _id: "000000001"}),
                expect.any(Function),
                expect.any(Function),
            );
        })

        it("should be parse 1000 entreprise", async () => {
            const data = [];
            for (let i = 0; i < 10000; i++) {
                data.push({
                    siren: ("000000000" + i).slice(-9),
                    categorieJuridiqueUniteLegale: "FAKE",
                    identifiantAssociationUniteLegale: "",
                })
            }

            const buffer = buildFileContent(data);

            buildStreamMock(buffer);

            const mock = jest.fn();

            await DataGouvParser.parseUniteLegal("FAKE_PATH", mock);

            expect(mock).toBeCalledTimes(10000);
        })

        it("should be parse one rna-siren", async () => {
            const buffer = buildFileContent([{
                siren: "000000001",
                categorieJuridiqueUniteLegale: "9220",
                identifiantAssociationUniteLegale: "W000000000",
            }]);

            buildStreamMock(buffer);

            const mock = jest.fn();

            await DataGouvParser.parseUniteLegal("FAKE_PATH", mock);

            expect(mock).toBeCalledTimes(1);
            expect(mock).toBeCalledWith(
                expect.objectContaining({ siren: "000000001", rna: "W000000000"}),
                expect.any(Function),
                expect.any(Function),
            );
        })

        it("should be parse 1000 rna-siren", async () => {
            const data = [];
            for (let i = 0; i < 10000; i++) {
                data.push({
                    siren: ("000000000" + i).slice(-9),
                    categorieJuridiqueUniteLegale: "9220",
                    identifiantAssociationUniteLegale: "W" + (("000000000" + i).slice(-9)),
                });
            }

            const buffer = buildFileContent(data);

            buildStreamMock(buffer);

            const mock = jest.fn();

            await DataGouvParser.parseUniteLegal("FAKE_PATH", mock);

            expect(mock).toBeCalledTimes(10000);
        })

        it("should be parse one rna-siren and on entreprise", async () => {
            const buffer = buildFileContent([
                {
                    siren: "000000001",
                    categorieJuridiqueUniteLegale: "9220",
                    identifiantAssociationUniteLegale: "W000000000",
                },
                {
                    siren: "000000002",
                    categorieJuridiqueUniteLegale: "FAKE",
                    identifiantAssociationUniteLegale: "",
                }
            ]);

            buildStreamMock(buffer);

            const mock = jest.fn();

            await DataGouvParser.parseUniteLegal("FAKE_PATH", mock);

            expect(mock).toBeCalledTimes(2);
            expect(mock).toBeCalledWith(
                expect.objectContaining({ siren: "000000001", rna: "W000000000"}),
                expect.any(Function),
                expect.any(Function),
            );

            expect(mock).toBeCalledWith(
                expect.objectContaining({ _id: "000000002" }),
                expect.any(Function),
                expect.any(Function),
            );
        })

        it("should call pause stream and resume stream", async () => {
            const buffer = buildFileContent([{
                siren: "000000001",
                categorieJuridiqueUniteLegale: "FAKE",
                identifiantAssociationUniteLegale: "",
            }]);

            const mocks = buildStreamMock(buffer);

            await DataGouvParser.parseUniteLegal("FAKE_PATH", async (_, streamPause, streamResume) => {
                streamPause();
                streamResume();
            });

            expect(mocks.mockPause).toBeCalledTimes(1);
            expect(mocks.mockResume).toBeCalledTimes(1);
        })
    })
})
