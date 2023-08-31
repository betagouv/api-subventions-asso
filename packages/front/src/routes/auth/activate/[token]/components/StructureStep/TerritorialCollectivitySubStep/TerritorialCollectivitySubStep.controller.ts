import { TerritorialScopeEnum } from "dto";

export default class TerritorialCollectivitySubStepController {
    public scopeOptions: { value: string; label: TerritorialScopeEnum }[] = [
        {
            label: "Régional",
            value: TerritorialScopeEnum.REGIONAL,
        },
        {
            label: "Départemental",
            value: TerritorialScopeEnum.DEPARTMENTAL,
        },
        {
            label: "Intercommunal (EPCI)",
            value: TerritorialScopeEnum.INTERCOMMUNAL,
        },
        {
            label: "Communal",
            value: TerritorialScopeEnum.COMMUNAL,
        },
        {
            label: "Autre",
            value: TerritorialScopeEnum.OTHER,
        },
    ];
}
