// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import path from "path";
import GisproCliController from "../../../../../../src/modules/providers/gispro/interfaces/cli/gispro.cli.controller"
import GisproParser from "../../../../../../src/modules/providers/gispro/gispro.parser";

const filePath = path.resolve(__dirname, "../../__fixtures__/gispro.xlsx");

describe("GisproCliController", () => {
    let controller: GisproCliController;
    const spys: jest.SpyInstance<unknown>[] = [];
    beforeAll(() => {
        spys.push(
            jest.spyOn(GisproParser, 'parseRequests'),
        )
    });

    afterAll(() => {
        spys.forEach(spy => spy.mockReset());
    });

    describe('validate()', () => {
        beforeEach(() => {
            controller = new GisproCliController;
        })

        it('should throw an error with wrong first param', () => {
            const expected = "Validate command need type and file args";
            let actual = "";
            try {
                controller.validate(1234, '');
            } catch (e) {
                actual = e.message;
            }
            expect(actual).toEqual(expected);
        })

        it('should throw an error with wrong second param', () => {
            const expected = "Validate command need type and file args";
            let actual = "";
            try {
                controller.validate("requests", []);
            } catch (e) {
                actual = e.message;
            }
            expect(actual).toEqual(expected);
        })

        it('should throw an error if the file does not exists', () => {
            const expected = "File not found ./myFile";
            let actual = "";
            try {
                controller.validate("requests", './myFile');
            } catch (e) {
                actual = e.message;
            }
            expect(actual).toEqual(expected);
        });

        it('should throw an error if the action type is not found', () => {
            const expected = "The type request is not found";
            let actual = "";
            try {
                controller.validate("request", filePath);
            } catch (e) {
                actual = e.message;
            }
            expect(actual).toEqual(expected);
        })
    });

    describe('parse()', () => {
        beforeEach(() => {
            controller = new GisproCliController;
        })

        describe('params error handling', () => {
            it('should throw an error with wrong first param', async () => {
                const expected = "Parse command need type and file args";
                let actual = "";
                try {
                    await controller.parse(1234, '');
                } catch (e) {
                    actual = e.message;
                }
                expect(actual).toEqual(expected);
            })
    
            it('should throw an error with wrong second param', async () => {
                const expected = "Parse command need type and file args";
                let actual = "";
                try {
                    await controller.parse("requests", []);
                } catch (e) {
                    actual = e.message;
                }
                expect(actual).toEqual(expected);
            })
    
            it('should throw an error if the file does not exists', async () => {
                const expected = "File not found ./myFile";
                let actual = "";
                try {
                    await controller.parse("requests", './myFile');
                } catch (e) {
                    actual = e.message;
                }
                expect(actual).toEqual(expected);
            });

            it('should throw an error if type is not handled', async () => {
                const expected = "The type requet is not taken into account";
                let actual = "";
                try {
                    await controller.parse("requet", filePath);
                } catch (e) {
                    actual = e.message;
                }
                expect(actual).toEqual(expected);
            } )
        })

        it('should call parseRequests()', async () => {
            await controller.parse("requests", filePath);
            expect(GisproParser.parseRequests).toHaveBeenCalled();
        });
    });
});