import GetOsirisDetailsUseCase from "./get-osiris-details.use-case";
import { OsirisActionPort } from "../../../../adapters/outputs/db/providers/osiris/osiris-action.port";
import OsirisActionEntity from "../entities/OsirisActionEntity";

const makeAction = (year: number, intitule: string, description: string): OsirisActionEntity =>
    ({
        dossier: {
            osirisActionId: `OSIRIS-1-${year}`,
            uniqueId: `OSIRIS-1-${year}`,
            requestUniqueId: `OSIRIS-${year}`,
            compteAssoId: "21-000001",
            exerciceBudgetaire: year,
        },
        caracteristiques: { intitule, description },
        updateDate: new Date(),
    }) as OsirisActionEntity;

describe("GetOsirisDetailsUseCase", () => {
    const OSIRIS_ID = "DR-CENT-21-0002";
    let actionPortMock: jest.Mocked<Pick<OsirisActionPort, "findByOsirisId">>;
    let useCase: GetOsirisDetailsUseCase;

    beforeEach(() => {
        actionPortMock = { findByOsirisId: jest.fn() };
        useCase = new GetOsirisDetailsUseCase(actionPortMock as unknown as OsirisActionPort);
    });

    it("returns empty actions when no actions found", async () => {
        actionPortMock.findByOsirisId.mockResolvedValue([]);
        const result = await useCase.execute(OSIRIS_ID);
        expect(result).toEqual({ details: { actions: [] } });
    });

    it("returns simplified actions for an annual dossier", async () => {
        const actions = [makeAction(2023, "Action sport", "Description sport")];
        actionPortMock.findByOsirisId.mockResolvedValue(actions);

        const result = await useCase.execute(OSIRIS_ID);

        expect(result).toEqual({
            details: {
                actions: [{ intitule: "Action sport", description: "Description sport" }],
            },
        });
    });

    it("returns only actions from the most recent exercise for a pluriannual dossier", async () => {
        const actions = [makeAction(2022, "Action 2022", "Desc 2022"), makeAction(2023, "Action 2023", "Desc 2023")];
        actionPortMock.findByOsirisId.mockResolvedValue(actions);

        const result = await useCase.execute(OSIRIS_ID);

        expect(result).toEqual({
            details: {
                actions: [{ intitule: "Action 2023", description: "Desc 2023" }],
            },
        });
    });

    it("handles actions with missing caracteristiques by returning empty strings", async () => {
        const actionWithoutCaracteristiques = {
            dossier: {
                osirisActionId: "OSIRIS-1",
                uniqueId: "OSIRIS-1-2023",
                requestUniqueId: "OSIRIS-2023",
                compteAssoId: "21-000001",
                exerciceBudgetaire: 2023,
            },
            updateDate: new Date(),
        } as OsirisActionEntity;
        actionPortMock.findByOsirisId.mockResolvedValue([actionWithoutCaracteristiques]);

        const result = await useCase.execute(OSIRIS_ID);

        expect(result).toEqual({
            details: {
                actions: [{ intitule: "", description: "" }],
            },
        });
    });

    it("calls the adapter with the given osirisId", async () => {
        actionPortMock.findByOsirisId.mockResolvedValue([]);
        await useCase.execute(OSIRIS_ID);
        expect(actionPortMock.findByOsirisId).toHaveBeenCalledWith(OSIRIS_ID);
    });
});
