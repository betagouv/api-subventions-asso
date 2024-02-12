import type { AdminStructureDto } from "dto";
import { AdminTerritorialLevel, AgentTypeEnum } from "dto";
import type { EventDispatcher } from "svelte";
import Store from "$lib/core/Store";
import geoService from "$lib/resources/externals/geo/geo.service";
import subscriptionFormService from "$lib/resources/auth/subscriptionForm/subscriptionFormService";
import Dispatch from "$lib/core/Dispatch";
import type { Option } from "$lib/types/FieldOption";

export default class DecentralizedSubStepController {
    private allStructures: AdminStructureDto[];
    public structureOptions: Store<Option<string>[]>;
    public departmentOptions: Store<Option<string>[]>;
    public levelOptions: Option<AdminTerritorialLevel>[] = [
        { value: AdminTerritorialLevel.DEPARTMENTAL, label: "Départemental" },
        { value: AdminTerritorialLevel.INTERDEPARTMENTAL, label: "Interdépartemental" },
        { value: AdminTerritorialLevel.REGIONAL, label: "Régional" },
        { value: AdminTerritorialLevel.INTERREGIONAL, label: "Interrégional" },
        { value: AdminTerritorialLevel.OVERSEAS, label: "Collectivité d'outre-mer à statut particulier" },
    ];
    private dispatch: EventDispatcher<any>;

    constructor() {
        this.departmentOptions = new Store([]);
        this.structureOptions = new Store([]);
        this.allStructures = [];
        this.dispatch = Dispatch.getDispatcher();
    }

    async init(data: Record<string, any> = {}): Promise<void> {
        this.allStructures = await subscriptionFormService.getStructures(AgentTypeEnum.DECONCENTRATED_ADMIN);
        if (data.decentralizedLevel) this.setOptions(data.decentralizedLevel);
    }

    private setOptions(level: AdminTerritorialLevel) {
        if (level === AdminTerritorialLevel.DEPARTMENTAL) {
            this.onChoosingDepartment();
            this.filterStructureOptions(AdminTerritorialLevel.DEPARTMENTAL);
        }
        if (level === AdminTerritorialLevel.REGIONAL) {
            this.filterStructureOptions(AdminTerritorialLevel.REGIONAL);
        }
    }

    public onChoosingLevel(option: { label: string; value: AdminTerritorialLevel }) {
        this.dispatch("change");
        const level: AdminTerritorialLevel = option.value;
        this.setOptions(level);
    }

    private filterStructureOptions(LEVEL: AdminTerritorialLevel) {
        this.structureOptions.set(
            this.allStructures
                .filter(structure => structure.territorialLevel === LEVEL)
                .map(structure => ({
                    label: structure.structure,
                    value: structure.structure,
                })),
        );
    }

    private async fillOptionsOnce(
        optionStore: Store<Option<string>[]>,
        serviceMethod: () => Promise<{ code: string; nom: string }[]>,
        transform: (reg: { code: string; nom: string }) => string,
        sort = false,
    ) {
        if (optionStore.value.length) return;
        const territories = await serviceMethod();
        let options = territories.map(territory => ({
            label: transform(territory),
            value: transform(territory),
        }));
        if (sort) options = options.sort((a, b) => a.label.localeCompare(b.label));
        optionStore.set(options);
    }

    private onChoosingDepartment() {
        return this.fillOptionsOnce(
            this.departmentOptions,
            geoService.getDepartements,
            (dep: { code: string; nom: string }) => `${dep.code} - ${dep.nom}`,
        );
    }
}
