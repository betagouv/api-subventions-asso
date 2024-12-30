import type { ApplicationStatus } from "dto";
import type { TableCell } from "$lib/dsfr/TableCell.types";
import type { FlatGrant } from "$lib/resources/@types/FlattenGrant";

export type DashboardApplication = {
    montantAccorde?: number;
    montantDemande?: number;
    date_demande: Date | undefined;
    postal_code?: string;
    service_instructeur: string;
    dispositif?: string;
    nomProjet: string;
    statut_label: ApplicationStatus;
    annee_demande: number;
};

export type DashboardProgram =
    | null
    | string
    | {
          code: number;
          libelle: string;
      };

export type DashboardPayment = {
    total: number;
    dernier: Date;
    programme: DashboardProgram;
};

export interface DashboardGrant {
    payment?: DashboardPayment;
    application?: DashboardApplication;
}

export type SortableRow = {
    applicationCells: TableCell[] | null;
    paymentsCells: TableCell[] | null;
    payment?: DashboardPayment | null;
    application?: DashboardApplication | null;
    granted: boolean;
};
