export interface BodaccRecord {
    id: string;
    famille: string;
    type: string;
    dateParution: string;
    tribunal: string;
    jugement: string;
    departement: { numero: number; nom: string };
    region: { numero: number; nom: string };
}
