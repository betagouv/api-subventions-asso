import { GeoDbo } from "../../../../../modules/providers/geoApi/@types/geo.types";

export interface GeoApiPort {
    createIndexes(): Promise<void>;

    insertMany(entities): Promise<void>;
    deleteAll(): Promise<void>;
    findByDepartmentName(departmentName: string): Promise<GeoDbo | null>;
}
