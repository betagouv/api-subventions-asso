<script lang="ts">
    /*
*   [combobox-autocomplete](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-both/#sc1_label)

  Copyright © 2023 World Wide Web Consortium. All Rights Reserved. This work is distributed under the W3C® Software and Document License [1] in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

  [1] https://www.w3.org/Consortium/Legal/copyright-software

  This software or document includes material copied from or derived from [combobox-autocomplete](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-both/#sc1_label). Copyright © 2023 World Wide Web Consortium. https://www.w3.org/copyright/software-license-2023/

*/

    // Careful : as it is, the svelte interface gives the *value* of the selected option
    // whereas a standard form submission would submit its *label*
    import { nanoid } from "nanoid";

    import "./combobox.css";
    import { onMount, tick } from "svelte";
    import Store from "$lib/core/Store";
    import { ComboboxAutocomplete } from "$lib/components/AutocompleteSelect/combobox.js";

    interface Props {
        value?: string; // to be bound by parent
        id?: string;
        name?: string;
        options: { value: string; label: string }[];
        label?: string;
        placeholder?: string;
        hint?: string;
        onchange?: () => void;
    }

    let {
        value = $bindable(""),
        id = nanoid(7),
        name = id,
        options,
        label = "",
        placeholder = "",
        hint = "",
        onchange = () => {},
    }: Props = $props();

    const listId = `list-${id}`;
    let inputElement: HTMLElement = $state(),
        buttonElement: HTMLElement = $state(),
        listElement: HTMLElement = $state();

    const storeValue = new Store(value);
    storeValue.subscribe(newV => {
        value = newV; // cannot be in controller so that binding works
        onchange();
    });

    let ctrl: ComboboxAutocomplete = $state();

    onMount(() => (ctrl = new ComboboxAutocomplete(inputElement, buttonElement, listElement, storeValue)));

    $effect(() => {
        if (!ctrl) return;
        void options;
        tick().then(() => ctrl?.initOptionsEvents());
    });
</script>

<div class="combobox combobox-list">
    <div class="group fr-input-group">
        <label for={id} class="fr-label">
            {label}
            {#if hint}<span class="fr-hint-text">{hint}</span>{/if}
        </label>
        <div class="fr-input-wrap">
            <input
                {id}
                class="fr-input"
                {name}
                {placeholder}
                type="text"
                role="combobox"
                aria-autocomplete="both"
                aria-expanded="false"
                aria-controls={listId}
                {onchange}
                bind:this={inputElement} />
            <button
                type="button"
                aria-label={label}
                aria-expanded="false"
                aria-controls={listId}
                tabindex="-1"
                bind:this={buttonElement}>
                <span class="fr-icon-arrow-down-s-line icon" aria-hidden="true"></span>
            </button>
        </div>

        <ul id={listId} role="listbox" aria-label={label} bind:this={listElement}>
            {#key options}
                {#each options as option, i (i)}
                    <li role="option" aria-selected="false" id="{id}-option-{i}" data-option-value={option.value}>
                        {option.label}
                    </li>
                {/each}
            {/key}
        </ul>
    </div>
</div>
