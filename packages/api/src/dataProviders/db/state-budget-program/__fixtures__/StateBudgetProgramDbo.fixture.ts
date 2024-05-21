import { ObjectId } from "mongodb";
import StateBudgetProgramDbo from "../StateBudgetProgramDbo";

export const STATE_BUDGET_PROGRAM_DBOS: StateBudgetProgramDbo[] = [
    {
        _id: new ObjectId("E42339FC7B5609C90B9F88C8"),
        label_programme: "Accès au droit et à la justice",
        code_programme: "101",
        mission: "Justice",
        code_ministere: "MIN01",
    },
    {
        _id: new ObjectId("A82082CC6DF8ACACE08A258E"),
        label_programme: "Accès et retour à l'emploi",
        code_programme: "102",
        mission: "Emploi",
        code_ministere: "MIN02",
    },
    {
        _id: new ObjectId("21A5BC9F1BCD5D67C069298C"),
        label_programme: "Accompagnement des mutations économiques et développement de l'emploi",
        code_programme: "103",
        mission: "Economie",
        code_ministere: "MIN03",
    },
];
