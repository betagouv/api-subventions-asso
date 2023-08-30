import { TerritorialScopeEnum } from "dto";

export default class TerritorialCollectivitySubStepController {
    private scopeOptions: { value: string; label: string }[] = [
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
