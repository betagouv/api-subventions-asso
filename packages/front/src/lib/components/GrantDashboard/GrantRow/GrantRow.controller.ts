import type { FlatGrant } from "$lib/resources/@types/FlattenGrant";
import { getApplicationCells, isGranted } from "$lib/components/GrantDashboard/application.helper";
import { getPaymentsCells } from "$lib/components/GrantDashboard/payments.helper";
import type { TableCell } from "$lib/dsfr/TableCell.types";

export class GrantRowController {
    public row: {
        paymentsCells: TableCell[] | null;
        applicationCells: TableCell[] | null;
        granted: boolean;
    };

    constructor(grant: FlatGrant) {
        const granted = isGranted(grant.application);
        this.row = {
            applicationCells: getApplicationCells(grant.application, granted),
            paymentsCells: getPaymentsCells(grant.payments),
            granted,
        };
    }
}
