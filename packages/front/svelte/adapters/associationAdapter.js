import ProviderValueHelper from "../../src/shared/helpers/ProviderValueHelper";

export const toAssociationView = association => {
    const associationProps = Object.keys(association);
    return associationProps.reduce((acc, prop) => { acc[prop] = ProviderValueHelper.getValue(association[prop]);  return acc; }, {});
}