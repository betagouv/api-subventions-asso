export interface BodaccRecordProps {
    id: string;
    famille: string;
    type: string;
    dateParution: string;
    tribunal: string;
    jugement: string;
    departement: { numero: number; nom: string };
    region: { numero: number; nom: string };
}

export class BodaccRecordEntity {
    public id!: string;
    public famille!: string;
    public type!: string;
    public dateParution!: string;
    public tribunal!: string;
    public jugement!: string;
    public departement!: { numero: number; nom: string };
    public region!: { numero: number; nom: string };

    constructor(props: BodaccRecordProps) {
        Object.assign(this, props);
    }
}
