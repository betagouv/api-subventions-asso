import DEFAULT_ASSOCIATION from "../../../../tests/__fixtures__/association.fixture";
import Rna from "../../../identifier-objects/Rna";
import Siren from "../../../identifier-objects/Siren";
import Siret from "../../../identifier-objects/Siret";
import { STOCK_UNITE_LEGALE_ENTITY } from "../../providers/sirene/stock-unite-legale/@types/__fixtures__/sirene-stock-unite-legale.fixture";
import FindSiretFromAssociationIdentifierUseCase from "./find-siret-from-association-identifier.use-case";
import FindSiretFromRnaUseCase from "./find-siret-from-rna.use-case";
import FindSiretFromSirenUseCase from "./find-siret-from-siren.use-case";

describe("Association Use Cases", () => {
    const RNA = new Rna(DEFAULT_ASSOCIATION.rna);
    const SIREN = new Siren(DEFAULT_ASSOCIATION.siren);
    const SIRET = new Siret(DEFAULT_ASSOCIATION.siret);

    describe("FindSiretFromAssociationIdentifier", () => {
        const mockFindFromRna = { execute: jest.fn() };
        const mockFindFromSiren = { execute: jest.fn() };
        // @ts-expect-error: inject mock
        const useCase = new FindSiretFromAssociationIdentifierUseCase(mockFindFromRna, mockFindFromSiren);

        it("retrieves siret from rna", () => {
            useCase.execute(RNA);
            expect(mockFindFromRna.execute).toHaveBeenCalledWith(RNA);
        });

        it("retrieves siret from siren", () => {
            useCase.execute(SIREN);
            expect(mockFindFromSiren.execute).toHaveBeenCalledWith(SIREN);
        });

        it.each([RNA, SIREN])("return siret", async identifier => {
            mockFindFromSiren.execute.mockResolvedValue(SIRET);
            mockFindFromRna.execute.mockResolvedValue(SIRET);
            const expected = SIRET;
            const actual = await useCase.execute(identifier);
            expect(actual).toEqual(expected);
        });
    });

    describe("FindSiretFromRna", () => {
        const mockRnaSiren = {
            find: jest.fn().mockResolvedValue([{ siren: SIREN, rna: RNA }]),
        };
        const mockSirenePort = {
            findOneByRna: jest.fn().mockResolvedValue(STOCK_UNITE_LEGALE_ENTITY),
            findOneBySiren: jest.fn().mockResolvedValue(STOCK_UNITE_LEGALE_ENTITY),
        };

        // @ts-expect-error: inject mock
        const useCase = new FindSiretFromRnaUseCase(mockRnaSiren, mockSirenePort);

        it("find siren from rna-siren collection", () => {
            useCase.execute(RNA);
            expect(mockRnaSiren.find).toHaveBeenCalledWith(RNA);
        });

        it("find nic with siren from sirene unite legale", async () => {
            await useCase.execute(RNA);
            expect(mockSirenePort.findOneBySiren).toHaveBeenCalledWith(SIREN);
        });

        it("find siren unite legale from sirene when rna-siren does not match", async () => {
            mockRnaSiren.find.mockResolvedValueOnce(null);
            await useCase.execute(RNA);
            expect(mockSirenePort.findOneByRna).toHaveBeenCalledWith(RNA);
        });

        it("returns siret from unite legale", async () => {
            mockRnaSiren.find.mockResolvedValueOnce(null);
            const expected = SIRET;
            const actual = await useCase.execute(RNA);
            expect(actual).toEqual(expected);
        });
    });

    describe("FindSiretFromSiren", () => {
        const mockSirenePort = {
            findOneBySiren: jest.fn().mockResolvedValue(STOCK_UNITE_LEGALE_ENTITY),
        };

        // @ts-expect-error inject mock
        const useCase = new FindSiretFromSirenUseCase(mockSirenePort);

        it("find unite legale", () => {
            useCase.execute(SIREN);
            expect(mockSirenePort.findOneBySiren).toHaveBeenCalledWith(SIREN);
        });

        it("returns siret from unite legale", async () => {
            const expected = SIRET;
            const actual = await useCase.execute(SIREN);
            expect(actual).toEqual(expected);
        });
    });
});
