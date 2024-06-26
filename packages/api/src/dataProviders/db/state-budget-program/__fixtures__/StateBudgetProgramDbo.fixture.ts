import { ObjectId } from "mongodb";
import StateBudgetProgramDbo from "../StateBudgetProgramDbo";

export const STATE_BUDGET_PROGRAM_DBOS: StateBudgetProgramDbo[] = [
    {
        _id: new ObjectId("60f1b3b3d6f3b3b3b3b3b3b3"),
        label_programme: "Accès au droit et à la justice",
        code_programme: 101,
        mission: "Justice",
        code_ministere: "MIN01",
    },
    {
        _id: new ObjectId("60f1b3b3d6f3b3b3b3b3b3b4"),
        label_programme: "Accès et retour à l'emploi",
        code_programme: 102,
        mission: "Emploi",
        code_ministere: "MIN02",
    },
    {
        _id: new ObjectId("60f1b3b3d6f3b3b3b3b3b3b5"),
        label_programme: "Accompagnement des mutations économiques et développement de l'emploi",
        code_programme: 103,
        mission: "Economie",
        code_ministere: "MIN03",
    },
];
