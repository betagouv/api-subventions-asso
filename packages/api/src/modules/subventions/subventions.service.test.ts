import subventionsService from "./subventions.service";
import AssociationIdentifier from "../../identifier-objects/AssociationIdentifier";
import Rna from "../../identifier-objects/Rna";
import applicationFlatService from "../application-flat/application-flat.service";
import { DemandeSubvention } from "dto";

jest.mock("../application-flat/application-flat.service");

const IDENTIFIER = AssociationIdentifier.fromRna(new Rna("W123456789"));

describe("SubventionsService", () => {
    describe("getDemandes()", () => {
        it("get demandes subvention", async () => {
            await subventionsService.getDemandes(IDENTIFIER);
            expect(applicationFlatService.getApplication).toHaveBeenCalledWith(IDENTIFIER);
        });

        it("should return subventions", async () => {
            jest.spyOn(applicationFlatService, "getApplication").mockResolvedValue([
                { id: "1" },
            ] as unknown as DemandeSubvention[]);
            const result = await subventionsService.getDemandes(IDENTIFIER);
            expect(result).toEqual([{ id: "1" }]);
        });
    });
});
