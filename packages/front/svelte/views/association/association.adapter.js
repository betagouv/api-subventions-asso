import ProviderValueHelper from "../../../src/shared/helpers/ProviderValueHelper";

export const toAssociationView = association => {
    const reduceProviderValues = (acc, prop) => ({ ...acc, [prop]: ProviderValueHelper.getValue(association[prop]) });
    const associationProps = Object.keys(association);
    return associationProps.reduce(reduceProviderValues, {});
}