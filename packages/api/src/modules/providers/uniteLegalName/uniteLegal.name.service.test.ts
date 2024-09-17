import uniteLegalNamePort from "../../../dataProviders/db/uniteLegalName/uniteLegalName.port";
import rnaSirenService from "../../rna-siren/rnaSiren.service";
import { AssociationIdentifiers } from "../../../@types";
import * as SirenHelper from "../../../shared/helpers/SirenHelper";
import * as Validators from "../../../shared/Validators";
import UniteLegalNameEntity from "../../../entities/UniteLegalNameEntity";
import uniteLegalNameService from "./uniteLegal.name.service";
import AssociationNameEntity from "../../association-name/entities/AssociationNameEntity";

jest.mock("../../../dataProviders/db/uniteLegalName/uniteLegalName.port");
jest.mock("../../rna-siren/rnaSiren.service");
jest.mock("../../../shared/helpers/SirenHelper");
jest.mock("../../../shared/Validators");

const mockedUniteLegalNamePort = uniteLegalNamePort as jest.Mocked<typeof uniteLegalNamePort>;
const mockedRnaSirenService = rnaSirenService as jest.Mocked<typeof rnaSirenService>;
const mockedSirenHelper = SirenHelper as jest.Mocked<typeof SirenHelper>;
const mockedValidators = Validators as jest.Mocked<typeof Validators>;

describe("uniteLegalNameService", () => {
    const SIREN = "123456789";
    const RNA = "W1234567";
    const fakeUniteLegalNameEntity = new UniteLegalNameEntity(
        SIREN,
        "Fake Name",
        `${SIREN} - Fake Name`,
        new Date(),
        "9210",
    );

    describe("getNameFromIdentifier", () => {
        it("should return null for unknown identifier", async () => {
            mockedRnaSirenService.find.mockResolvedValueOnce(null);
            const result = await uniteLegalNameService.getNameFromIdentifier(SIREN);
            expect(result).toBeNull();
        });

        it("should return UniteLegalNameEntity for known identifier", async () => {
            mockedRnaSirenService.find.mockResolvedValueOnce([{ siren: SIREN, rna: RNA }]);
            mockedUniteLegalNamePort.findOneBySiren.mockResolvedValueOnce(fakeUniteLegalNameEntity);

            const result = await uniteLegalNameService.getNameFromIdentifier(
                "knownIdentifier" as AssociationIdentifiers,
            );
            expect(result).toEqual(fakeUniteLegalNameEntity);
        });
    });

    describe("searchBySirenSiretName", () => {
        it("should return empty array for unknown identifier", async () => {
            mockedUniteLegalNamePort.search.mockResolvedValueOnce([]);
            const result = await uniteLegalNameService.searchBySirenSiretName("unknownIdentifier");
            expect(result).toEqual([]);
        });

        it("should return matched associations", async () => {
            mockedUniteLegalNamePort.search.mockResolvedValueOnce([fakeUniteLegalNameEntity]);
            const expected = new AssociationNameEntity(fakeUniteLegalNameEntity.name, SIREN, undefined, "9210");
            const result = await uniteLegalNameService.searchBySirenSiretName("knownIdentifier");
            expect(result).toEqual([expected]);
        });

        it("should handle cases where there are multiple rnaSiren entities for the same siren", async () => {
            const expected = [
                new AssociationNameEntity(fakeUniteLegalNameEntity.name, SIREN, RNA, "9210"),
                new AssociationNameEntity(fakeUniteLegalNameEntity.name, SIREN, "W987654321", "9210"),
            ];

            mockedUniteLegalNamePort.search.mockResolvedValueOnce([fakeUniteLegalNameEntity]);

            // Mocking multiple rnaSiren entities for the same siren
            mockedRnaSirenService.find.mockResolvedValueOnce([
                { siren: SIREN, rna: RNA },
                { siren: SIREN, rna: "W987654321" },
            ]);

            const result = await uniteLegalNameService.searchBySirenSiretName("knownIdentifier");
            // Ensure that each rna entity is adapted separately
            expect(result).toEqual(expected);
        });

        it("should handle cases where the value is a start of siret", async () => {
            mockedUniteLegalNamePort.search.mockResolvedValueOnce([fakeUniteLegalNameEntity]);
            mockedValidators.isStartOfSiret.mockReturnValue(true);
            const expected = new AssociationNameEntity(fakeUniteLegalNameEntity.name, SIREN, undefined, "9210");

            const result = await uniteLegalNameService.searchBySirenSiretName(SIREN);
            expect(result).toEqual([expected]);
            expect(mockedValidators.isStartOfSiret).toHaveBeenCalledWith(SIREN);
            expect(mockedSirenHelper.siretToSiren).toHaveBeenCalledWith(SIREN);
        });
    });

    describe("insert", () => {
        it("should call uniteLegalNamePort.insert with the provided entity", () => {
            uniteLegalNameService.insert(fakeUniteLegalNameEntity);
            expect(mockedUniteLegalNamePort.insert).toHaveBeenCalledWith(fakeUniteLegalNameEntity);
        });
    });
});
