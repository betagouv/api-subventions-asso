import { ProviderDataEntity } from "../../src/@types/ProviderData";

export const expectAnyUpdateDate = (entity: ProviderDataEntity) => {
    return { ...entity, updateDate: expect.any(Date) };
};
