import uniteLegalNameAdapter from "../../../adapters/outputs/db/unite-legale-name/unite-legale-name.adapter";
import rnaSirenService from "../../rna-siren/rna-siren.service";
import UniteLegaleNameEntity from "../../../entities/UniteLegaleNameEntity";
import UniteLegaleNameService from "./unite-legale.name.service";
import AssociationNameEntity from "../../association-name/entities/AssociationNameEntity";
import Siren from "../../../identifier-objects/Siren";
import Rna from "../../../identifier-objects/Rna";
import AssociationIdentifier from "../../../identifier-objects/AssociationIdentifier";
import Siret from "../../../identifier-objects/Siret";

jest.mock("../../../adapters/outputs/db/unite-legale-name/unite-legale-name.adapter");
jest.mock("../../rna-siren/rna-siren.service");
jest.mock("../../../shared/Validators");

const mockedUniteLegalNamePort = uniteLegalNameAdapter as jest.Mocked<typeof uniteLegalNameAdapter>;
const mockedRnaSirenService = rnaSirenService as jest.Mocked<typeof rnaSirenService>;

describe("UniteLegaleNameService", () => {
    const SIREN = new Siren("123456789");
    const RNA = new Rna("W123456789");
    const RNA_IDENTIFIER = AssociationIdentifier.fromRna(RNA);
    const fakeUniteLegaleNameEntity = new UniteLegaleNameEntity(SIREN, "Fake Name", `${SIREN} - Fake Name`, new Date());

    let fromPartialSiretStrMock: jest.SpyInstance;

    beforeAll(() => {
        fromPartialSiretStrMock = jest.spyOn(Siren, "fromPartialSiretStr");
    });

    describe("getNameFromIdentifier", () => {
        it("should return null for unknown identifier", async () => {
            const result = await UniteLegaleNameService.getNameFromIdentifier(RNA_IDENTIFIER);
            expect(result).toBeNull();
        });
    });

    describe("searchBySirenSiretName", () => {
        let isStartOfSiretMock: jest.SpyInstance;

        beforeAll(() => {
            isStartOfSiretMock = jest.spyOn(Siret, "isStartOfSiret");
        });

        it("should return empty array for unknown identifier", async () => {
            mockedUniteLegalNamePort.search.mockResolvedValueOnce([]);
            const result = await UniteLegaleNameService.searchBySirenSiretName("unknownIdentifier");
            expect(result).toEqual([]);
        });

        it("should return matched associations", async () => {
            mockedUniteLegalNamePort.search.mockResolvedValueOnce([fakeUniteLegaleNameEntity]);
            const expected = new AssociationNameEntity(fakeUniteLegaleNameEntity.name, SIREN);
            const result = await UniteLegaleNameService.searchBySirenSiretName("knownIdentifier");
            expect(result).toEqual([expected]);
        });

        it("should handle cases where there are multiple rnaSiren entities for the same siren", async () => {
            const expected = [
                new AssociationNameEntity(fakeUniteLegaleNameEntity.name, SIREN, RNA),
                new AssociationNameEntity(fakeUniteLegaleNameEntity.name, SIREN, new Rna("W987654321")),
            ];

            mockedUniteLegalNamePort.search.mockResolvedValueOnce([fakeUniteLegaleNameEntity]);

            // Mocking multiple rnaSiren entities for the same siren
            mockedRnaSirenService.find.mockResolvedValueOnce([
                { siren: SIREN, rna: RNA },
                { siren: SIREN, rna: new Rna("W987654321") },
            ]);

            const result = await UniteLegaleNameService.searchBySirenSiretName("knownIdentifier");
            // Ensure that each rna entity is adapted separately
            expect(result).toEqual(expected);
        });

        it("should handle cases where the value is a start of siret", async () => {
            mockedUniteLegalNamePort.search.mockResolvedValueOnce([fakeUniteLegaleNameEntity]);
            isStartOfSiretMock.mockReturnValue(true);
            const expected = new AssociationNameEntity(fakeUniteLegaleNameEntity.name, SIREN);

            const result = await UniteLegaleNameService.searchBySirenSiretName(SIREN.value);
            expect(result).toEqual([expected]);
            expect(isStartOfSiretMock).toHaveBeenCalledWith(SIREN.value);
            expect(fromPartialSiretStrMock).toHaveBeenCalledWith(SIREN.value);
        });
    });

    describe("upsert", () => {
        it("should call uniteLegalNamePort.upsert with the provided entity", () => {
            UniteLegaleNameService.upsert(fakeUniteLegaleNameEntity);
            expect(mockedUniteLegalNamePort.upsert).toHaveBeenCalledWith(fakeUniteLegaleNameEntity);
        });
    });
});
