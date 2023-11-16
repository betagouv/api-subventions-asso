import ChorusCliController from "./chorus.cli.controller";
import chorusService from "../../chorus.service";
import { DEFAULT_CHORUS_LINE_ENTITY } from "../../__fixutres__/ChorusLineEntities";
import { addDaysToDate } from "../../../../../shared/helpers/DateHelper";
jest.mock("../../chorus.service");
const mockedChorusService = jest.mocked(chorusService);

describe("Chorus CLI", () => {
    let controller;

    describe("filterEntitiesToSave", () => {
        const MOST_RECENT_OPERATION_DATE = new Date("2023-07-30");

        beforeAll(() => {
            mockedChorusService.getMostRecentOperationDate.mockResolvedValue(MOST_RECENT_OPERATION_DATE);
        });
        beforeEach(() => (controller = new ChorusCliController()));

        it("should return parsedEntities if mostRecentOperationDate is null", async () => {
            mockedChorusService.getMostRecentOperationDate.mockResolvedValueOnce(null);
            const expected = [DEFAULT_CHORUS_LINE_ENTITY];
            const actual = await controller.filterEntitiesToSave([DEFAULT_CHORUS_LINE_ENTITY]);
            expect(actual).toEqual(expected);
        });

        it("should filter entities to save", async () => {
            const NEW_ENTITY = {
                ...DEFAULT_CHORUS_LINE_ENTITY,
                indexedInformations: {
                    ...DEFAULT_CHORUS_LINE_ENTITY.indexedInformations,
                    dateOperation: addDaysToDate(MOST_RECENT_OPERATION_DATE, 1),
                },
            };
            const expected = [NEW_ENTITY];
            const actual = await controller.filterEntitiesToSave([DEFAULT_CHORUS_LINE_ENTITY, NEW_ENTITY]);
            expect(actual).toEqual(expected);
        });
    });
});
