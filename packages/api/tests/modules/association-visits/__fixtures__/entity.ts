import { ObjectId } from "mongodb";
import AssociationVisitEntity from "../../../../src/modules/stats/entities/AssociationVisitEntity";

const now = new Date();
export const TODAY = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
export const THIS_MONTH = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
export const PREVIOUS_MONTH = new Date(Date.UTC(now.getFullYear(), now.getMonth() - 1, 1));

export default [
    {
        userId: "USER_1" as unknown as ObjectId,
        date: PREVIOUS_MONTH,
        associationIndentifier: "W931006748" // ASSOCIATION AURORE
    },
    {
        userId: "USER_2" as unknown as ObjectId,
        date: PREVIOUS_MONTH,
        associationIndentifier: "W931006748" // ASSOCIATION AURORE
    },
    {
        userId: "USER_1" as unknown as ObjectId,
        date: PREVIOUS_MONTH,
        associationIndentifier: "775724842" // AVENIR ET JOIE - JOC
    },
    {
        userId: "USER_2" as unknown as ObjectId,
        date: PREVIOUS_MONTH,
        associationIndentifier: "775724842" // AVENIR ET JOIE - JOC
    },
    {
        userId: "USER_1" as unknown as ObjectId,
        date: PREVIOUS_MONTH,
        associationIndentifier: "352535967"
    },
    {
        userId: "USER_1" as unknown as ObjectId,
        date: PREVIOUS_MONTH,
        associationIndentifier: "W912001498"
    },
    {
        userId: "USER_1" as unknown as ObjectId,
        date: PREVIOUS_MONTH,
        associationIndentifier: "W893006723" // LA CASERNE BASCULE
    },
    {
        userId: "USER_2" as unknown as ObjectId,
        date: PREVIOUS_MONTH,
        associationIndentifier: "W893006723" // LA CASERNE BASCULE
    },
    {
        userId: "USER_1" as unknown as ObjectId,
        date: PREVIOUS_MONTH,
        associationIndentifier: "W893006723" // LA CASERNE BASCULE
    },
    {
        userId: "USER_1" as unknown as ObjectId,
        date: THIS_MONTH,
        associationIndentifier: "W921009414" // ORIN ÀBAJADE
    },
    {
        userId: "USER_2" as unknown as ObjectId,
        date: THIS_MONTH,
        associationIndentifier: "W921009414" // ORIN ÀBAJADE
    },
    {
        userId: "USER_2" as unknown as ObjectId,
        date: TODAY,
        associationIndentifier: "502722978" // GROUPEMENT D EMPLOYEURS PROFESSION SPORT LOISIRS
    },
    {
        userId: "USER_1" as unknown as ObjectId,
        date: PREVIOUS_MONTH,
        associationIndentifier: "502722978" // GROUPEMENT D EMPLOYEURS PROFESSION SPORT LOISIRS
    },
    {
        userId: "USER_1" as unknown as ObjectId,
        date: PREVIOUS_MONTH,
        associationIndentifier: "502722978" // GROUPEMENT D EMPLOYEURS PROFESSION SPORT LOISIRS
    },
    {
        userId: "USER_1" as unknown as ObjectId,
        date: THIS_MONTH,
        associationIndentifier: "502722978" // GROUPEMENT D EMPLOYEURS PROFESSION SPORT LOISIRS
    },
    {
        userId: "USER_1" as unknown as ObjectId,
        date: TODAY,
        associationIndentifier: "502722978" // GROUPEMENT D EMPLOYEURS PROFESSION SPORT LOISIRS
    }
] as AssociationVisitEntity[];
