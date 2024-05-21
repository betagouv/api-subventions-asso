export default interface DemarchesSimplifieesMapperEntity {
    demarcheId: number;
    schema: DemarchesSimplifieesMapperObject[];
    // TODO: should we make this mandatory ?
    commonSchema?: DemarchesSimplifieesMapperObject[];
}

export type DemarchesSimplifieesMapperObject = { from: string; to: string };
