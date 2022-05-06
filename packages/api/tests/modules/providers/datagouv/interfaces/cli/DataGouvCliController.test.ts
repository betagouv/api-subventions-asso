import fs from "fs"
import DataGouvCliController from '../../../../../../src/modules/providers/datagouv/interfaces/cli/datagouv.cli.controller'
import Parser from '../../../../../../src/modules/providers/datagouv/datagouv.parser'
import datagouvService from '../../../../../../src/modules/providers/datagouv/datagouv.service'
import rnaSirenService from '../../../../../../src/modules/open-data/rna-siren/rnaSiren.service'
import RnaSiren from '../../../../../../src/modules/open-data/rna-siren/entities/RnaSirenEntity';
import EntrepriseSirenEntity from '../../../../../../src/modules/providers/datagouv/entities/EntrepriseSirenEntity';
import * as ParserHelper from "../../../../../../src/shared/helpers/ParserHelper";

describe("DataGouvCliController", () => {
    const spys: jest.SpyInstance<unknown>[] = [];
    beforeAll(() => {
        spys.push(
            jest.spyOn(Parser, 'parseUniteLegal'),
            jest.spyOn(rnaSirenService, 'insertMany'),
            jest.spyOn(datagouvService, 'insertManyEntrepriseSiren'),
            jest.spyOn(ParserHelper, 'findFiles'),
            jest.spyOn(console, 'log').mockImplementation()
        )
    });

    afterEach(() => {
        spys.forEach(spy => {
            spy.mockClear();
        })
    })

    describe("parse_unite_legal", () => {
        let controller: DataGouvCliController;
        beforeEach(() => {
            controller = new DataGouvCliController()
            spys.push(
                jest.spyOn(controller as unknown as { _parse: () => Promise<null> }, '_parse').mockImplementation(() => Promise.resolve(null)),
                jest.spyOn(fs, 'existsSync'),
            )
        });
            
        

        it('should be call _parse', async () => {
            (fs.existsSync as jest.Mock).mockImplementationOnce(() => true);
            (ParserHelper.findFiles as jest.Mock).mockImplementationOnce((file) => [file]);
            await controller.parse_unite_legal("FAKE_PATH");

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            expect(controller._parse).toHaveBeenCalledTimes(1);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            expect(controller._parse).toHaveBeenCalledWith("FAKE_PATH", []);
        })

        it('should be throw file not found error', async () => {
            (fs.existsSync as jest.Mock).mockImplementationOnce(() => false);
            await expect(controller.parse_unite_legal("FAKE_PATH")).rejects.toThrowError(`File not found FAKE_PATH`);
        })

        it('should be throw file not found error', async () => {
            await expect(controller.parse_unite_legal(undefined as unknown as string)).rejects.toThrowError("Parse command need file args");
        })
    });

    describe("_parse", () => {
        let controller: DataGouvCliController;
        beforeEach(() => {
            controller = new DataGouvCliController()
        });

        it("should save EntrepriseSirenEntity entities with two chunk", async () => {
            (Parser.parseUniteLegal as jest.Mock).mockImplementationOnce((file, save) => {
                for (let i = 0; i < 1002; i++) {
                    save(new EntrepriseSirenEntity("SIREN-" + i), () => null, () => null);
                }
            }) 
            
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            await controller._parse("fake_path", []);
        
            expect(datagouvService.insertManyEntrepriseSiren).toHaveBeenCalledTimes(2);
            expect(datagouvService.insertManyEntrepriseSiren).toHaveBeenLastCalledWith(expect.any(Array), true);
            expect((datagouvService.insertManyEntrepriseSiren as jest.Mock).mock.calls[0][0]).toHaveLength(1000);
            expect((datagouvService.insertManyEntrepriseSiren as jest.Mock).mock.calls[1][0]).toHaveLength(2);
        });

        it("should save rna-siren entities with two chunk", async () => {
            (Parser.parseUniteLegal as jest.Mock).mockImplementationOnce((file, save) => {
                for (let i = 0; i < 1002; i++) {
                    save(new RnaSiren("RNA-" + i, "SIREN-" + i), () => null, () => null);
                }
            }) 

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            await controller._parse("fake_path", []);

            expect(rnaSirenService.insertMany).toHaveBeenCalledTimes(2);
            expect(rnaSirenService.insertMany).toHaveBeenLastCalledWith(expect.any(Array));
            expect((rnaSirenService.insertMany as jest.Mock).mock.calls[0][0]).toHaveLength(1000);
            expect((rnaSirenService.insertMany as jest.Mock).mock.calls[1][0]).toHaveLength(2);
        });

        it("should save one rna-siren entity", async () => {
            const rnaSirenEntity = new RnaSiren("RNA", "SIREN");
            (Parser.parseUniteLegal as jest.Mock).mockImplementationOnce((file, save) => {
                save(rnaSirenEntity);
            }) 
        
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            await controller._parse("fake_path", []);

            expect(rnaSirenService.insertMany).toHaveBeenCalledTimes(1);
            expect(rnaSirenService.insertMany).toHaveBeenCalledWith([rnaSirenEntity]);
        });

        it("should save one EntrepriseSirenEntity entity", async () => {
            const entrepriseSirenEnity = new EntrepriseSirenEntity("SIREN");
            (Parser.parseUniteLegal as jest.Mock).mockImplementationOnce((file, save) => {
                save(entrepriseSirenEnity);
            }) 
        
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            await controller._parse("fake_path", []);

            expect(datagouvService.insertManyEntrepriseSiren).toHaveBeenCalledTimes(1);
            expect(datagouvService.insertManyEntrepriseSiren).toHaveBeenCalledWith([entrepriseSirenEnity], true);
        });

        it("should save EntrepriseSirenEntity and RnaSiren entities with two chunk", async () => {
            (Parser.parseUniteLegal as jest.Mock).mockImplementationOnce((file, save) => {
                for (let i = 0; i < 1002; i++) {
                    save(new EntrepriseSirenEntity("SIREN-" + i), () => null, () => null);
                    save(new RnaSiren("RNA-" + i, "SIREN-" + i), () => null, () => null);
                }
            }) 
        
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            await controller._parse("fake_path", []);

            expect(datagouvService.insertManyEntrepriseSiren).toHaveBeenCalledTimes(2);
            expect(datagouvService.insertManyEntrepriseSiren).toHaveBeenLastCalledWith(expect.any(Array), true);
            expect((datagouvService.insertManyEntrepriseSiren as jest.Mock).mock.calls[0][0]).toHaveLength(1000);
            expect((datagouvService.insertManyEntrepriseSiren as jest.Mock).mock.calls[1][0]).toHaveLength(2);

            expect(rnaSirenService.insertMany).toHaveBeenCalledTimes(2);
            expect(rnaSirenService.insertMany).toHaveBeenLastCalledWith(expect.any(Array));
            expect((rnaSirenService.insertMany as jest.Mock).mock.calls[0][0]).toHaveLength(1000);
            expect((rnaSirenService.insertMany as jest.Mock).mock.calls[1][0]).toHaveLength(2);
        });

    });
});
