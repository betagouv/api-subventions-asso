describe("Example of specification / integration test", () => {
    it("should return something", () => {
        const response = {
            statusCode: 200,
            body: { success: true, result: "Integration test example" }
        };
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchSnapshot();
    });
});
