import * as SirenHelper from "../../../src/shared/helpers/SirenHelper" 

describe("SirenHelper", () => {
    describe("siretToSiren", () => {
        it("should return siren", () => {
            expect(SirenHelper.siretToSiren("12345678911111")).toBe("123456789")
        })
    })

    describe("siretToNic", () => {
        it("should return nic", () => {
            expect(SirenHelper.siretToNIC("12345678911111")).toBe("11111")
        })
    })
})