import Rna from "../../../../identifier-objects/Rna";
import Siret from "../../../../identifier-objects/Siret";
import RnaSirenEntity from "../../../../entities/RnaSirenEntity";
import OsirisRequestEntity from "../entities/OsirisRequestEntity";
import CompleteOsirisRequestUseCase from "./complete-osiris-request.use-case";
import { VALID_REQUEST_ERROR_CODE } from "../osiris.errors";
import { OSIRIS_ID, REQUEST_ENTITY } from "../__fixtures__/osiris.request.fixtures";
import { AssociationsHelper } from "../../../associations/associations.helper";
import { RnaSirenService } from "../../../rna-siren/rna-siren.service";

const SIRET = REQUEST_ENTITY.association?.siret as string;
const SIREN = new Siret(SIRET).toSiren();
const RNA = new Rna(REQUEST_ENTITY.association?.rna as string);
const INVALID_RNA = "NOT-AN-RNA";

const makeRequest = (overrides: { association?: object } = {}): OsirisRequestEntity =>
    ({
        dossier: { osirisId: OSIRIS_ID, exerciceBudgetaire: 2024 },
        association: { siret: SIRET, ...overrides.association },
        updateDate: new Date(),
    }) as unknown as OsirisRequestEntity;

describe("CompleteOsirisRequestUseCase", () => {
    let rnaSirenServiceMock: { find: jest.Mock };
    let associationHelperMock: { isIdentifierFromAsso: jest.Mock };
    let useCase: CompleteOsirisRequestUseCase;

    beforeEach(() => {
        rnaSirenServiceMock = { find: jest.fn().mockResolvedValue([]) };
        associationHelperMock = { isIdentifierFromAsso: jest.fn().mockResolvedValue(true) };
        useCase = new CompleteOsirisRequestUseCase(
            rnaSirenServiceMock as unknown as RnaSirenService,
            associationHelperMock as unknown as AssociationsHelper,
        );
    });

    it("does not look up rna when rna is already valid", async () => {
        await useCase.execute(makeRequest({ association: { rna: RNA.value } }));
        expect(rnaSirenServiceMock.find).not.toHaveBeenCalled();
    });

    it("sets recovered rna when rna is invalid", async () => {
        rnaSirenServiceMock.find.mockResolvedValueOnce([new RnaSirenEntity(RNA, SIREN)]);
        const request = makeRequest({ association: { rna: INVALID_RNA } });
        await useCase.execute(request);
        expect(request.association?.rna).toBe(RNA.value);
    });

    it("clears missing rna when no rna is found and siret belongs to an association", async () => {
        const request = makeRequest({ association: { rna: undefined } });
        await useCase.execute(request);
        expect(request.association?.rna).toBeUndefined();
    });

    it("throws NOT_AN_ASSOCIATION when no rna is found and siret does not belong to an association", async () => {
        associationHelperMock.isIdentifierFromAsso.mockResolvedValueOnce(false);
        await expect(useCase.execute(makeRequest({ association: { rna: undefined } }))).rejects.toMatchObject({
            validation: { code: VALID_REQUEST_ERROR_CODE.NOT_AN_ASSOCIATION },
        });
    });
});
