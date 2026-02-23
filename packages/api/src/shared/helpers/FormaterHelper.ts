import { ProviderValue, ProviderValues } from "dto";
import { DefaultObject } from "../../@types";
import ProviderValueMapper from "../mappers/provider-value.mapper";

export default class FormaterHelper {
    private static sortAndFilter(
        data: DefaultObject<ProviderValues | ProviderValues[]>,
        providersScore: DefaultObject<number>,
    ) {
        const sort = (a: ProviderValue<unknown>, b: ProviderValue<unknown>) =>
            FormaterHelper.sortByProviders(a, b, providersScore);
        const filter = (value: ProviderValues) => FormaterHelper.keepOneDataByProvider(value);

        return Object.entries(data).reduce((data, [key, value]) => {
            if (!value) return data;

            if (ProviderValueMapper.isProviderValues(value)) {
                data[key] = filter(value).sort(sort);
            } else if (Array.isArray(value)) {
                value.forEach((subvalue, index) => {
                    value[index] = filter(subvalue).sort(sort);
                });
            }
            return data;
        }, data);
    }

    private static keepOneDataByProvider(data: ProviderValue[]) {
        return Object.values(
            data.reduce((acc, v) => {
                const key = `${JSON.stringify(v.value)}-${v.provider}`;

                if (acc[key]) return acc;

                acc[key] = v;
                return acc;
            }, {} as DefaultObject<ProviderValue>),
        );
    }

    private static sortByProviders(
        a: ProviderValue<unknown>,
        b: ProviderValue<unknown>,
        providersScore: DefaultObject<number>,
    ) {
        const score = (providersScore[b.provider] || 0) - (providersScore[a.provider] || 0);

        if (score === 0) {
            return b.last_update.getTime() - a.last_update.getTime();
        }

        return score;
    }

    private static getUniqueKeys(array1, array2) {
        return [...new Set([...Object.keys(array1), ...Object.keys(array2 || {})])];
    }

    private static merge(a: DefaultObject<unknown[]>, b: DefaultObject<unknown[]>) {
        const keys = this.getUniqueKeys(a, b);
        return keys.reduce((acc, key) => {
            if (ProviderValueMapper.isProviderValues(a[key] || b[key] || [])) {
                acc[key] = [
                    ...((a[key]?.length ? a[key].flat() : []) as unknown[]),
                    ...((b[key]?.length ? b[key].flat() : []) as unknown[]),
                ];
            } else if (a[key] && b[key]) {
                if (Array.isArray(a[key]) && Array.isArray(b[key])) {
                    acc[key] = [...a[key], ...b[key]].flat();
                } else {
                    acc[key] = FormaterHelper.merge(
                        a[key] as unknown as DefaultObject<unknown[]>,
                        b[key] as unknown as DefaultObject<unknown[]>,
                    );
                }
            } else {
                if (Array.isArray(a[key]) || Array.isArray(b[key])) {
                    acc[key] = a[key]?.flat() || b[key]?.flat();
                } else {
                    acc[key] = a[key] || b[key];
                }
            }
            return acc;
        }, {} as DefaultObject<unknown>) as DefaultObject<unknown[]>;
    }

    public static formatData(data: DefaultObject<unknown[]>[], providerScore: DefaultObject<number>) {
        let uniqueData;
        if (data.length === 1) {
            uniqueData = FormaterHelper.merge(data[0], data[0]);
        } else {
            uniqueData = data.reduce((acc, subData) =>
                FormaterHelper.merge(acc, subData),
            ) as DefaultObject<ProviderValues>;
        }
        return FormaterHelper.sortAndFilter(uniqueData, providerScore);
    }
}
