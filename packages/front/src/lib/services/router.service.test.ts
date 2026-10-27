import { PAGE_ADMIN_USERS_ACCOUNT_NAME } from "../../routes/admin/admin.constant";
import * as RouterService from "./router.service";

describe("Router Service", () => {
    describe("buildBreadcrumbs()", () => {
        it("should return association breadcrumbs", () => {
            const expected = [{ label: "Association (RNA)" }];
            const actual = RouterService.buildBreadcrumbs("/association/RNA");
            expect(actual).toEqual(expected);
        });

        it("should return admin breadcrumbs", () => {
            const expected = [{ label: "Admin", url: "/admin" }, { label: PAGE_ADMIN_USERS_ACCOUNT_NAME }];
            const actual = RouterService.buildBreadcrumbs("/admin/users/list");
            expect(actual).toEqual(expected);
        });

        it("should return data viz breadcrumbs", () => {
            const expected = [{ label: "Visualisation de données" }];
            const actual = RouterService.buildBreadcrumbs("/dataviz");
            expect(actual).toEqual(expected);
        });
    });
});
