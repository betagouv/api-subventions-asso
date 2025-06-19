export type OrDefault<FlatType, DefaultType> = {
    [prop in keyof FlatType]: FlatType[prop] | DefaultType;
};
