<script lang="ts">
    import { nanoid } from "nanoid";

    type SelectOption = string | { label: string; value?: string | number };

    interface Props {
        options: SelectOption[];
        selected?: string | number | undefined;
        label?: string;
        narrow?: boolean;
        id?: string;
        required?: boolean;
        disabled?: boolean;
        onchange?: (selectedIndex: number) => void;
    }

    let {
        options,
        selected = $bindable(undefined),
        label = undefined,
        narrow = false,
        id = nanoid(7),
        required = false,
        disabled = false,
        onchange = () => {},
    }: Props = $props();

    const name = `select-${id}`;

    function onChange(e: Event) {
        onchange((e.target as HTMLSelectElement).selectedIndex - 1);
    }
</script>

<div class="fr-select-group" style:width={narrow ? "fit-content" : undefined}>
    {#if label}
        <label class="fr-label" for={name}>{label}</label>
    {/if}
    <select
        bind:value={selected}
        required={required ? "required" : undefined}
        disabled={disabled ? "disabled" : undefined}
        onchange={onChange}
        class="fr-select"
        {name}
        id={name}>
        <option value="" selected disabled hidden>Sélectionner une option</option>
        {#each options as option, index (index)}
            <option value={option.value ? option.value : index}>{option.label ? option.label : option}</option>
        {/each}
    </select>
</div>
