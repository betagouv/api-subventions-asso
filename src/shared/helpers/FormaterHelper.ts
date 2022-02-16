import ProviderValue, { ProviderValues } from "../../@types/ProviderValue";
import { DefaultObject } from "../../@types/utils";
import ProviderValueAdapter from "../adapters/ProviderValueAdapter";

export default class FormaterHelper {
    private static sortAndFilter(data: DefaultObject<ProviderValues | ProviderValues[]>, providersScore: DefaultObject<number>) {
        const sort = (a: ProviderValue<unknown>, b: ProviderValue<unknown>) => FormaterHelper.sortByProviders(a,b,providersScore);
        const filter = (value: ProviderValues) => FormaterHelper.keepOneDataByProvider(value);
        
        return Object.entries(data).reduce((data, [key, value]) => {
            if (!value) return data;
    
            if (ProviderValueAdapter.isProviderValues(value)) {
                data[key] = filter(value).sort(sort)
            } else if (Array.isArray(value)) {
                value.forEach((subvalue, index) => {
                    value[index] = filter(subvalue).sort(sort);
                });
            }
            return data;
        }, data)
    }

    private static keepOneDataByProvider(data: ProviderValue[]) {
        return Object.values(data.reduce((acc, v) => {
            const key = `${JSON.stringify(v.value)}-${v.provider}`;

            if (acc[key]) return acc;
            
            acc[key] = v;
            return acc;
        }, {} as DefaultObject<ProviderValue>))
    }

    private static sortByProviders(a: ProviderValue<unknown>, b: ProviderValue<unknown>, providersScore: DefaultObject<number>) {
        const score = (providersScore[b.provider] || 0) - (providersScore[a.provider] || 0);

        if (score === 0) {
            return b.last_update.getTime() - a.last_update.getTime();
        }

        return score;
    }

    private static merge(a: DefaultObject<unknown[]>, b: DefaultObject<unknown[]>) {
        const keys = [...new Set([...Object.keys(a), ...Object.keys(b || {})])];
        return keys.reduce((acc, key) => {
            if (ProviderValueAdapter.isProviderValues(a[key] || b[key] || [])) {
                acc[key] = [
                    ...(a[key]?.length ? a[key] : []) as unknown[],
                    ...(b[key]?.length ? b[key] : []) as unknown[],
                ];
            }
            else if (a[key] && b[key]){
                if (Array.isArray(a[key]) && Array.isArray(b[key])) {
                    acc[key] = [...a[key], ...b[key]].flat();
                } else {
                    acc[key] = FormaterHelper.merge(a[key] as unknown as DefaultObject<unknown[]>, b[key] as unknown as DefaultObject<unknown[]>)
                }
            } else {
                acc[key] = a[key] || b[key];
            }
            return acc;
        }, {} as DefaultObject<unknown>) as DefaultObject<unknown[]>
    }

    public static formatData(data: DefaultObject<unknown[]>[], providerScore: DefaultObject<number>) {
        const uniqueData = data.reduce((acc, subData) => FormaterHelper.merge(acc , subData)) as DefaultObject<ProviderValues>;
        return FormaterHelper.sortAndFilter(uniqueData , providerScore);
    }
}