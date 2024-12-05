import type { FlatGrant } from "$lib/resources/@types/FlattenGrant";
import { getApplicationCells, isGranted } from "$lib/components/GrantDashboard/application.helper";
import { getPaymentsCells } from "$lib/components/GrantDashboard/payments.helper";
import type { TableCell } from "$lib/dsfr/TableCell.types";
import type { DashboardApplication, DashboardPayment } from "$lib/components/GrantDashboard/@types/DashboardGrant";

export class GrantRowController {
    public row: {
        paymentsCells: TableCell[] | null;
        applicationCells: TableCell[] | null;
        granted: boolean;
    };

    constructor(row: {
        applicationCells: TableCell[];
        paymentsCells: TableCell[];
        granted: boolean;
        dashboardApplication: DashboardApplication;
        dashboardPayment: DashboardPayment;
    }) {
        const granted = isGranted(row.application);
        this.row = {
            applicationCells: getApplicationCells(grant.application, granted),
            paymentsCells: getPaymentsCells(grant.payments),
            granted,
        };
    }
}
