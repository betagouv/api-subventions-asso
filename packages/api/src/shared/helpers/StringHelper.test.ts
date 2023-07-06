import { sanitizeToPlainText } from "./StringHelper";

describe("StringHelper", () => {
    describe("sanitizeToPlainText", () => {
        it("sanitizes script", () => {
            const expected = "test";
            const actual = sanitizeToPlainText("<script>don't keep me</script>test");
            expect(actual).toBe(expected);
        });

        it("removes formatting tags", () => {
            const expected = "test";
            const actual = sanitizeToPlainText("<b>test</b>");
            expect(actual).toBe(expected);
        });
    });
});
