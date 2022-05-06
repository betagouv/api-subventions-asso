import associationsService from "../../../src/modules/associations/associations.service";

describe("associations.service.ts", () => {

    describe("getAssociationBySiren", () => {
        it('should return null', async () => {
            const actual = await associationsService.getAssociationBySiren("0");
            const expected = null;
            expect(actual).toBe(expected);
        });

        it('should return association data', async () => {
            const data = await associationsService.getAssociationBySiren("517673091");
            expect(data).toMatchSnapshot()
        });
    })

    describe("getAssociationBySiret", () => {
        it('should return null', async () => {
            const actual = await associationsService.getAssociationBySiret("0");
            const expected = null;
            expect(actual).toBe(expected);
        });

        it('should return association data', async () => {
            const data = await associationsService.getAssociationBySiret("51767309100016");
            expect(data).toMatchSnapshot();
        });
    })
});