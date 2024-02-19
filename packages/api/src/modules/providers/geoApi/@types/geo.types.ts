import { ObjectId } from "mongodb";

export type GeoEntity = {
    departmentName: string;
    departmentCode: string;
    regionCode: string;
    regionName: string;
};

export type GeoDbo = {
    _id: ObjectId;
    departmentName: string;
    departmentCode: string;
    regionCode: string;
    regionName: string;
};
