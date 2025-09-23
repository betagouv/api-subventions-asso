import uniteLegalNamePort from "../../../dataProviders/db/uniteLegalName/uniteLegalName.port";
import rnaSirenService from "../../rna-siren/rnaSiren.service";
import UniteLegalNameEntity from "../../../entities/UniteLegalNameEntity";
import uniteLegalNameService from "./uniteLegal.name.service";
import AssociationNameEntity from "../../association-name/entities/AssociationNameEntity";
import Siren from "../../../identifierObjects/Siren";
import Rna from "../../../identifierObjects/Rna";
import AssociationIdentifier from "../../../identifierObjects/AssociationIdentifier";
import Siret from "../../../identifierObjects/Siret";

jest.mock("../../../dataProviders/db/uniteLegalName/uniteLegalName.port");
jest.mock("../../rna-siren/rnaSiren.service");
jest.mock("../../../shared/Validators");

const mockedUniteLegalNamePort = uniteLegalNamePort as jest.Mocked<typeof uniteLegalNamePort>;
const mockedRnaSirenService = rnaSirenService as jest.Mocked<typeof rnaSirenService>;

describe("uniteLegalNameService", () => {
    const SIREN = new Siren("123456789");
    const RNA = new Rna("W123456789");
    const RNA_IDENTIFIER = AssociationIdentifier.fromRna(RNA);
    const fakeUniteLegalNameEntity = new UniteLegalNameEntity(SIREN, "Fake Name", `${SIREN} - Fake Name`, new Date());

    let fromPartialSiretStrMock: jest.SpyInstance;

    beforeAll(() => {
        fromPartialSiretStrMock = jest.spyOn(Siren, "fromPartialSiretStr");
    });

    describe("getNameFromIdentifier", () => {
        it("should return null for unknown identifier", async () => {
            const result = await uniteLegalNameService.getNameFromIdentifier(RNA_IDENTIFIER);
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
            const result = await uniteLegalNameService.searchBySirenSiretName("unknownIdentifier");
            expect(result).toEqual([]);
        });

        it("should return matched associations", async () => {
            mockedUniteLegalNamePort.search.mockResolvedValueOnce([fakeUniteLegalNameEntity]);
            const expected = new AssociationNameEntity(fakeUniteLegalNameEntity.name, SIREN);
            const result = await uniteLegalNameService.searchBySirenSiretName("knownIdentifier");
            expect(result).toEqual([expected]);
        });

        it("should handle cases where there are multiple rnaSiren entities for the same siren", async () => {
            const expected = [
                new AssociationNameEntity(fakeUniteLegalNameEntity.name, SIREN, RNA),
                new AssociationNameEntity(fakeUniteLegalNameEntity.name, SIREN, new Rna("W987654321")),
            ];

            mockedUniteLegalNamePort.search.mockResolvedValueOnce([fakeUniteLegalNameEntity]);

            // Mocking multiple rnaSiren entities for the same siren
            mockedRnaSirenService.find.mockResolvedValueOnce([
                { siren: SIREN, rna: RNA },
                { siren: SIREN, rna: new Rna("W987654321") },
            ]);

            const result = await uniteLegalNameService.searchBySirenSiretName("knownIdentifier");
            // Ensure that each rna entity is adapted separately
            expect(result).toEqual(expected);
        });

        it("should handle cases where the value is a start of siret", async () => {
            mockedUniteLegalNamePort.search.mockResolvedValueOnce([fakeUniteLegalNameEntity]);
            isStartOfSiretMock.mockReturnValue(true);
            const expected = new AssociationNameEntity(fakeUniteLegalNameEntity.name, SIREN);

            const result = await uniteLegalNameService.searchBySirenSiretName(SIREN.value);
            expect(result).toEqual([expected]);
            expect(isStartOfSiretMock).toHaveBeenCalledWith(SIREN.value);
            expect(fromPartialSiretStrMock).toHaveBeenCalledWith(SIREN.value);
        });
    });

    describe("upsert", () => {
        it("should call uniteLegalNamePort.upsert with the provided entity", () => {
            uniteLegalNameService.upsert(fakeUniteLegalNameEntity);
            expect(mockedUniteLegalNamePort.upsert).toHaveBeenCalledWith(fakeUniteLegalNameEntity);
        });
    });
});
